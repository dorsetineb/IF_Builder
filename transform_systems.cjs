const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/UIEditor/SystemsTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. First, replace the interaction type section
content = content.replace(
    /<div className={`w-full p-6 bg-card border-2 \$\{localGameInteractionType \? 'border-primary shadow-md opacity-100' : 'border-muted-foreground\/50 opacity-50'\} rounded-2xl transition-all hover:shadow-lg group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '0ms' }}>/g,
    `<div className={\`w-full p-6 bg-card border \${localGameInteractionType ? 'border-muted-foreground/50 opacity-100' : 'border-muted-foreground/50 opacity-50 grayscale-[0.5]'} rounded-xl shadow-sm transition-all hover:shadow-md group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both\`} style={{ animationDelay: '0ms' }}>`
);

content = content.replace(
    /<div className="grid grid-cols-1 gap-4">/g,
    `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">`
);

content = content.replace(
    /<Type className="w-6 h-6" \/>/g,
    `<Check className="w-6 h-6" />`
);

// Add Check to imports if it's not there
if (!content.includes('Check,')) {
    content = content.replace(
        /import \{ \n    Shuffle, Type, List,/,
        `import { \n    Shuffle, Type, List, Check,`
    );
}

// 2. Replace the toggles and wrappers
// We will use a regex to match the exact pattern of the toggles and wrapper div.
const bentoRegex = /<div className=\{`w-full p-6 bg-card border-2 \$\{(local[A-Za-z0-9]+)\} \? 'border-primary shadow-md opacity-100' : 'border-muted-foreground\/50 opacity-50'\} rounded-2xl transition-all hover:shadow-lg group flex flex-col( gap-\d+)? animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`\} style=\{\{ animationDelay: '(\d+ms)' \}\}>([\s\S]*?)<div className="flex items-center justify-between gap-4 w-full">\s*<div className="flex items-center gap-3">\s*<([A-Za-z0-9]+) className="[^"]+" \/>\s*<div>\s*(<h4[^>]+>.*?<\/h4>)\s*(<p[^>]+>.*?<\/p>)\s*<\/div>\s*<\/div>\s*<label className="relative inline-flex items-center cursor-pointer shrink-0">\s*<input type="checkbox" checked=\{\1\} onChange=\{\(e\) => ([A-Za-z0-9]+)\(e\.target\.checked\)\} className="sr-only peer" \/>[\s\S]*?<\/label>\s*<\/div>/g;

content = content.replace(bentoRegex, (match, condition, gap, delay, prefixContent, Icon, h4, p, setter) => {
    return `<div className={\`w-full p-6 bg-card border \${${condition} ? 'border-muted-foreground/50 opacity-100' : 'border-muted-foreground/50 opacity-50 grayscale-[0.5]'} rounded-xl shadow-sm transition-all hover:shadow-md group flex flex-col${gap || ''} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both\`} style={{ animationDelay: '${delay}' }}>${prefixContent}<div className="flex items-center gap-4 w-full">
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={${condition}} onChange={(e) => ${setter}(e.target.checked)} className="sr-only peer" />
                                        <div className="w-[64px] h-[36px] bg-muted border-2 border-muted-foreground/50 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={\`absolute top-1 left-1 w-7 h-7 rounded-full shadow-sm transition-all flex items-center justify-center \${${condition} ? 'bg-primary-foreground text-primary' : 'bg-muted-foreground/50 text-background'}\`}
                                                style={{ transform: ${condition} ? 'translateX(28px)' : 'translateX(0)' }}
                                            >
                                                <${Icon} className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </label>
                                    <div>
                                        ${h4}
                                        ${p}
                                    </div>
                                </div>`;
});

fs.writeFileSync(filePath, content);
console.log('Successfully updated SystemsTab.tsx');
