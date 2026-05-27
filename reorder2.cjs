const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/UIEditor/SystemsTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const sections = [
    '{/* --- GAME STYLE --- */}',
    '{/* MENU PRINCIPAL E SAVES */}',
    '{/* IMAGES */}',
    '{/* TEXT CONTROL */}',
    '{/* SUGGESTIONS */}',
    '{/* LIVES */}',
    '{/* INVENTORY */}',
    '{/* DIARY */}',
    '{/* TRACKERS */}',
    '{/* RETROSPECTIVE */}'
];

const indices = sections.map(sec => ({
    name: sec,
    index: content.indexOf(sec)
})).filter(s => s.index !== -1).sort((a, b) => a.index - b.index);

if (indices.length < 10) {
    console.error("Could not find all sections!");
    console.log(indices.map(i => i.name));
    process.exit(1);
}

// Extract the blocks
const blocks = {};
for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = (i === indices.length - 1) 
        ? content.indexOf('            </div>\n\n            {/* Right Column: Preview */}')
        : indices[i + 1].index;
    
    blocks[indices[i].name] = content.substring(start, end);
}

// Define the new order requested by user
const newOrder = [
    '{/* --- GAME STYLE --- */}',
    '{/* TEXT CONTROL */}',
    '{/* IMAGES */}',
    '{/* MENU PRINCIPAL E SAVES */}',
    '{/* LIVES */}',
    '{/* DIARY */}',
    '{/* TRACKERS */}',
    '{/* INVENTORY */}',
    '{/* SUGGESTIONS */}',
    '{/* RETROSPECTIVE */}'
];

let newContent = content.substring(0, indices[0].index);
for (const sec of newOrder) {
    newContent += blocks[sec];
}
const endPos = content.indexOf('            </div>\n\n            {/* Right Column: Preview */}');
newContent += content.substring(endPos);

fs.writeFileSync(filePath, newContent);
console.log("Successfully reordered!");
