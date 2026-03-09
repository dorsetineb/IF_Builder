import sys
import os
import re

file_path = r'c:\Users\rodrigo.bsilva\Documents\if-builder\IF_Builder\public\escape_the_dungeon\game.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
modified_count = 0

for line in lines:
    # 1. Fix Button Labels
    if 'inventoryButton.innerHTML = `<span>INVENTÁRIO</span>`;' in line:
        line = line.replace('INVENTÁRIO', 'INVENTORY')
        modified_count += 1
    if 'suggestionsButton.innerHTML = `<span>DICAS</span>`;' in line:
        line = line.replace('DICAS', 'SUGGESTIONS')
        modified_count += 1
    if 'diaryButton.innerHTML = `<span>DIÁRIO</span>`;' in line:
        line = line.replace('DIÁRIO', 'DIARY')
        modified_count += 1
    if 'systemButton.innerHTML = `<span>SISTEMA</span>`;' in line:
        line = line.replace('SISTEMA', 'SYSTEM')
        modified_count += 1
    
    # 2. Add English verbs to lookVerbs
    if "const lookVerbs = ['olhar', 'examinar', 'ver', 'ler'];" in line:
        line = line.replace("['olhar', 'examinar', 'ver', 'ler']", "['olhar', 'examinar', 'ver', 'ler', 'look', 'examine', 'read']")
        modified_count += 1
    
    # 3. Translate default failure message
    if 'printOutput(gameData.mensagem_falha_padrao || "Não aconteceu nada.");' in line:
        line = line.replace('"Não aconteceu nada."', '"That does not seem to have any effect."')
        modified_count += 1
    
    # 4. Fix isPrinting in fade case of printOutput
    if "p.innerHTML = formattedHTML; p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); sceneDescription.scrollTop = sceneDescription.scrollHeight;" in line:
        # Check if it's inside printOutput (not renderScene)
        # In printOutput, it's inside an else block
        if 'sceneDescription.scrollTop = sceneDescription.scrollHeight;' in line and 'isPrinting = false;' not in line:
             # Add isPrinting = false
             line = line.replace('sceneDescription.scrollTop = sceneDescription.scrollHeight;', 'sceneDescription.scrollTop = sceneDescription.scrollHeight; isPrinting = false;')
             modified_count += 1

    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Game.js modified. Total replacements made: {modified_count}")
