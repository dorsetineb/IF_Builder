with open("src/components/Editor.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'<pre[^>]*>\s*{\s*`\s*\n(.*?)\n\s*`\s*}', content, re.DOTALL)
if match:
    logo_lines = match.group(1).split('\n')
    with open("scratch/inspect_chars_output.txt", "w", encoding="utf-8") as out:
        for idx, line in enumerate(logo_lines):
            out.write(f"Row {idx+1}:\n")
            for char_idx, char in enumerate(line):
                ascii_char = char
                if char == '██':
                    # wait, char might be individual '█'
                    pass
                out.write(f"  {char_idx:2d}: '{char}'\n")
            out.write("\n")
