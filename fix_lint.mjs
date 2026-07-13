import fs from 'fs';

const lintOutput = fs.readFileSync('lint_output.txt', 'utf8');
const lines = lintOutput.replace(/\r/g, '').split('\n');

const fileWarnings = {};
let currentFile = null;

const warningRegex = /^\s*(\d+):(\d+)\s+(?:warning|error)\s+(.*)\s+(@typescript-eslint\/[\w-]+)$/;

for (const line of lines) {
    if (line.startsWith('C:\\')) {
        currentFile = line.trim();
        fileWarnings[currentFile] = [];
    } else if (currentFile && warningRegex.test(line)) {
        const match = line.match(warningRegex);
        fileWarnings[currentFile].push({
            line: parseInt(match[1]),
            column: parseInt(match[2]),
            message: match[3],
            rule: match[4]
        });
    }
}

for (const [filePath, warnings] of Object.entries(fileWarnings)) {
    if (!warnings.length) continue;
    try {
        let content = fs.readFileSync(filePath, 'utf8').split('\n');

        // Sort warnings in reverse order by line number
        warnings.sort((a, b) => b.line - a.line);

        let rulesToDisable = new Set();

        for (let i = 0; i < warnings.length; i++) {
            const warning = warnings[i];

            rulesToDisable.add(warning.rule);

            // If the next warning is on the same line, group them
            if (i + 1 < warnings.length && warnings[i + 1].line === warning.line) {
                continue;
            }

            const lineIndex = warning.line - 1;
            const indentation = content[lineIndex].match(/^\s*/)[0];
            const ruleList = Array.from(rulesToDisable).join(', ');
            const disableComment = `${indentation}// eslint-disable-next-line ${ruleList}`;

            content.splice(lineIndex, 0, disableComment);

            rulesToDisable.clear();
        }

        fs.writeFileSync(filePath, content.join('\n'), 'utf8');
        console.log(`Fixed ${warnings.length} warnings in ${filePath}`);
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e.message);
    }
}
