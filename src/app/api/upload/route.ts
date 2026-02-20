import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate the user
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'VENDOR') {
          throw new Error('Unauthorized: Only vendors can upload files');
        }

        // Generate a clean filename: vendorId/timestamp-filename
        const safePathname = pathname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const finalPathname = `${session.user.id}/${Date.now()}-${safePathname}`;

        return {
          allowedContentTypes: [
            // Allow common digital product types
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'audio/mpeg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'application/epub+zip', // epub
            'text/plain',
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB limit per file
          validUntil: Date.now() + 5 * 60 * 1000, // Token valid for 5 mins
          tokenPayload: JSON.stringify({
            vendorId: session.user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Blob upload completed', blob.url);
        // We don't save to the DB here because the product isn't created yet.
        // We just log that the file was successfully uploaded.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 500 errors
    );
  }
}
