with open('src/app/(public)/sppg/SppgClient.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "<button" in line and "onClick={() => setTab('reports')}" in lines[i+1] if i+1 < len(lines) else False:
        skip = True
    elif skip and "</button>" in line:
        skip = False
        continue
    
    if not skip:
        new_lines.append(line)

with open('src/app/(public)/sppg/SppgClient.tsx', 'w') as f:
    f.writelines(new_lines)
