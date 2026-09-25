with open('src/db/schema.ts', 'r') as f:
    text = f.read()

import re
print("RELATIONS:", re.findall(r'export const sppgRelations = .*?\}\);', text, re.DOTALL))
print("JADWAL:", re.findall(r'export const sppgJadwalDistribusi = .*?\}\);', text, re.DOTALL))
print("SEKOLAH_REL:", re.findall(r'export const sekolahRelations = .*?\}\);', text, re.DOTALL))
