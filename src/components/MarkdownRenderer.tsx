"use client";

import React from "react";
import { KaTeXMath } from "./KaTeXMath";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split into lines
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let index = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Math Block $$ ... $$
    if (line.trim().startsWith("$$") && line.trim().endsWith("$$") && line.trim().length > 4) {
      const math = line.trim().slice(2, -2).trim();
      elements.push(
        <div key={`math-${index++}`} className="my-4 p-4 bg-vet-cream/50 rounded-2xl border border-vet-mint/20 text-center overflow-x-auto">
          <KaTeXMath math={math} block={true} className="text-vet-slate font-medium text-lg" />
        </div>
      );
      i++;
      continue;
    }

    // Code block ```
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={`code-${index++}`} className="my-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-slate-100 shadow-md">
          {lang && (
            <div className="bg-slate-800 px-4 py-1.5 text-xs font-mono text-slate-400 border-b border-slate-700">
              {lang}
            </div>
          )}
          <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed">
            {codeLines.join("\n")}
          </pre>
        </div>
      );
      continue;
    }

    // Table
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split("|").slice(1, -1).map((s) => s.trim());
        const dataRows = tableLines.slice(2).map((row) =>
          row.split("|").slice(1, -1).map((s) => s.trim())
        );

        elements.push(
          <div key={`table-${index++}`} className="my-6 overflow-x-auto rounded-2xl border border-vet-mint/30 shadow-sm bg-white">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-vet-mint/15 to-vet-cream/50 text-slate-800 font-semibold border-b border-vet-mint/30">
                <tr>
                  {headerRow.map((head, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 font-bold text-xs uppercase tracking-wider">
                      {renderInlineText(head)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50 hover:bg-vet-cream/20 transition-colors"}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 align-top leading-relaxed text-xs md:text-sm">
                        {renderInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Heading 1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${index++}`} className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-8 mb-4 tracking-tight flex items-center gap-2">
          {renderInlineText(line.replace("# ", ""))}
        </h1>
      );
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${index++}`} className="text-xl md:text-2xl font-bold text-slate-800 mt-6 mb-3 border-b border-slate-200 pb-2">
          {renderInlineText(line.replace("## ", ""))}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${index++}`} className="text-lg md:text-xl font-bold text-vet-teal mt-5 mb-2">
          {renderInlineText(line.replace("### ", ""))}
        </h3>
      );
      i++;
      continue;
    }

    // Heading 4
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={`h4-${index++}`} className="text-base md:text-lg font-semibold text-slate-800 mt-4 mb-2">
          {renderInlineText(line.replace("#### ", ""))}
        </h4>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].replace("> ", ""));
        i++;
      }
      elements.push(
        <div key={`quote-${index++}`} className="my-4 p-4 rounded-2xl bg-gradient-to-r from-vet-coral/10 via-vet-cream/40 to-white border-l-4 border-vet-coral shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🐕</span>
            <div className="text-sm md:text-base text-slate-700 italic space-y-1">
              {quoteLines.map((ql, qIdx) => (
                <p key={qIdx}>{renderInlineText(ql)}</p>
              ))}
            </div>
          </div>
        </div>
      );
      continue;
    }

    // Divider
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={`hr-${index++}`} className="my-6 border-slate-200" />);
      i++;
      continue;
    }

    // Bullet list item
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${index++}`} className="my-3 space-y-2 pl-4 list-disc marker:text-vet-mint text-slate-700">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="leading-relaxed text-sm md:text-base">
              {renderInlineText(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${index++}`} className="my-3 space-y-2 pl-5 list-decimal marker:text-vet-teal marker:font-bold text-slate-700">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="leading-relaxed text-sm md:text-base">
              {renderInlineText(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={`p-${index++}`} className="my-3 text-slate-700 leading-relaxed text-sm md:text-base">
        {renderInlineText(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
};

// Helper function to render bold, italic, inline code, and math ($...$)
function renderInlineText(text: string): React.ReactNode {
  if (!text) return null;

  // Split by inline math delimiter ($...$)
  const mathSegments = text.split(/(\$[^$]+\$)/g);

  return mathSegments.map((segment, sIdx) => {
    // Check if segment is inline math
    if (segment.startsWith("$") && segment.endsWith("$") && segment.length > 2) {
      const math = segment.slice(1, -1);
      return <KaTeXMath key={sIdx} math={math} block={false} className="mx-0.5 text-vet-teal font-semibold" />;
    }

    // Parse bold, italic, code inside regular text
    // Replace <br> or <br/> with newline or spaces
    const cleanText = segment.replace(/<br\s*\/?>/gi, " ");

    // Handle **bold**
    const boldParts = cleanText.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length > 4) {
        const inner = bPart.slice(2, -2);
        return <strong key={`${sIdx}-${bIdx}`} className="font-bold text-slate-900">{inner}</strong>;
      }

      // Handle *italic*
      const italicParts = bPart.split(/(\*[^*]+\*)/g);
      return italicParts.map((iPart, iIdx) => {
        if (iPart.startsWith("*") && iPart.endsWith("*") && iPart.length > 2) {
          return <em key={`${sIdx}-${bIdx}-${iIdx}`} className="italic">{iPart.slice(1, -1)}</em>;
        }

        // Handle `code`
        const codeParts = iPart.split(/(`[^`]+`)/g);
        return codeParts.map((cPart, cIdx) => {
          if (cPart.startsWith("`") && cPart.endsWith("`") && cPart.length > 2) {
            return (
              <code key={`${sIdx}-${bIdx}-${iIdx}-${cIdx}`} className="px-1.5 py-0.5 bg-slate-100 text-vet-coral rounded text-xs font-mono border border-slate-200">
                {cPart.slice(1, -1)}
              </code>
            );
          }
          return cPart;
        });
      });
    });
  });
}
