with open('src/db/schema.ts', 'r') as f:
    text = f.read()

import re
print("POSYANDU_REL:", re.findall(r'export const posyanduRelations = .*?\}\);', text, re.DOTALL))
