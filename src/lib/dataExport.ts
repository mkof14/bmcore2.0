import { supabase } from './supabase';

export async function exportToCSV(tableName: string, filters?: any) {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) throw error;

  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => JSON.stringify(row[h] || '')).join(',')
    ),
  ].join('\n');

  return new Blob([csv], { type: 'text/csv' });
}

export async function exportToPDF(data: any, title: string) {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2563eb; color: white; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      ${JSON.stringify(data, null, 2)}
    </body>
    </html>
  `;

  return new Blob([content], { type: 'text/html' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromCSV(file: File, tableName: string) {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',');

  const data = lines.slice(1).map((line) => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
      return obj;
    }, {} as any);
  });

  const { error } = await supabase.from(tableName).insert(data);
  if (error) throw error;

  return data.length;
}
