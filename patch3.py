import re
with open('src/app/(public)/sppg/SppgClient.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const \[selectedReport, setSelectedReport\] = useState<LaporanData \| null>\(null\);\n', '', content)
content = re.sub(r'\s*laporanData,\n', '\n', content)
content = re.sub(r'\s*laporanData: LaporanData\[\],\n', '\n', content)
content = re.sub(r'\s*laporanData: LaporanData\[\];\n', '\n', content)

with open('src/app/(public)/sppg/SppgClient.tsx', 'w') as f:
    f.write(content)
