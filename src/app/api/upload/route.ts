import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Unauthorized: Only vendors can upload files' }, { status: 401 });
    }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and content type are required' }, { status: 400 });
    }

    // Safely extract the original file extension (e.g., .zip, .mp4, .pdf)
    const fileExtension = filename.includes('.') ? `.${filename.split('.').pop()}` : '';

    // Generate a secure layout: vendorId/uuid.ext
    // This prevents path traversal, malicious characters, and predictable file URLs
    const secureFileName = `${crypto.randomUUID()}${fileExtension}`;
    const finalPathname = `${session.user.id}/${secureFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: finalPathname,
      ContentType: contentType,
    });

    // Enforce a strict 60-second expiration window
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 }); // 1 minute

    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${finalPathname}`
      // Fallback domain format for R2. Warning: Many R2 buckets restrict public access without custom domain or r2.dev enabled!
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${finalPathname}`;

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      finalPathname
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
