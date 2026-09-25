with open('src/db/schema.ts', 'r') as f:
    text = f.read()

import re
print("PENERIMA:", re.findall(r'export const sppgPenerimaManfaat = .*?\}\);', text, re.DOTALL))
