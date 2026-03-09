import re
import os

file_path = r'c:\Users\rodrigo.bsilva\Documents\if-builder\IF_Builder\public\escape_the_dungeon\game.js'
pt_chars = "áéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ"
regex = re.compile(f"[{pt_chars}]")

with open(file_path, 'r', encoding='utf-8') as f, open('scan_results_v2.txt', 'w', encoding='utf-8') as out:
    for i, line in enumerate(f):
        if i == 0: continue # Skip large JSON line
        if regex.search(line):
            out.write(f"{i+1}: {line.strip()}\n")
        elif 'innerHTML' in line or 'textContent' in line or 'placeholder' in line:
            # Check if it contains hardcoded Portuguese (simple heuristic)
            if '"' in line or "'" in line:
                out.write(f"{i+1}: {line.strip()}\n")
