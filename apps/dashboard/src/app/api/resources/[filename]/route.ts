import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: Only allow PDF files and prevent directory traversal
    if (
      !filename.endsWith(".pdf") ||
      filename.includes("..") ||
      filename.includes("/")
    ) {
      return new NextResponse("Invalid file", { status: 400 });
    }

    const filePath = join(process.cwd(), "src/app/resources", filename);

    const fileBuffer = await readFile(filePath);

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
