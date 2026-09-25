with open('src/db/schema.ts', 'r') as f:
    text = f.read()

import re
print("SEKOLAH:", re.findall(r'export const sekolah = .*?\}\);', text, re.DOTALL))
print("POSYANDU:", re.findall(r'export const posyandu = .*?\}\);', text, re.DOTALL))
