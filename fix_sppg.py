import re

with open('src/app/(public)/sppg/[id]/page.tsx', 'r') as f:
    text = f.read()

# Remove Activity Log block
text = re.sub(
    r'        \{/\* Right Col: Activity Log \*/\}.*?</SppgActivityLogClient>\s*</div>\s*</div>\n\n',
    '',
    text,
    flags=re.DOTALL
)

# Remove the import
text = text.replace("import SppgActivityLogClient from './SppgActivityLogClient';", "")
text = text.replace("  const recentActivities: any[] = [];\n", "")

with open('src/app/(public)/sppg/[id]/page.tsx', 'w') as f:
    f.write(text)
