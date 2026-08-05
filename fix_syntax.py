import glob
import re

ui_files = glob.glob('src/app/(admin)/admin/**/*ClientUI.tsx', recursive=True)

for filepath in ui_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Step 1: Does the file have the weird </div> before </form>?
    if '</div>\n            </form>' in content or '</div>\n          </form>' in content:
        print(f"Broken file: {filepath}")
        
        # Let's fix it manually with regex
        # 1. Remove the misplaced </div>
        content = re.sub(r'</div>\n(\s*)</form>', r'\1</form>', content)
        
        # 2. Add </div> right after the first </button> that comes after flex justify-end
        # The structure is:
        # <div className="flex justify-end mb-4">
        #   <button ...> ... </button>
        # We need to insert </div> after this </button>
        
        def insert_div(m):
            return m.group(0) + '\n</div>'
            
        # Match from <div className="flex justify-end mb-4"> to the first </button>
        pattern = r'(<div className="flex justify-end mb-4">\s*<button.*?onClick=\{\(\) => setIsOpen\(true\)\}.*?</button>)'
        content = re.sub(pattern, insert_div, content, count=1, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(content)
            
