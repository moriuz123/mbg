const fs = require('fs');
let code = fs.readFileSync('src/app/(admin)/admin/master-data/pemasok/PemasokClientUI.tsx', 'utf8');

// 1. Remove Bank fields from handleSubmit
code = code.replace(/\s*bankNama: formData\.get\('bankNama'\) as string,/g, '');
code = code.replace(/\s*bankRekening: formData\.get\('bankRekening'\) as string,/g, '');
code = code.replace(/\s*bankAtasNama: formData\.get\('bankAtasNama'\) as string,/g, '');

// 2. Remove Bank section from form
const formStart = code.indexOf('{/* Seksi Rekening Bank */}');
if (formStart !== -1) {
  const formEnd = code.indexOf('<button', formStart);
  code = code.slice(0, formStart) + code.slice(formEnd);
}

// 3. Remove Bank header from table
code = code.replace('<th className="p-5">Bank & Rekening</th>', '');
code = code.replace('colSpan={6}', 'colSpan={5}');

// 4. Remove Bank cell from table body
// We need to carefully remove the td that contains item.bankNama
const lines = code.split('\n');
let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<td className="p-5 border-t border-slate-100">') && lines[i+1] && lines[i+1].includes('{item.bankNama ? (')) {
    skip = true;
  }
  
  if (!skip) {
    newLines.push(lines[i]);
  }
  
  if (skip && lines[i].includes('</td>') && lines[i-1] && lines[i-1].includes(')}')) {
    skip = false;
  }
}

fs.writeFileSync('src/app/(admin)/admin/master-data/pemasok/PemasokClientUI.tsx', newLines.join('\n'));
