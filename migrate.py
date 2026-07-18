import os
import re

routes = {
    "src/pages/Public.jsx": "src/app/(public)/page.tsx",
    "src/pages/Login.jsx": "src/app/(public)/login/page.tsx",
    "src/pages/PublicPenggilingan.jsx": "src/app/(public)/data-penggilingan/page.tsx",
    "src/pages/PublicSPPG.jsx": "src/app/(public)/data-sppg/page.tsx",
    "src/pages/Home.jsx": "src/app/(admin)/admin/page.tsx",
    "src/pages/Penggilingan.jsx": "src/app/(admin)/penggilingan/page.tsx",
    "src/pages/SPPG.jsx": "src/app/(admin)/sppg/page.tsx",
    "src/pages/MasterData.jsx": "src/app/(admin)/master-data/[tabId]/page.tsx",
}

for src, dest in routes.items():
    if not os.path.exists(src):
        print(f"Skipping {src}, not found")
        continue
    
    with open(src, "r") as f:
        content = f.read()
    
    # Prepend 'use client' if react hooks are used
    if "useState" in content or "useEffect" in content or "useNavigate" in content or "useParams" in content:
        content = "'use client';\n\n" + content

    # Replace react-router-dom Link with next/link
    content = content.replace("import { Link } from 'react-router-dom';", "import Link from 'next/link';")
    content = re.sub(r"import\s+\{([^}]*)\bLink\b([^}]*)\}\s+from\s+'react-router-dom';", 
                     r"import {\1\2} from 'react-router-dom';\nimport Link from 'next/link';", content)
    
    # Replace useNavigate with useRouter
    content = content.replace("useNavigate", "useRouter")
    content = content.replace("react-router-dom", "next/navigation") # For useRouter, useParams
    
    # Remove empty imports from react-router-dom if any (crude but works for this)
    content = content.replace("import {  } from 'next/navigation';", "")
    content = content.replace("import {} from 'next/navigation';", "")

    # Write to new dest
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w") as f:
        f.write(content)
    
    # Delete old file
    os.remove(src)
    print(f"Migrated {src} -> {dest}")

print("Done migration script.")
