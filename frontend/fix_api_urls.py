import os
import re

count = 0
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            def replacer(match):
                path = match.group(1)
                return f"`http://${{window.location.hostname}}:5000{path}`"

            new_content = re.sub(r"['`]http://localhost:5000([^'`]*)['`]", replacer, content)
            
            if content != new_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {filepath}")
print(f"Total files updated: {count}")
