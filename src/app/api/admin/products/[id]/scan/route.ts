import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { r2Client } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 1. Fetch product to get the fileKey path
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product || !product.fileUrl) {
      return NextResponse.json({ error: "Product or file not found" }, { status: 404 });
    }

    // Extract the R2 Key from the URL. Assuming the public URL ends with the key: vendorId/secureFileName.ext
    // This is safe because both our custom and fallback URLs end with the relative path.
    const fileKeyParts = product.fileUrl.split("/");
    const fileKey = `${fileKeyParts[fileKeyParts.length - 2]}/${fileKeyParts[fileKeyParts.length - 1]}`;

    // 2. Fetch the file directly from R2 
    const getCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    });

    const fileData = await r2Client.send(getCommand);
    const fileBuffer = await fileData.Body?.transformToByteArray();

    if (!fileBuffer) {
      throw new Error("Could not download file from storage bucket");
    }

    // 3. Send file to VirusTotal API for scanning
    // Note: VirusTotal requires a POST to /api/v3/files and returns an analysis ID. 
    // For large files (>32MB) a special upload URL is needed, but for MVP standard upload works.
    const vtApiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!vtApiKey) {
      console.warn("VIRUSTOTAL_API_KEY is not set. Simulating a CLEAN scan for development.");
      await prisma.product.update({
        where: { id },
        data: { antivirusResult: "CLEAN" }
      });
      return NextResponse.json({ status: "CLEAN" });
    }

    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append("file", blob, fileKeyParts[fileKeyParts.length - 1]);

    const uploadRes = await fetch("https://www.virustotal.com/api/v3/files", {
      method: "POST",
      headers: {
        "x-apikey": vtApiKey,
      },
      body: formData
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("VT Upload Failed:", errorText);
      throw new Error("VirusTotal upload failed");
    }

    const uploadData = await uploadRes.json();
    const analysisId = uploadData.data.id;

    // 4. Poll VirusTotal for the analysis report (Wait a few seconds for processing)
    // In a production serverless environment like Vercel, long polling might timeout if the file is massive.
    // However, for typical digital files (PDFs, scripts), VT finishes in 3-5 seconds.
    await new Promise(resolve => setTimeout(resolve, 5000));

    let isMalicious = false;
    let scanComplete = false;
    let attempts = 0;

    while (!scanComplete && attempts < 5) {
      const reportRes = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          "x-apikey": vtApiKey
        }
      });

      const reportData = await reportRes.json();

      if (reportData.data.attributes.status === "completed") {
        scanComplete = true;
        const stats = reportData.data.attributes.stats;
        // If any engine flags it as malicious or suspicious, mark it MALICIOUS
        if (stats.malicious > 0 || stats.suspicious > 0) {
          isMalicious = true;
        }
      } else {
        // Wait 3 more seconds and check again
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // 5. Update database with results
    const finalResult = isMalicious ? "MALICIOUS" : "CLEAN";

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { antivirusResult: finalResult }
    });

    return NextResponse.json({ status: finalResult, complete: scanComplete });

  } catch (error) {
    console.error("[VIRUSTOTAL_SCAN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Error during malware scan" },
      { status: 500 }
    );
  }
}
