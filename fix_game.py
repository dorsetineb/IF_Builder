import sys
import os

file_path = r'c:\Users\rodrigo.bsilva\Documents\if-builder\IF_Builder\public\escape_the_dungeon\game.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replacement 1: Button labels
content = content.replace(
    'inventoryButton.innerHTML = `<span>INVENTÁRIO</span>`',
    'inventoryButton.innerHTML = `<span>INVENTORY</span>`'
)
content = content.replace(
    'suggestionsButton.innerHTML = `<span>DICAS</span>`',
    'suggestionsButton.innerHTML = `<span>SUGGESTIONS</span>`'
)
content = content.replace(
    'diaryButton.innerHTML = `<span>DIÁRIO</span>`',
    'diaryButton.innerHTML = `<span>DIARY</span>`'
)
content = content.replace(
    'systemButton.innerHTML = `<span>SISTEMA</span>`',
    'systemButton.innerHTML = `<span>SYSTEM</span>`'
)

# Replacement 2: handleInput logs and logic
old_handle = 'const handleInput = () => { if (isPrinting) return; const input = verbInput.value.trim(); if (input) { processCommand(input); verbInput.value = \'\'; } };'
new_handle = '''const handleInput = () => {
        console.log('Action Button Clicked / Enter Pressed. isPrinting:', isPrinting);
        if (isPrinting) return;
        const input = verbInput.value.trim();
        if (input) {
            console.log('Processing input:', input);
            processCommand(input);
            verbInput.value = '';
        }
    };'''
if old_handle in content:
    content = content.replace(old_handle, new_handle)
    print("handleInput replaced")
else:
    print("handleInput NOT found")

# Replacement 3: lookVerbs and Portuguese message
old_look = """        const lookVerbs = ['olhar', 'examinar', 'ver', 'ler'];
        if (lookVerbs.some(v => hasWord(v, inputLower))) {
            const foundObject = scene.objectIds.map(id => gameData.globalObjects[id]).find(obj => hasWord(obj.name.toLowerCase(), inputLower));
            if (foundObject) {
                printOutput(foundObject.examineDescription || "Você não vê nada de especial.");
                return;
            } else {
                printOutput("Examinar o quê exatamente?");
                return;
            }
        }

        printOutput(gameData.mensagem_falha_padrao || "Não aconteceu nada.");"""

new_look = """        const lookVerbs = ['olhar', 'examinar', 'ver', 'ler', 'look', 'examine', 'read'];
        if (lookVerbs.some(v => hasWord(v, inputLower))) {
            const foundObject = scene.objectIds.map(id => gameData.globalObjects[id]).find(obj => hasWord(obj.name.toLowerCase(), inputLower));
            if (foundObject) {
                printOutput(foundObject.examineDescription || "You see nothing special.");
                return;
            } else {
                printOutput("Examine what exactly?");
                return;
            }
        }

        printOutput(gameData.mensagem_falha_padrao || "That does not seem to have any effect.");"""

if old_look in content:
    content = content.replace(old_look, new_look)
    print("lookVerbs replaced")
else:
    print("lookVerbs NOT found")

# Replacement 4: isPrinting in printOutput
old_type_finish = """                if (charIndex < formattedHTML.length) {
                    p.scrollTop = p.scrollHeight;
                    setTimeout(type, typeSpeedBase);
                }
            };
            type();
            type();
        } else {
            // Also respecting session ID for safety though printOutput is usually atomic-ish or one-off
            if (textAnimType === 'typewriter') {
                // Already handled by if block above
            } else {
                p.innerHTML = formattedHTML; p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); sceneDescription.scrollTop = sceneDescription.scrollHeight;
            }
        }"""

new_type_finish = """                if (charIndex < formattedHTML.length) {
                    p.scrollTop = p.scrollHeight;
                    setTimeout(type, typeSpeedBase);
                } else {
                    isPrinting = false;
                }
            };
            type();
        } else {
            // Also respecting session ID for safety though printOutput is usually atomic-ish or one-off
            if (textAnimType === 'typewriter') {
                // Already handled by if block above
            } else {
                p.innerHTML = formattedHTML; p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); sceneDescription.scrollTop = sceneDescription.scrollHeight;
                isPrinting = false; // Reset for fade animation too
            }
        }"""

if old_type_finish in content:
    content = content.replace(old_type_finish, new_type_finish)
    print("printOutput logic replaced")
else:
    print("printOutput logic NOT found")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Game.js modified successfully!")
