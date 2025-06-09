// This route is protected by the middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/userStore';
import { User } from '@/lib/types'; // Ensure User type has uploadedDocuments
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = await userDb.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // In a real application, you would handle multipart/form-data here
    // For example, using a library like 'formidable' or Next.js specific API for file streams.
    // const formData = await req.formData();
    // const file = formData.get('document') as File | null;
    // const documentType = formData.get('documentType') as string | null;

    // MOCKING file upload: Assume we receive document info in JSON body for simplicity
    const { fileName, documentType, fileSize } = await req.json();

    if (!fileName || !documentType) {
      return NextResponse.json({ message: 'Missing document information (fileName, documentType)' }, { status: 400 });
    }

    // Mock file storage and URL generation
    const mockFileId = crypto.randomBytes(16).toString('hex');
    const mockFileExtension = fileName.split('.').pop() || 'bin';
    const mockStoredFileName = `${mockFileId}.${mockFileExtension}`;
    const mockFileUrl = `/uploads/documents/${userId}/${mockStoredFileName}`; // Example path

    const newDocument = {
      id: mockFileId,
      url: mockFileUrl,
      fileName: fileName,
      documentType: documentType, // e.g., 'passport', 'drivers_license'
      uploadedAt: new Date(),
      status: 'pending_review' as const, // Type assertion for specific string literal types
    };

    const updatedDocuments = user.uploadedDocuments ? [...user.uploadedDocuments, newDocument] : [newDocument];

    await userDb.updateUser(userId, {
      uploadedDocuments: updatedDocuments,
      verificationStatus: 'pending_document_review',
    });

    return NextResponse.json({
      message: 'Document uploaded successfully. Awaiting review.',
      documentId: newDocument.id,
      filePath: newDocument.url
    }, { status: 200 });

  } catch (error) {
    console.error('Document Upload error:', error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload. If sending a file, ensure it is multipart/form-data and handled accordingly on the server.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
