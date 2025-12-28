import { readdir } from "fs/promises";
import { join } from "path";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, FolderOpen } from "lucide-react";

type ResourceItem = {
  name: string;
  filename: string;
  path: string;
};

type ResourceCategory = {
  title: string;
  items: ResourceItem[];
};

async function getResources(): Promise<ResourceCategory[]> {
  const resourcesDir = join(process.cwd(), "src/app/resources");
  const entries = await readdir(resourcesDir, { withFileTypes: true });

  const categories: ResourceCategory[] = [];
  const rootItems: ResourceItem[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dirPath = join(resourcesDir, entry.name);
      const files = await readdir(dirPath);
      const pdfs = files.filter((f) => f.toLowerCase().endsWith(".pdf"));

      if (pdfs.length > 0) {
        categories.push({
          title: entry.name,
          items: pdfs.map((f) => ({
            name: f.replace(/\.pdf$/i, ""),
            filename: f,
            path: `${entry.name}/${f}`,
          })),
        });
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      rootItems.push({
        name: entry.name.replace(/\.pdf$/i, ""),
        filename: entry.name,
        path: entry.name,
      });
    }
  }

  categories.sort((a, b) => a.title.localeCompare(b.title));

  if (rootItems.length > 0) {
    categories.push({
      title: "Other Resources",
      items: rootItems,
    });
  }

  return categories;
}

export default async function ResourcesPage() {
  const categories = await getResources();

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-2">
          Download authorization letters and documents
        </p>
      </div>

      <div className="space-y-10">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-8">
                No resources found.
              </p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-muted-foreground" />
                {category.title}
              </h2>
              <div className="grid gap-4">
                {category.items.map((item) => (
                  <Card key={item.path}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {item.name}
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
                            href={`/api/resources/${item.path
                              .split("/")
                              .map(encodeURIComponent)
                              .join("/")}`}
                            download={item.filename}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
