import { readdir } from "fs/promises";
import { join } from "path";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

async function getPdfFiles() {
  const resourcesDir = join(process.cwd(), "src/app/resources");
  const files = await readdir(resourcesDir);

  // Filter only PDF files
  return files.filter((file) => file.endsWith(".pdf"));
}

export default async function ResourcesPage() {
  const pdfFiles = await getPdfFiles();

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-2">
          Download authorization letters and documents
        </p>
      </div>

      <div className="grid gap-4">
        {pdfFiles.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-8">
                No PDF files found.
              </p>
            </CardContent>
          </Card>
        ) : (
          pdfFiles.map((filename) => (
            <Card key={filename}>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {filename.replace(".pdf", "")}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        PDF Document
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <a
                      href={`/api/resources/${encodeURIComponent(filename)}`}
                      download={filename}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
