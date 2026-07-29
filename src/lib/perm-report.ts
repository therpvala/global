/**
 * Formatted permission report → PDF.
 *
 * Renders a print-optimised HTML document in a hidden iframe and invokes the
 * browser print pipeline so admins can save/share a paginated PDF without any
 * server round-trip.
 */

export interface ReportTable {
  title: string;
  head: string[];
  rows: (string | number)[][];
  note?: string;
}

export interface ReportDoc {
  title: string;
  subtitle?: string;
  meta: { label: string; value: string }[];
  summary?: { label: string; value: string }[];
  tables: ReportTable[];
}

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function renderTable(t: ReportTable): string {
  return `
  <section class="tbl">
    <h2>${esc(t.title)}</h2>
    ${t.note ? `<p class="note">${esc(t.note)}</p>` : ""}
    <table>
      <thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>
        ${t.rows
          .map(
            (r) =>
              `<tr>${r
                .map((c) => {
                  const v = String(c ?? "");
                  const cls = /^(deny|denied)$/i.test(v)
                    ? " class=\"deny\""
                    : /^(allow|granted)$/i.test(v)
                      ? " class=\"allow\""
                      : "";
                  return `<td${cls}>${esc(v)}</td>`;
                })
                .join("")}</tr>`,
          )
          .join("")}
        ${t.rows.length === 0 ? `<tr><td colspan="${t.head.length}" class="empty">No rows</td></tr>` : ""}
      </tbody>
    </table>
  </section>`;
}

export function buildReportHtml(doc: ReportDoc): string {
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${esc(doc.title)}</title>
<style>
  @page { size: A4 landscape; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; }
  header { border-bottom: 3px solid #4f46e5; padding-bottom: 10px; margin-bottom: 14px; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  .sub { font-size: 11px; color: #4b5563; margin: 0; }
  .meta { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 8px; font-size: 10px; color: #374151; }
  .meta b { color: #111827; }
  .cards { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; min-width: 120px; }
  .card span { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; }
  .card strong { font-size: 16px; }
  section.tbl { margin-bottom: 16px; page-break-inside: auto; }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #374151; margin: 0 0 6px; }
  p.note { font-size: 10px; color: #6b7280; margin: 0 0 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5px; }
  th { background: #f3f4f6; text-align: left; padding: 5px 6px; border: 1px solid #e5e7eb; font-weight: 600; }
  td { padding: 4px 6px; border: 1px solid #e5e7eb; vertical-align: top; }
  tr { page-break-inside: avoid; }
  td.deny { color: #b91c1c; font-weight: 600; }
  td.allow { color: #047857; font-weight: 600; }
  td.empty { text-align: center; color: #9ca3af; }
  footer { position: fixed; bottom: 4mm; left: 0; right: 0; font-size: 9px; color: #9ca3af; text-align: center; }
</style></head>
<body>
  <header>
    <h1>${esc(doc.title)}</h1>
    ${doc.subtitle ? `<p class="sub">${esc(doc.subtitle)}</p>` : ""}
    <div class="meta">${doc.meta.map((m) => `<div><b>${esc(m.label)}:</b> ${esc(m.value)}</div>`).join("")}</div>
  </header>
  ${
    doc.summary?.length
      ? `<div class="cards">${doc.summary
          .map((s) => `<div class="card"><span>${esc(s.label)}</span><strong>${esc(s.value)}</strong></div>`)
          .join("")}</div>`
      : ""
  }
  ${doc.tables.map(renderTable).join("")}
  <footer>Vala Nexus · Confidential access governance report · generated ${esc(new Date().toLocaleString())}</footer>
</body></html>`;
}

/** Opens the browser print dialog (Save as PDF) with the formatted report. */
export function printReportPdf(doc: ReportDoc) {
  if (typeof window === "undefined") return;
  const html = buildReportHtml(doc);
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (!win) {
    document.body.removeChild(frame);
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  const run = () => {
    win.focus();
    win.print();
    window.setTimeout(() => frame.remove(), 1000);
  };
  if (win.document.readyState === "complete") window.setTimeout(run, 60);
  else frame.onload = () => window.setTimeout(run, 60);
}