const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/UIEditor/SystemsTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /className=\{\`w-full p-6 bg-card border-2 \$\{([a-zA-Z0-9_]+) \? 'border-primary shadow-md opacity-100' : 'border-muted-foreground\/50 opacity-50'\} rounded-2xl transition-all hover:shadow-lg/g;

let count = 0;
content = content.replace(regex, (match, condition) => {
    count++;
    return `className={\`w-full p-6 bg-card border \${${condition} ? 'border-muted-foreground/50 opacity-100' : 'border-muted-foreground/50 opacity-50 grayscale-[0.5]'} rounded-xl shadow-sm transition-all hover:shadow-md`;
});

fs.writeFileSync(filePath, content);
console.log(`Successfully fixed ${count} bento boxes!`);
