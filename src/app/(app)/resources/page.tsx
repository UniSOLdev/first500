import Link from "next/link";
import { RESOURCES } from "@/content/resources";
import { requireEntitlement } from "@/lib/auth/server";
import { CopyButton } from "@/components/challenge/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ResourcesPage() {
  await requireEntitlement();

  const grouped = RESOURCES.reduce<Record<string, typeof RESOURCES>>(
    (acc, resource) => {
      if (!acc[resource.category]) acc[resource.category] = [];
      acc[resource.category].push(resource);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped).sort();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
            ← Dashboard
          </Button>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Scripts & Templates
        </h1>
        <p className="text-muted-foreground">
          Copy-ready outreach scripts, follow-ups, and operational checklists for
          your local service business.
        </p>
      </header>

      {categories.map((category) => (
        <section key={category} className="space-y-4">
          <h2 className="font-heading text-lg font-medium">{category}</h2>
          <div className="grid gap-4">
            {grouped[category].map((resource) => (
              <Card key={resource.id} size="sm">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="outline">{resource.category}</Badge>
                    </CardDescription>
                  </div>
                  <CopyButton text={resource.content} />
                </CardHeader>
                <CardContent>
                  <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-xs leading-relaxed">
                    {resource.content}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
