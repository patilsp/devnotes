"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle, RefreshCw } from "lucide-react";

interface MermaidViewerProps {
  chart: string;
  className?: string;
}

export function MermaidViewer({ chart, className = "" }: MermaidViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [svg, setSvg] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const { resolvedTheme } = useTheme();

  const cleanChart = React.useMemo(() => {
    let text = chart.trim();
    if (text.startsWith("```mermaid")) {
      text = text.replace(/^```mermaid\s*/i, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```[a-z]*\s*/i, "").replace(/```$/, "").trim();
    }
    return text;
  }, [chart]);

  const renderDiagram = React.useCallback(async () => {
    if (!cleanChart) return;
    setError(null);

    try {
      const mermaidModule = (await import("mermaid")).default;
      mermaidModule.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "var(--font-sans, inherit)",
      });

      const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      const { svg } = await mermaidModule.render(uniqueId, cleanChart);
      setSvg(svg);
    } catch (err) {
      console.warn("Mermaid render error:", err);
      setError(err instanceof Error ? err.message : "Invalid Mermaid diagram syntax");
    }
  }, [cleanChart, resolvedTheme]);

  React.useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cleanChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-lg border bg-card text-card-foreground p-4 overflow-hidden my-3 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b text-xs text-muted-foreground">
        <span className="font-mono font-medium flex items-center gap-1.5 text-primary">
          <span className="size-2 rounded-full bg-primary" />
          Mermaid Architecture Diagram
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={renderDiagram}
            className="h-6 px-2 text-xs gap-1"
            title="Re-render diagram"
          >
            <RefreshCw className="size-3" />
            Rerender
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-6 px-2 text-xs gap-1"
            title="Copy Mermaid source"
          >
            {copied ? (
              <Check className="size-3 text-green-500" />
            ) : (
              <Copy className="size-3" />
            )}
            {copied ? "Copied" : "Copy Code"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertCircle className="size-4" />
            Diagram Render Error
          </div>
          <p className="font-mono text-[11px] whitespace-pre-wrap">{error}</p>
          <details className="text-[11px] text-muted-foreground mt-2 cursor-pointer">
            <summary>View Source Code</summary>
            <pre className="mt-1 p-2 rounded bg-muted/60 text-foreground overflow-x-auto">
              {cleanChart}
            </pre>
          </details>
        </div>
      ) : svg ? (
        <div
          ref={containerRef}
          className="flex justify-center items-center py-4 overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
          Rendering diagram...
        </div>
      )}
    </div>
  );
}
