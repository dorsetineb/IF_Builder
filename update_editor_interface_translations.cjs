const fs = require('fs');
const path = require('path');

function updateTranslation(lang, sidebarTitle, editorTitle, editorSubtitle) {
    const filePath = path.join(__dirname, `src/locales/${lang}/translation.json`);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.sidebar) data.sidebar = {};
    data.sidebar.editorInterface = sidebarTitle;

    if (!data.editorInterface) data.editorInterface = {};
    data.editorInterface.title = editorTitle;
    data.editorInterface.subtitle = editorSubtitle;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang} translations!`);
}

// Update English
updateTranslation(
    'en', 
    'Editor Interface', 
    'Editor Interface',
    "Configure the system language and personalize the editor's appearance by choosing your preferred visual theme."
);

// Update Portuguese
updateTranslation(
    'pt', 
    'Interface do Editor', 
    'Interface do Editor',
    'Configure a linguagem do sistema e personalize a aparência do editor escolhendo seu tema visual preferido.'
);
