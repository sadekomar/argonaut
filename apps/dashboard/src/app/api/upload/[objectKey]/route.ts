import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { deleteQuoteFile } from "@/app/quotes/_utils/delete-quote-file";

const s3 = new S3Client();
const BUCKET_NAME = "argonaut-bucket-200-crm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ objectKey: string }> }
) {
  try {
    const { objectKey } = await params;

    // Security: Prevent directory traversal
    if (objectKey.includes("..") || objectKey.includes("//")) {
      return new NextResponse("Invalid file path", { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Convert the stream to a buffer
    const chunks: Uint8Array[] = [];
    // @ts-expect-error - Body is a Readable stream in Node.js
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Determine content type from response or file extension
    const contentType =
      response.ContentType ||
      getContentTypeFromExtension(objectKey) ||
      "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${getFileName(objectKey)}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching S3 file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ objectKey: string }> }
) {
  try {
    const { objectKey } = await params;

    if (!objectKey || objectKey.includes("..") || objectKey.includes("//")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const quoteId = body?.quoteId;

    if (!quoteId || typeof quoteId !== "string") {
      return NextResponse.json(
        { error: "quoteId is required" },
        { status: 400 }
      );
    }

    const deleteDbResult = await deleteQuoteFile(quoteId, objectKey);
    if (!deleteDbResult.success) {
      return NextResponse.json(
        deleteDbResult.errors ?? { error: "Unable to delete file" },
        { status: deleteDbResult.status ?? 400 }
      );
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting S3 file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

function getContentTypeFromExtension(filename: string): string | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  return extension ? contentTypes[extension] || null : null;
}

function getFileName(objectKey: string): string {
  const parts = objectKey.split("/");
  return parts[parts.length - 1] || objectKey;
}
