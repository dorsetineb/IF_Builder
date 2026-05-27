const fs = require('fs');
const filePath = 'src/components/UIEditor.tsx';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// The config block starts around line 1354 and ends around 1438.
// We should find the exact indices to be safe.
const startIndex = lines.findIndex(l => l.includes("activeTab === 'config' && ("));
if (startIndex !== -1) {
    // Find the end of this block
    // We know it ends before "</div>" of the main container which is around line 1440
    let endIndex = -1;
    for (let i = startIndex; i < lines.length; i++) {
        if (lines[i].includes("            </div>") && lines[i+1].includes("        </div>")) {
            endIndex = i - 1; // Delete up to the line before this
            break;
        }
    }
    
    if (endIndex !== -1) {
        // Also remove the `{\n` before it
        let actualStart = startIndex;
        if (lines[startIndex - 1].trim() === '{') {
            actualStart = startIndex - 1;
        }
        
        lines.splice(actualStart, endIndex - actualStart + 1);
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log("Removed config block successfully.");
    } else {
        console.log("Could not find end index");
    }
} else {
    console.log("Could not find start index");
}
