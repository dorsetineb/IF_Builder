const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/locales/pt/translation.json');
let content = fs.readFileSync(filePath, 'utf8');

// Replace "jogador" -> "usuário"
// Since both are masculine, simple replacement is fine.
content = content.replace(/\bjogador\b/g, 'usuário');
content = content.replace(/\bJogador\b/g, 'Usuário');
content = content.replace(/\bjogadores\b/g, 'usuários');
content = content.replace(/\bJogadores\b/g, 'Usuários');

// For "jogo" (masculine) to "ficção" (feminine), we need to replace the preceding articles/pronouns.
const replacements = [
    [/o\s+jogo/g, 'a ficção'],
    [/O\s+jogo/g, 'A ficção'],
    [/do\s+jogo/g, 'da ficção'],
    [/Do\s+jogo/g, 'Da ficção'],
    [/no\s+jogo/g, 'na ficção'],
    [/No\s+jogo/g, 'Na ficção'],
    [/ao\s+jogo/g, 'à ficção'],
    [/Ao\s+jogo/g, 'À ficção'],
    [/um\s+jogo/g, 'uma ficção'],
    [/Um\s+jogo/g, 'Uma ficção'],
    [/este\s+jogo/g, 'esta ficção'],
    [/Este\s+jogo/g, 'Esta ficção'],
    [/esse\s+jogo/g, 'essa ficção'],
    [/Esse\s+jogo/g, 'Essa ficção'],
    [/desse\s+jogo/g, 'dessa ficção'],
    [/Desse\s+jogo/g, 'Dessa ficção'],
    [/seu\s+jogo/g, 'sua ficção'],
    [/Seu\s+jogo/g, 'Sua ficção'],
    [/todo\s+o\s+jogo/g, 'toda a ficção'],
    [/Todo\s+o\s+jogo/g, 'Toda a ficção'],
    
    // Plurals
    [/os\s+jogos/g, 'as ficções'],
    [/Os\s+jogos/g, 'As ficções'],
    [/dos\s+jogos/g, 'das ficções'],
    [/Dos\s+jogos/g, 'Das ficções'],
    [/nos\s+jogos/g, 'nas ficções'],
    [/Nos\s+jogos/g, 'Nas ficções'],
    [/aos\s+jogos/g, 'às ficções'],
    [/Aos\s+jogos/g, 'Às ficções'],
    [/uns\s+jogos/g, 'umas ficções'],
    [/Uns\s+jogos/g, 'Umas ficções'],
    [/estes\s+jogos/g, 'estas ficções'],
    [/Estes\s+jogos/g, 'Estas ficções'],
    [/esses\s+jogos/g, 'essas ficções'],
    [/Esses\s+jogos/g, 'Essas ficções'],
    [/desses\s+jogos/g, 'dessas ficções'],
    [/Desses\s+jogos/g, 'Dessas ficções'],
    [/seus\s+jogos/g, 'suas ficções'],
    [/Seus\s+jogos/g, 'Suas ficções'],
];

for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
}

// Any remaining "jogo" or "jogos" that didn't have a matched article:
content = content.replace(/\bjogo\b/g, 'ficção');
content = content.replace(/\bJogo\b/g, 'Ficção');
content = content.replace(/\bjogos\b/g, 'ficções');
content = content.replace(/\bJogos\b/g, 'Ficções');

fs.writeFileSync(filePath, content);
console.log("Translation updated successfully!");
