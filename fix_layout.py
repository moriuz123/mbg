import os
import glob
import re

# Fix page.tsx files
page_files = glob.glob('src/app/(admin)/admin/**/page.tsx', recursive=True)
for filepath in page_files:
    if 'admin/page.tsx' in filepath:
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to change:
    # <div className="flex justify-between items-center mb-6">
    #   <div>
    #     ...
    #   </div>
    #   <ClientUI ... />
    # </div>
    # To:
    # <div className="mb-6">
    #   <div>
    #     ...
    #   </div>
    # </div>
    # <ClientUI ... />
    
    # Since regex can be tricky with nested divs, let's use a simpler approach.
    # The ClientUI component is always right before the closing </div> of the flex container.
    # Let's find the ClientUI tag.
    
    match = re.search(r'(\s*)(<[A-Za-z0-9_]+ClientUI[^>]*/>)\s*</div>', content)
    if match:
        indent = match.group(1)
        ui_tag = match.group(2)
        
        # Replace the flex class
        content = re.sub(r'className="flex justify-between items-center mb-\d+"', 'className="mb-6"', content)
        
        # Move the UI tag out of the div
        # Replace the match with just the closing div, then the UI tag outside
        new_content = content.replace(match.group(0), f"{indent}</div>{indent}{ui_tag}")
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")


# Fix ClientUI.tsx files
ui_files = glob.glob('src/app/(admin)/admin/**/*ClientUI.tsx', recursive=True)
for filepath in ui_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find the button tag that opens the modal
    # It usually looks like:
    # <button 
    #   onClick={() => setIsOpen(true)}
    #   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
    # >
    #   <Plus size={20} /> Tambah ...
    # </button>
    
    # Let's find the first <button ... > ... Tambah ... </button>
    # Since there are multiple buttons (like delete), we specifically look for the one with 'onClick={() => setIsOpen(true)}'
    
    # We need to wrap it in a div
    pattern = r'(<button\s+onClick=\{\(\) => setIsOpen\(true\)\}[^>]*>.*?Tambah.*?</button>)'
    
    def replacer(m):
        button_code = m.group(1)
        # Check if already wrapped
        if 'flex justify-end' in content:
            return button_code # skip if already wrapped
        
        # Add indentation for the div
        # Find the indentation of the button
        lines = button_code.split('\n')
        indent = len(lines[0]) - len(lines[0].lstrip())
        spaces = ' ' * indent
        
        return f'<div className="flex justify-end mb-4">\n{spaces}  ' + button_code.replace('\n', '\n  ') + f'\n{spaces}</div>'

    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
    
