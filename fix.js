const fs = require('fs');
let code = fs.readFileSync('src/app/(admin)/admin/master-data/kabupaten/KabupatenClientUI.tsx', 'utf8');

// Replace standard terms
code = code.replace(/Kecamatan/g, 'Kabupaten');
code = code.replace(/kecamatan/g, 'kabupaten');
code = code.replace(/namaKecamatan/g, 'namaKabupaten');

// Add checkbox safely
code = code.replace(
  'placeholder=\"Contoh: Rangkasbitung\" />\n              </div>',
  'placeholder=\"Contoh: Rangkasbitung\" />\n              </div>\n              <div className=\"flex items-center gap-2\">\n                <input type=\"checkbox\" id=\"isLuarBanten\" name=\"isLuarBanten\" defaultChecked={editData?.isLuarBanten || false} className=\"w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500\" />\n                <label htmlFor=\"isLuarBanten\" className=\"text-sm font-semibold text-slate-700\">Di Luar Wilayah Banten</label>\n              </div>'
);

// Add submit logic
code = code.replace(
  'namaKabupaten: formData.get(\'namaKabupaten\') as string,',
  'namaKabupaten: formData.get(\'namaKabupaten\') as string,\n      isLuarBanten: formData.get(\'isLuarBanten\') === \'on\','
);

// Add badge safely
code = code.replace(
  '{item.namaKabupaten}\n                    </div>',
  '{item.namaKabupaten}\n                      {item.isLuarBanten && <span className=\"px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 ml-2\">Luar Banten</span>}\n                    </div>'
);

fs.writeFileSync('src/app/(admin)/admin/master-data/kabupaten/KabupatenClientUI.tsx', code);
