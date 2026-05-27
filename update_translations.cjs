const fs = require('fs');
const path = require('path');

function updateTranslation(lang, startMenuTitle, systemMenuDesc, titleText, showTitle, bgImage, suggestedRes) {
    const filePath = path.join(__dirname, `src/locales/${lang}/translation.json`);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.UIEditor) data.UIEditor = {};
    if (!data.UIEditor.sistemas) data.UIEditor.sistemas = {};
    if (!data.UIEditor.startScreen) data.UIEditor.startScreen = {};

    data.UIEditor.sistemas.startMenuTitle = startMenuTitle;
    data.UIEditor.sistemas.systemMenuDesc = systemMenuDesc;
    
    data.UIEditor.startScreen.titleText = titleText;
    data.UIEditor.startScreen.showTitle = showTitle;
    data.UIEditor.startScreen.bgImage = bgImage;
    data.UIEditor.startScreen.suggestedRes = suggestedRes;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang} translations!`);
}

// Update English
updateTranslation(
    'en', 
    'Main Menu', 
    'Enables the Main Menu, manual saving and the system ESC button/key.',
    'Fiction Title',
    'Show Title',
    'Background Image',
    '1920x1080 suggested'
);

// Update Portuguese
updateTranslation(
    'pt', 
    'Menu Principal', 
    'Habilita o Menu Principal, salvamento manual e o botão/tecla ESC de sistema.',
    'Título da ficção',
    'Exibir Título',
    'Imagem de Fundo',
    '1920x1080 sugerido'
);
