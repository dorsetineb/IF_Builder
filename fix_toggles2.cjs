const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/UIEditor/SystemsTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /className=\{\`absolute top-1 left-1 w-7 h-7 rounded-full shadow-sm transition-all flex items-center justify-center \$\{([a-zA-Z0-9_]+) \? 'bg-primary-foreground text-primary' : 'bg-muted-foreground\/50 text-muted-foreground'\}\`\}\s+style=\{\{\s*transform:\s*\1 \? 'translateX\(28px\)' : 'translateX\(0\)'\s*\}\}/g;

let count = 0;
content = content.replace(regex, (match, condition) => {
    count++;
    return `className={\`absolute top-[2px] transition-all duration-300 flex items-center justify-center \${\${condition} ? 'text-primary-foreground left-[30px]' : 'text-muted-foreground left-1'}\`}\n                                                style={{ width: '28px', height: '28px' }}`;
});

// Also fix the onClick for 'choice'
content = content.replace(/setLocalGameInteractionType\('choice'\);/g, "setLocalGameInteractionType('choice');\n                                        setLocalEnableSuggestions(false);");

fs.writeFileSync(filePath, content);
console.log(`Successfully replaced ${count} toggles!`);
