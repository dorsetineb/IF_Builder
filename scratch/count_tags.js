
import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\rodrigo.bsilva\\Documents\\if-builder\\IF_Builder\\src\\components\\GlobalObjectsEditor.tsx', 'utf8');

let openDivs = 0;
let closeDivs = 0;

const divRegex = /<div|<\/div>/g;
let match;
let lineNum = 1;
let lastIndex = 0;
while ((match = divRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    lineNum += (textBefore.match(/\n/g) || []).length;
    lastIndex = match.index;
    if (match[0] === '<div') {
        openDivs++;
        console.log(`Open at line ${lineNum}`);
    } else {
        closeDivs++;
        console.log(`Close at line ${lineNum}`);
    }
}

console.log(`Open divs: ${openDivs}`);
console.log(`Close divs: ${closeDivs}`);

// Let's also check for other common tags
const tags = ['button', 'input', 'textarea', 'p', 'h3', 'h4', 'span', 'label', 'ConfirmationModal', 'Image', 'Box', 'Link', 'Activity', 'Heart', 'Zap', 'Shield', 'Coins', 'Clock', 'Skull', 'Star', 'User', 'Trophy', 'AlertTriangle', 'Book', 'Crown', 'Flame', 'Droplet', 'Sun', 'Moon', 'Plus', 'Trash2', 'Upload', 'Search', 'Link', 'Activity'];

tags.forEach(tag => {
    const open = (content.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    const close = (content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    const selfClosing = (content.match(new RegExp(`<${tag}[^>]*/>`, 'g')) || []).length;
    if (open !== close + selfClosing) {
        console.log(`Tag mismatch: ${tag} (Open: ${open}, Close: ${close}, Self-closing: ${selfClosing})`);
    }
});
