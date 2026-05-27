const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/UIEditor/SystemsTab.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// We want to replace lines from 624 to 697 (inclusive, 0-indexed would be 623 to 696)
// Let's find the exact indices by looking at the content.
// We will look for the line: `                                                    <input` around line 620.
// And we will look for the line: `                        {/* SUGGESTIONS */}` around line 699.

const startIndex = lines.findIndex((l, i) => i > 600 && l.includes('<input') && lines[i+1].includes('type="range"'));
const endIndex = lines.findIndex((l, i) => i > 650 && l.includes('{/* SUGGESTIONS */}'));

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find start or end index:', startIndex, endIndex);
    process.exit(1);
}

const replacement = `                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="4"
                                                        step="1"
                                                        value={localTextSpeed <= 1 ? 1 : (localTextSpeed === 2 ? 2 : (localTextSpeed === 3 ? 3 : 4))}
                                                        onChange={(e) => {
                                                            const step = parseInt(e.target.value);
                                                            setLocalTextSpeed(step);
                                                        }}
                                                        style={{
                                                            background: (() => {
                                                                const step = localTextSpeed <= 1 ? 1 : (localTextSpeed === 2 ? 2 : (localTextSpeed === 3 ? 3 : 4));
                                                                return \`linear-gradient(to right, \${currentSliderColor} \${((step - 1) / 3) * 100}%, \${currentSliderColor}33 \${((step - 1) / 3) * 100}%)\`;
                                                            })()
                                                        }}
                                                        className="flex-grow h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                    />
                                                    <span className="text-xs font-mono font-bold w-28 text-right">
                                                         {localTextSpeed <= 1 ? "Muito Lento" : (localTextSpeed === 2 ? "Lento" : (localTextSpeed === 3 ? "Normal" : "Rápido"))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

`;

const newLines = [
    ...lines.slice(0, startIndex),
    ...replacement.split('\n'),
    ...lines.slice(endIndex)
];

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Successfully fixed syntax error!');
