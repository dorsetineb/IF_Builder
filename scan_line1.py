import re
import json

file_path = r'public/escape_the_dungeon/game.js'
with open(file_path, 'r', encoding='utf-8') as f:
    line1 = f.readline()

match = re.search(r'window\.embeddedGameData\s*=\s*({.*});?\s*$', line1)
if match:
    json_str = match.group(1)
    data = json.loads(json_str)
    
    # Broader Portuguese character set
    portuguese_pattern = re.compile(r'[ãõçáéíóúàèìòùâêîôûÀÁÉÍÓÚÂÊÎÔÛÇ]')
    
    results = []
    def find_strings(obj, path=""):
        if isinstance(obj, str):
            if portuguese_pattern.search(obj):
                results.append(f"{path}: {obj}")
        elif isinstance(obj, dict):
            for k, v in obj.items():
                find_strings(v, f"{path}.{k}" if path else k)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                find_strings(v, f"{path}[{i}]")

    find_strings(data)
    
    with open('scan_results_line1.txt', 'w', encoding='utf-8') as out:
        for r in results:
            out.write(r + '\n')
else:
    print("Could not find embeddedGameData on line 1")
