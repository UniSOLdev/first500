import { PRODUCT } from "@/config/product";
import { cn } from "@/lib/utils";

type TaglineProps = {
  className?: string;
  showDescriptor?: boolean;
};

export function Tagline({ className, showDescriptor = true }: TaglineProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {showDescriptor && (
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {PRODUCT.descriptor}
        </p>
      )}
      <p className="text-sm font-medium text-brand italic">
        &ldquo;{PRODUCT.tagline}&rdquo;
      </p>
    </div>
  );
}
