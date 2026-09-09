const fs = require('fs');
let code = fs.readFileSync('src/app/(admin)/admin/master-data/kabupaten/KabupatenClientUI.tsx', 'utf8');

// Add checkbox for isLuarBanten in form
const formInput = `              <div>
                <label className=\"block mb-2 text-sm font-semibold text-slate-700\">Nama Kabupaten *</label>
                <input required name=\"namaKabupaten\" type=\"text\" defaultValue={editData?.namaKabupaten || ''} className=\"w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50\" placeholder=\"Contoh: Kabupaten Bandung\" />
              </div>
              <div className=\"flex items-center gap-2\">
                <input type=\"checkbox\" id=\"isLuarBanten\" name=\"isLuarBanten\" defaultChecked={editData?.isLuarBanten || false} className=\"w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500\" />
                <label htmlFor=\"isLuarBanten\" className=\"text-sm font-semibold text-slate-700\">Di Luar Wilayah Banten</label>
              </div>`;

code = code.replace(/<div.*>\s*<label.*Nama Kabupaten \*<\/label>\s*<input required name="namaKabupaten".*\/>\s*<\/div>/s, formInput);

// Add logic to handleSubmit
const submitLogic = `
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaKabupaten: formData.get('namaKabupaten') as string,
      isLuarBanten: formData.get('isLuarBanten') === 'on'
    };`;
    
code = code.replace(/const handleSubmit = async.*?const data = {.*?namaKabupaten: formData\.get\('namaKabupaten'\) as string.*?};/s, submitLogic);

// Add badge in table
const badgeHtml = `{item.namaKabupaten}
                      {item.isLuarBanten && (
                        <span className=\"px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 ml-2\">Luar Banten</span>
                      )}`;

code = code.replace(/\{item\.namaKabupaten\}/g, badgeHtml);

fs.writeFileSync('src/app/(admin)/admin/master-data/kabupaten/KabupatenClientUI.tsx', code);
