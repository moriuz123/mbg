with open('src/app/(public)/sppg/SppgClient.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "{/* TAB CONTENT: REPORTS */}" in line:
        skip = True
    elif "{/* Modal Detail Laporan Aktifitas */}" in line:
        skip = True
    elif skip and ")}\n" == line and "        </div>" in lines[i-1]:
        skip = False
        continue
    
    if not skip:
        new_lines.append(line)

with open('src/app/(public)/sppg/SppgClient.tsx', 'w') as f:
    f.writelines(new_lines)
