import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;

    // Validate path segments
    if (
      path.some(
        (segment) =>
          segment.includes("..") ||
          segment.includes("/") ||
          segment.includes("\\")
      )
    ) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const filename = path[path.length - 1];
    const fullRelativePath = path.join("/");

    // Security: Only allow PDF files
    if (!filename.toLowerCase().endsWith(".pdf")) {
      return new NextResponse("Invalid file type", { status: 400 });
    }

    const filePath = join(process.cwd(), "src/app/resources", ...path);

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
