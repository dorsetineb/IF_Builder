window.embeddedGameData = { "cena_inicial": "VNT_OPENING", "cenas": { "scn_bh0": { "id": "scn_bh0", "name": "CELDA OSCURA", "image": "assets/scene_image_scn_bh0.png", "description": "Te despiertas en una <celda> húmeda y estrecha. El aire huele a moho.\nUna <puerta> cerrada bloqueia la salida. En la esquina, un <cubo> oxidado. \nUn <ladrillo> llama la atención en la pared.", "interactions": [{ "id": "inter_hsq", "verbs": ["tirar", "empujar", "mover", "retirar", "quitar"], "target": "obj_seh", "successMessage": "Fuerzas el ladrillo y descubres un espacio vacío detrás de él. Algo brilla allí.", "goToScene": "scn_hja", "removesTargetFromScene": true, "transitionType": "zoom", "transitionSpeed": 4, "soundEffect": "assets/sfx_scn_bh0_0.mpeg" }, { "id": "inter_ggc", "verbs": ["patear", "golpear", "derribar", "aporrear", "puñetazo"], "target": "obj_abe", "successMessage": "Reúnes fuerzas e intentas derribar la puerta. El impacto resuena fuerte en el pasillo.", "goToScene": "scn_3br", "transitionType": "blur", "transitionSpeed": 4, "soundEffect": "assets/sfx_scn_bh0_1.mpeg" }, { "id": "inter_yui", "verbs": ["remover", "revolver", "patear", "tomar", "levantar", "mover"], "target": "obj_5fj", "successMessage": "Con asco, remueves el cubo. Algo se mueve en el agua sucia.", "goToScene": "scn_1o5", "transitionType": "zoom", "transitionSpeed": 4, "soundEffect": "assets/sfx_scn_bh0_2.mpeg" }, { "id": "inter_x1p", "verbs": ["usar", "abrir", "desbloquear", "insertar", "meter"], "target": "obj_abe", "requiresInInventory": "obj_f2n", "consumesItem": true, "goToScene": "VNT_VICTORY", "soundEffect": "assets/sfx_scn_bh0_3.mpeg" }], "isEndingScene": false, "removesChanceOnEntry": false, "restoresChanceOnEntry": false, "objectIds": ["obj_5fj", "obj_abe", "obj_seh"], "choices": [], "overlayEffect": "grain", "isDefeatOutcome": false }, "scn_hja": { "id": "scn_hja", "name": "DETRÁS DEL LADRILLO", "image": "assets/scene_image_scn_hja.png", "description": "Detrás del ladrillo, encuentras una <llave> oxidada. \nPuedes <volver> a la <celda> en cualquier momento.", "interactions": [{ "id": "inter_svi", "verbs": ["tomar", "agarrar", "guardar"], "target": "obj_f2n", "removesTargetFromScene": true, "addsToInventory": true, "soundEffect": "assets/sfx_scn_hja_0.mpeg", "successMessage": "Has tomado la llave y la has añadido al inventario." }, { "id": "inter_9r4", "verbs": ["volver", "ir", "regresar", "celda"], "target": "", "goToScene": "scn_bh0" }], "isEndingScene": false, "removesChanceOnEntry": false, "restoresChanceOnEntry": false, "objectIds": ["obj_f2n", "obj_abe"], "choices": [], "overlayEffect": "grain", "isDefeatOutcome": false }, "scn_3br": { "id": "scn_3br", "name": "¡HERIDO POR LA PUERTA!", "image": "assets/scene_image_scn_3br.png", "description": "¡CLANK!\nPateas la puerta con fuerza. \nCruje, pero algo estalla dentro de tu pie. El dolor es insoportable.\nPuedes <volver> a la <celda> en cualquier momento.", "interactions": [{ "id": "inter_445", "verbs": ["volver", "ir", "regresar", "celda"], "target": "", "goToScene": "scn_bh0" }], "isEndingScene": false, "removesChanceOnEntry": true, "restoresChanceOnEntry": false, "objectIds": [], "choices": [], "overlayEffect": "grain", "isDefeatOutcome": false }, "scn_1o5": { "id": "scn_1o5", "name": "¡UN RATÓN ATACA!", "image": "assets/scene_image_scn_1o5.png", "description": "Algo se agita dentro del cubo.\n¡SQUEEK!\nUn ratón ataca y clava los dientes en tu mano.\nPuedes <volver> a la <celda> en cualquier momento.", "interactions": [{ "id": "inter_b7l", "verbs": ["volver", "ir", "regresar", "celda"], "target": "", "goToScene": "scn_bh0" }], "isEndingScene": false, "removesChanceOnEntry": true, "restoresChanceOnEntry": false, "objectIds": [], "choices": [], "overlayEffect": "grain", "isDefeatOutcome": false }, "VNT_OPENING": { "id": "VNT_OPENING", "name": "Escapa de la Mazmorra", "image": "assets/splash_image.png", "description": "Te despiertas en una celda oscura.\n¡Escribe para escapar de la celda!\n\n(escribe AYUDA para acceder al tutorial)", "backgroundMusic": "assets/scene_bgm_VNT_OPENING.mpeg", "interactions": [], "isEndingScene": false, "removesChanceOnEntry": false, "restoresChanceOnEntry": false, "objectIds": [], "choices": [], "vignetteType": "opening", "vignetteButtonText": "COMENZAR", "vignetteNextSceneId": "scn_bh0", "overlayEffect": "rain", "isDefeatOutcome": false }, "VNT_VICTORY": { "id": "VNT_VICTORY", "name": "Victoria", "image": "assets/splash_image.png", "description": "La puerta cruje cuando giras la llave en la cerradura. \nSales de la celda y sientes el viento fresco de la noche.", "backgroundMusic": "assets/scene_bgm_VNT_VICTORY.mpeg", "interactions": [], "isEndingScene": false, "removesChanceOnEntry": false, "restoresChanceOnEntry": false, "objectIds": [], "choices": [], "vignetteType": "conclusion", "overlayEffect": "grain", "isDefeatOutcome": false }, "VNT_DEFEAT": { "id": "VNT_DEFEAT", "name": "Derrota", "image": "assets/splash_image.png", "description": "Has muerto en la mazmorra...", "backgroundMusic": "assets/scene_bgm_VNT_DEFEAT.mpeg", "interactions": [], "isEndingScene": false, "removesChanceOnEntry": false, "restoresChanceOnEntry": false, "objectIds": [], "choices": [], "vignetteType": "conclusion", "overlayEffect": "rain", "isDefeatOutcome": false } }, "globalObjects": { "obj_5fj": { "id": "obj_5fj", "name": "cubo", "examineDescription": "Un cubo oxidado tirado en el suelo. ¿Habrá algo dentro?", "isTakable": false }, "obj_abe": { "id": "obj_abe", "name": "puerta", "examineDescription": "La gran puerta de hierro de la celda. Está cerrada.", "isTakable": false, "image": "" }, "obj_seh": { "id": "obj_seh", "name": "ladrillo", "examineDescription": "Un ladrillo parece suelto en la pared. ¿Podré moverlo?", "isTakable": false }, "obj_f2n": { "id": "obj_f2n", "name": "llave", "examineDescription": "¡Una llave oxidada! Parece encajar en la cerradura de la puerta de la celda.", "isTakable": true, "image": "assets/scene_image_scn_hja.png" } }, "mensagem_falha_padrao": "Eso no parece tener ningún efecto.", "nome_jogador_diario": "TÚ", "gameSystemEnabled": "chances", "gameMaxChances": 2, "gameChanceIcon": "diamond", "gameChanceIconColor": "#d4af37", "gameChanceReturnButtonText": "Intentar de Nuevo", "gameTheme": "dark", "gameTextColorLight": "#18181b", "gameTitleColorLight": "#92400e", "gameFocusColorLight": "#b45309", "gameTextReadingFlow": "continuous", "gameBackgroundMusic": "assets/global_bgm.mpeg", "positiveEndingImage": "assets/splash_image.png", "positiveEndingContentAlignment": "right", "positiveEndingDescription": "¡Lograste escapar de la mazmorra!", "positiveEndingMusic": "" };

document.addEventListener('DOMContentLoaded', () => {
    const gameData = window.embeddedGameData;
    let currentSceneId = gameData.cena_inicial;
    let inventory = [];
    let isGameEnded = false;
    let isPrinting = false;
    let actionLog = [];
    let activePopupType = null;
    let gameChances = gameData.gameMaxChances || 3;
    const typeSpeedBase = 20;

    const sceneImage = document.getElementById('scene-image');
    const sceneDescription = document.getElementById('scene-description');
    const verbInput = document.getElementById('verb-input');
    const actionPopup = document.getElementById('action-popup');
    const overlayEffect = document.getElementById('overlay-effect');
    const standardActionBar = document.getElementById('standard-action-bar');
    const endingActionBar = document.getElementById('ending-action-bar');
    const diaryBtn = document.getElementById('diary-btn');
    const inventoryBtn = document.getElementById('inventory-btn');
    const suggestionsBtn = document.getElementById('suggestions-btn');
    const restartBtn = document.getElementById('restart-btn');

    const inventoryModal = document.getElementById('inventory-modal');
    const itemModal = document.getElementById('item-modal');
    const diaryModal = document.getElementById('diary-modal');
    const inventoryList = document.getElementById('inventory-list');
    const itemModalName = document.getElementById('item-modal-name');
    const itemModalDescription = document.getElementById('item-modal-description');
    const itemModalImage = document.getElementById('item-modal-image');
    const itemModalImageContainer = document.getElementById('item-modal-image-container');
    const diaryLog = document.getElementById('diary-log');

    const init = () => {
        loadScene(currentSceneId);
        verbInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });
        diaryBtn.onclick = showDiary;
        inventoryBtn.onclick = () => togglePopup('inventory');
        suggestionsBtn.onclick = () => togglePopup('suggestions');
        restartBtn.onclick = () => location.reload();
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.onclick = () => btn.closest('.modal').classList.remove('visible');
        });
        window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.classList.remove('visible'); };
    };

    const loadScene = (id, track = false, transition = 'fade', speed = 4, message = null) => {
        currentSceneId = id;
        const scene = gameData.cenas[id];
        if (message) printOutput(message);
        renderScene(scene);
        if (track) actionLog.push({ type: 'scene', name: scene.name, description: scene.description, image: scene.image });
        if (scene.isEndingScene) activateEndingUI('win');
    };

    const renderScene = (scene) => {
        sceneImage.src = scene.image;
        sceneDescription.innerHTML = '';
        printOutput(scene.description);
        applyOverlay(scene.overlayEffect);
    };

    const applyOverlay = (type) => {
        overlayEffect.className = 'overlay ' + (type || '');
    };

    const formatText = (text) => {
        return text.replace(/<([^>]+)>/g, '<span class="highlight">$1</span>');
    };

    const setupHighlights = (container) => {
        container.querySelectorAll('.highlight').forEach(el => {
            el.onclick = () => { verbInput.value = 'examinar ' + el.textContent; verbInput.focus(); };
        });
    };

    const printOutput = (text) => {
        const p = document.createElement('p');
        p.innerHTML = formatText(text);
        p.className = 'scene-paragraph';
        sceneDescription.appendChild(p);
        setupHighlights(p);
        sceneDescription.scrollTop = sceneDescription.scrollHeight;
    };

    const handleInput = () => {
        const input = verbInput.value.trim();
        if (input) {
            processCommand(input);
            verbInput.value = '';
        }
    };

    const hasWord = (word, text) => {
        if (!word || !text) return false;
        const normalizedWord = word.toLowerCase().trim();
        const normalizedText = text.toLowerCase();
        return normalizedText.includes(normalizedWord);
    };

    const processCommand = (input) => {
        const inputLower = input.toLowerCase().trim();
        const echo = document.createElement('p'); echo.className = 'verb-echo'; echo.textContent = '> ' + input; sceneDescription.appendChild(echo);
        const scene = gameData.cenas[currentSceneId];
        const sceneObjects = getObjectsForScene(currentSceneId);

        const lookVerbs = ["mirar", "examinar", "ver", "leer"];
        if (lookVerbs.some(v => hasWord(v, inputLower))) {
            const obj = sceneObjects.find(o => hasWord(o.name.toLowerCase(), inputLower)) || inventory.find(o => hasWord(o.name.toLowerCase(), inputLower));
            if (obj) { printOutput(obj.examineDescription); return; }
            printOutput(scene.description); return;
        }

        if (hasWord('inventario', inputLower) || hasWord('i', inputLower)) {
            showInventory(); return;
        }

        let foundInteraction = scene.interactions.find(i => {
            if (!i.verbs.some(v => hasWord(v, inputLower))) return false;
            if (i.target) {
                const obj = sceneObjects.find(o => i.target === o.id) || inventory.find(o => i.target === o.id);
                if (!obj) return false;
                return hasWord(obj.name.toLowerCase(), inputLower);
            }
            return true;
        });

        if (foundInteraction) { executeInteraction(foundInteraction); return; }
        printOutput(gameData.mensagem_falha_padrao || "No pasó nada.");
    };

    const executeInteraction = (interaction) => {
        if (interaction.successMessage) printOutput(interaction.successMessage);
        if (interaction.addsToInventory && interaction.target) {
            const obj = gameData.globalObjects[interaction.target];
            if (obj) addToInventory(obj);
        }
        if (interaction.goToScene) loadScene(interaction.goToScene, true);
    };

    const getObjectsForScene = (sceneId) => {
        const scene = gameData.cenas[sceneId];
        return (scene.objectIds || []).map(id => gameData.globalObjects[id]).filter(Boolean);
    };

    const addToInventory = (obj) => { if (!inventory.some(o => o.id === obj.id)) inventory.push(obj); };

    const showInventory = () => {
        inventoryModal.classList.add('visible');
        inventoryList.innerHTML = '';
        if (inventory.length === 0) {
            inventoryList.innerHTML = '<p>Tu inventario está vacío.</p>';
        } else {
            inventory.forEach(item => {
                const div = document.createElement('div');
                div.className = 'inventory-item';
                div.textContent = item.name;
                div.onclick = () => openItemModal(item);
                inventoryList.appendChild(div);
            });
        }
    };

    const openItemModal = (item) => {
        itemModalName.textContent = item.name;
        itemModalDescription.textContent = item.examineDescription;
        itemModal.classList.add('visible');
    };

    const showDiary = () => {
        diaryModal.classList.add('visible');
        diaryLog.innerHTML = '';
        actionLog.forEach(entry => {
            const p = document.createElement('p');
            p.textContent = entry.description || entry.text;
            diaryLog.appendChild(p);
        });
    };

    const togglePopup = (type) => {
        if (type === 'suggestions') showSuggestions();
        if (type === 'inventory') showInventory();
    };

    const showSuggestions = () => {
        actionPopup.classList.remove('hidden');
        actionPopup.innerHTML = '<div style="padding:10px;"><b>Ayuda:</b> Prueba verbos como "mirar", "tomar" o "usar" con los objetos resaltados.</div>';
        setTimeout(() => actionPopup.classList.add('hidden'), 3000);
    };

    init();
});
