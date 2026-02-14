import os
import re

def bulk_replace(root_dir, search_terms):
    allowed_extensions = {'.ts', '.tsx', '.js', '.jsx', '.json', '.md'}
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in root or '.next' in root or '.git' in root:
            continue
        for file in files:
            if any(file.endswith(ext) for ext in allowed_extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    for old, new in search_terms:
                        content = re.sub(old, new, content, flags=re.IGNORECASE)
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

search_patterns = [
    (r'Kadraj\s*Panel', 'Weey.NET'),
    (r'Fotoplan', 'Weey.NET')
]

bulk_replace(r'd:\FOTO PLAN\foto-plan', search_patterns)
