const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/UIEditor/SystemsTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetString = "className={`absolute top-[2px] transition-all duration-300 flex items-center justify-center ${${condition} ? 'text-primary-foreground left-[30px]' : 'text-muted-foreground left-1'}`}";

let count = 0;

let index = content.indexOf(targetString);
while (index !== -1) {
    // Find the closest "checked={" before this index
    const beforeStr = content.substring(0, index);
    const match = beforeStr.match(/checked=\{([a-zA-Z0-9_]+)\}(?![\s\S]*checked=\{)/);
    
    if (match) {
        const variable = match[1];
        const replacement = `className={\`absolute top-[2px] transition-all duration-300 flex items-center justify-center \${${variable} ? 'text-primary-foreground left-[30px]' : 'text-muted-foreground left-1'}\`}`;
        
        content = content.substring(0, index) + replacement + content.substring(index + targetString.length);
        count++;
    } else {
        console.log("Could not find variable before index " + index);
    }
    
    index = content.indexOf(targetString, index + 10);
}

fs.writeFileSync(filePath, content);
console.log(`Successfully fixed ${count} syntax errors!`);
