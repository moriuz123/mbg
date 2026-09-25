import re

with open('src/app/(public)/sppg/SppgClient.tsx', 'r') as f:
    text = f.read()

# 1. Remove Button
# From <button onClick={() => setTab('reports')} to </button>
pattern_btn = r"<button[^>]*onClick=\{\(\) => setTab\('reports'\)\}[^>]*>.*?<\/button>"
text = re.sub(pattern_btn, '', text, flags=re.DOTALL)

# 2. Remove Tab Content: Reports
pattern_tab = r"\{/\* TAB CONTENT: REPORTS \*/\}.*?\{currentTab === 'reports' && \([\s\S]*?\}\)"
# Since the regex might be tricky, let's find indices manually for safety if needed.
# Actually, re.sub is fine if I match exactly to the `)}`
# Wait, `)}` is at the end of the block.
# Let's match from `{/* TAB CONTENT: REPORTS */}` up to `        </div>\n      )}\n`
pattern_tab_safe = r"\{/\* TAB CONTENT: REPORTS \*/\}.*?        </div>\n      \)}\n"
text = re.sub(pattern_tab_safe, '', text, flags=re.DOTALL)

# 3. Remove Modal Detail Laporan Aktifitas
pattern_modal = r"\{/\* Modal Detail Laporan Aktifitas \*/\}.*?        </div>\n      \)}\n"
text = re.sub(pattern_modal, '', text, flags=re.DOTALL)

# 4. Remove LaporanData types and state
text = re.sub(r'const \[selectedReport, setSelectedReport\] = useState<LaporanData \| null>\(null\);\n', '', text)
text = re.sub(r'\s*laporanData,\n', '\n', text)
text = re.sub(r'\s*laporanData: LaporanData\[\],\n', '\n', text)
text = re.sub(r'\s*laporanData: LaporanData\[\];\n', '\n', text)

with open('src/app/(public)/sppg/SppgClient.tsx', 'w') as f:
    f.write(text)
