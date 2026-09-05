/**
 * Exports data to a CSV file and triggers a browser download.
 * Adds UTF-8 BOM (\uFEFF) so Arabic characters and Unicode strings render
 * correctly when opened in spreadsheet software like Microsoft Excel.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
): void {
  if (typeof window === "undefined") {
    return;
  }

  const escapeCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) {
      return "";
    }
    const str = String(cell);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(",");
  const rowLines = rows.map((row) => row.map(escapeCell).join(","));
  const csvContent = "\uFEFF" + [headerLine, ...rowLines].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const cleanFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;

  anchor.href = url;
  anchor.setAttribute("download", cleanFilename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
