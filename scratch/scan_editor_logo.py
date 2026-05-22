import re

with open("src/components/Editor.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Find the logo block between <pre className="text-primary mb-10 font-mono leading-none opacity-90 scale-[0.65] origin-left sm:scale-90">\n{` and `}\n            </pre>
match = re.search(r'<pre[^>]*>\s*{\s*`\s*\n(.*?)\n\s*`\s*}', content, re.DOTALL)
if match:
    logo_lines = match.group(1).split('\n')
    print("   " + "".join([str(i % 10) for i in range(100)]))
    for idx, line in enumerate(logo_lines):
        ascii_line = line.replace('█', '#').replace('░', '.')
        print(f"{idx+1:2d} {ascii_line}")
else:
    print("Logo not found!")
