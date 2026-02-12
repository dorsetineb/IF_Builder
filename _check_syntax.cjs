const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('src/components/game-engine.ts', 'utf-8');
const lines = src.split('\n');

let inGameJS = false;
let jsLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('export const gameJS = `')) {
        inGameJS = true;
        jsLines.push(line.substring(line.indexOf('`') + 1));
        continue;
    }
    if (inGameJS) {
        const trimmed = line.trimEnd();
        if (trimmed === '`;') {
            break;
        }
        jsLines.push(line);
    }
}

const js = jsLines.join('\n');
console.log('Extracted', jsLines.length, 'lines');

// Write it for manual inspection
fs.writeFileSync('_extracted_gamejs.js', js);

try {
    new vm.Script(js, { filename: 'gameJS.js' });
    console.log('SYNTAX OK!');
} catch (e) {
    console.log('SYNTAX ERROR:', e.message);
    const m = e.stack.match(/gameJS\.js:(\d+):(\d+)/);
    if (m) {
        const errLine = parseInt(m[1]);
        const errCol = parseInt(m[2]);
        console.log('Error at line:', errLine, 'col:', errCol);
        console.log('\nContext (20 lines around error):');
        for (let j = Math.max(0, errLine - 11); j <= Math.min(jsLines.length - 1, errLine + 9); j++) {
            const mark = (j + 1) === errLine ? '>>> ' : '    ';
            console.log(mark + (j + 1) + ': ' + jsLines[j]);
        }
    }
}
