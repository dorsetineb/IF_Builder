window.embeddedGameData = {"gameTitle":"Fuja da Masmorra","cena_inicial":"VNT_OPENING","cenas":{"scn_bh0":{"id":"scn_bh0","name":"CELA ESCURA","image":"assets/scene_image_scn_bh0.jpeg","description":"Você desperta em uma <cela> úmida e apertada.\nUma <porta> trancada bloqueia a saída. \nNo canto, um <balde> enferrujado. \nUm <tijolo> chama a atenção na parede.","backgroundMusic":"assets/scene_bgm_scn_bh0.mpeg","interactions":[{"id":"inter_hsq","verbs":["puxar","empurrar","mover","retirar","tirar","mexer","tocar","pressionar","deslizar","futucar","tatear"],"target":"obj_seh","successMessage":"","goToScene":"scn_hja","removesTargetFromScene":true,"soundEffect":"assets/sfx_scn_bh0_0.mpeg","icon":"star","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_ggc","verbs":["chutar","bater","arrombar","esmurrar","socar","bicar"],"target":"obj_abe","successMessage":"","goToScene":"scn_3br","soundEffect":"assets/sfx_scn_bh0_1.mpeg","icon":"skull","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_yui","verbs":["mexer","revirar","chutar","pegar","levantar","mover"],"target":"obj_5fj","successMessage":"","goToScene":"scn_1o5","soundEffect":"assets/sfx_scn_bh0_2.mpeg","icon":"skull","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_x1p","verbs":["usar","abrir","destrancar","inserir","enfiar"],"target":"obj_abe","requiresInInventory":"obj_f2n","consumesItem":true,"goToScene":"VNT_VICTORY","soundEffect":"assets/sfx_scn_bh0_3.mpeg","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_ajm","verbs":["gritar","berrar","chamar","falar","urrar"],"target":"","successMessage":"Você grita por ajuda, mas o silêncio permanece absoluto. Ninguém te ouve do lado de fora da cela..","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_4i9","verbs":["abrir","empurrar","destrancar","forçar"],"target":"","successMessage":"A porta está trancada. Você precisa de uma <chave> para abri-la.","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"isEndingScene":false,"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":["obj_5fj","obj_abe","obj_seh"],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Examinar","Abrir","Gritar","Chutar"]},"scn_hja":{"id":"scn_hja","name":"ATRÁS DO TIJOLO","image":"assets/scene_image_scn_hja.jpeg","description":"Você força o tijolo e descobre um espaço vazio atrás dele. \nAlgo brilha ali... É uma <chave> enferrujada!\nVocê pode <voltar> para a <cela> a qualquer momento.","interactions":[{"id":"inter_svi","verbs":["pegar","agarrar","guardar"],"target":"obj_f2n","removesTargetFromScene":true,"addsToInventory":true,"soundEffect":"assets/sfx_scn_hja_0.mpeg","successMessage":"Você pegou a chave e adicionou ao inventário.","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_9r4","verbs":["voltar","ir","retornar","cela"],"target":"","goToScene":"scn_bh0","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":["obj_f2n","obj_abe"],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Pegar","Voltar"]},"scn_3br":{"id":"scn_3br","name":"MACHUCADO PELA PORTA!","image":"assets/scene_image_scn_3br.jpeg","description":"Você reúne forças e tenta arrombar a porta. \nCLANK!\nO impacto ecoa alto no corredor. \nAlgo estala dentro do seu pé. A dor é insuportável.","interactions":[{"id":"inter_445","verbs":["voltar","retornar","ir","cela"],"target":"","goToScene":"scn_bh0","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"removesChanceOnEntry":true,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Voltar","Cela"]},"scn_1o5":{"id":"scn_1o5","name":"UM RATO ATACA!","image":"assets/scene_image_scn_1o5.jpeg","description":"Com nojo, você mexe no balde. \nAlgo se move lá dentro.\nSQUEEK!\nUm rato ataca e crava os dentes na sua mão!","interactions":[{"id":"inter_b7l","verbs":["voltar","retornar","ir","cela"],"target":"","goToScene":"scn_bh0","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"removesChanceOnEntry":true,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Voltar","Cela"]},"VNT_OPENING":{"id":"VNT_OPENING","name":"Fuja da Masmorra","image":"assets/splash_image.webp","description":"Você acorda em uma cela escura.\nEscreva para fugir da masmorra!\n\n(digite AJUDA para acessar o tutorial)","interactions":[],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"vignetteType":"opening","vignetteButtonText":"COMEÇAR","vignetteNextSceneId":"scn_bh0","overlayEffect":"rain","isDefeatOutcome":false,"suggestions":[]},"VNT_VICTORY":{"id":"VNT_VICTORY","name":"Você escapou","image":"assets/splash_image.webp","description":"A porta range quando você gira a chave na fechadura. \nVocê sai da cela e sente o vento fresco da noite.","backgroundMusic":"assets/scene_bgm_VNT_VICTORY.mpeg","interactions":[],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"vignetteType":"conclusion","overlayEffect":"grain","isDefeatOutcome":false,"suggestions":[]},"VNT_DEFEAT":{"id":"VNT_DEFEAT","name":"Você morreu na masmorra","image":"assets/splash_image.webp","description":"De fome? Doente? Ninguém saberá...","backgroundMusic":"assets/scene_bgm_VNT_DEFEAT.mpeg","interactions":[],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"vignetteType":"conclusion","vignetteButtonText":"Tentar Novamente","overlayEffect":"rain","isDefeatOutcome":true,"suggestions":[]}},"globalObjects":{"obj_5fj":{"id":"obj_5fj","name":"balde","examineDescription":"Um balde enferrujado jogado no chão. Será que tem algo dentro?","isTakable":false,"icon":"star"},"obj_abe":{"id":"obj_abe","name":"porta","examineDescription":"A grande porta de ferro da cela. Ela está trancada.","isTakable":false},"obj_seh":{"id":"obj_seh","name":"tijolo","examineDescription":"Um tijolo parece solto na parede. Será que consigo movê-lo?","isTakable":false,"icon":"star"},"obj_f2n":{"id":"obj_f2n","name":"chave","examineDescription":"Uma chave enferrujada! Ela parece encaixar na fechadura da porta de cela.","isTakable":true,"image":"assets/obj_image_obj_f2n.webp","icon":"star"}},"mensagem_falha_padrao":"Isso não parece ter nenhum efeito.","nome_jogador_diario":"VOCÊ","gameSystemEnabled":"none","gameMaxChances":2,"gameChanceIcon":"square","gameChanceIconColor":"#d4af37","gameChanceReturnButtonText":"Tentar Novamente","gameTextColor":"#a1a1aa","gameTitleColor":"#d4af37","gameFocusColor":"#fbbf24","gameTextReadingFlow":"continuous","positiveEndingImage":"assets/splash_image.webp","gameSplashContentVerticalAlignment":"bottom","positiveEndingContentAlignment":"right","positiveEndingDescription":"Você conseguiu fugir da masmorra!","positiveEndingMusic":"assets/positive_ending_bgm.mpeg","negativeEndingImage":"assets/splash_image.webp","negativeEndingContentAlignment":"right","negativeEndingDescription":"Você morreu...","gameRestartButtonText":"RECOMEÇAR","gameContinueButtonText":"CONTINUAR","gameSystemButtonText":"Salvar / Carregar","gameSaveMenuTitle":"Salvar","gameLoadMenuTitle":"Carregar","gameMainMenuButtonText":"Menu Principal","gameViewEndingButtonText":"Ver Final","fixedVerbs":[{"id":"verb_help_1","verbs":["ajuda","me ajude"],"description":"Como Interagir com o mundo:\nA base de tudo é o campo de texto, e a maioria dos comandos segue um formato simples:\n\nAções diretas: Para interagir com algo na cena, use VERBO + ALVO.\nPor exemplo: pegar chave ou olhar porta.\n\nUsando itens do inventário: Para usar um item que você coletou em algo na cena, o formato é VERBO + ITEM + ALVO.\nPor exemplo: usar chave na porta.\nLembre-se: o item (como a chave) precisa estar no seu inventário para que a ação funcione.\nFique de olho nas palavras destacadas na descrição da cena, como <esta>. Elas indicam pontos de interesse importantes!\n\nAlguns verbos são universais e muito úteis:\n\nOLHAR ou EXAMINAR: Use para descobrir mais detalhes sobre o que está ao seu redor. Você pode usar em um objeto específico (olhar tijolo) ou no ambiente em geral (olhar ao redor).\nPEGAR: Alguns objetos podem ser coletados e guardados no seu inventário para uso posterior. Se algo parecer útil e solto, tente pegá-lo!\n\nINVENTÁRIO: Para ver todos os itens que você carrega, clique no botão Inventário.\n\nVOLTAR: Se quiser retornar para a cena de onde acabou de vir, este comando pode funcionar.\n\nEstou Travado, e Agora?\nSeja criativo! Tente verbos diferentes para um mesmo objeto. empurrar, puxar, chutar, usar... a experimentação é a chave!\nBotão de Sugestões: Se estiver sem ideias, o botão Sugestões é seu melhor amigo. Ele pode te dar uma luz sobre as ações mais óbvias na cena atual.\n\nDiário: Esqueceu o que aconteceu ou um detalhe importante? O Diário guarda um registro de todas as cenas que você visitou e de suas ações. Use-o para relembrar pistas."}],"consequenceTrackers":[{"id":"trk_9mt","name":"Fome","initialValue":0,"maxValue":150,"consequenceSceneId":"VNT_DEFEAT","icon":"skull","barColor":"#dd5f5f","invertBar":false,"hideValue":true}],"gameShowTrackersUI":true,"gameShowSystemButton":false,"gameTextAnimationType":"typewriter","gameTextSpeed":3,"gameImageTransitionType":"fade","gameImageSpeed":1,"enableInventory":true,"enableSuggestions":true,"enableChances":true,"enableTrackers":true,"enableDiary":true,"enableFixedVerbs":true,"enableImages":true,"enableTextControl":true,"enableRetrospective":true,"diaryAllowExport":false,"gameInteractionType":"parser","gameSuggestionsEmptyFeedback":"Não há sugestões","gameInventoryEmptyFeedback":"Não há itens no inventário","enableSystemMenu":false,"showStartScreenTitle":true,"startScreenTitle":"","startScreenButtonAlignment":"center","startScreenVerticalAlignment":"center","gameMenuTransitionType":"fade","gameMenuTransitionSpeed":500,"gameMenuTransitionSound":"","gameTranslations":{"view_diary_btn":"Ver Diário","stats_visited":"Você visitou","stats_time":"Tempo decorrido","of_scenes":"cenas"}};


document.addEventListener('DOMContentLoaded', () => {

    const ICONS = {
        heart: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="%COLOR%" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="%COLOR%" stroke-width="4" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="%COLOR%" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
    };
    
    const ICONS_OUTLINE = {
        heart: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
    };

    window.safeHTML = function(content, config) {
        if (typeof DOMPurify !== 'undefined') {
            const finalConfig = config || {};
            finalConfig.ADD_ATTR = [...(finalConfig.ADD_ATTR || []), 'class', 'style', 'data-word', 'data-slot', 'title', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd', 'x1', 'y1', 'x2', 'y2'];
            finalConfig.ADD_TAGS = [...(finalConfig.ADD_TAGS || []), 'span', 'svg', 'path', 'line'];
            return DOMPurify.sanitize(content, finalConfig);
        }
        // Fail Secure: If DOMPurify is missing, return raw text without HTML execution
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        // Basic escaping just in case it's used in innerHTML somewhere
        return tempDiv.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    const gameData = window.embeddedGameData;
    let currentSceneId = gameData.cena_inicial;
    let inventory = [];
    let visitedScenes = []; 
    let actionLog = []; 
    let chances = gameData.gameMaxChances || 3;
    let lastChanceChange = null; 
    let isGameEnded = false;
    let gameStartTime = null;
    let gameEndTime = null;
    let trackers = {};
    let removedObjectsFromScenes = {}; 
    let currentBgmSrc = "";
    let isPrinting = false;
    let activePopupType = null;
    let renderSessionId = 0; // Prevent race conditions in rendering
    let isGameSessionActive = false;

    const previewSaves = {};

    const getGameSave = (key) => {
        if (window.isPreview) {
            return previewSaves[key] || null;
        }
        return localStorage.getItem(key);
    };

    const setGameSave = (key, value) => {
        if (window.isPreview) {
            previewSaves[key] = value;
            return;
        }
        localStorage.setItem(key, value);
    };

    const removeGameSave = (key) => {
        if (window.isPreview) {
            delete previewSaves[key];
            return;
        }
        localStorage.removeItem(key);
    };

    const savedTextSpeed = window.isPreview ? null : localStorage.getItem('if_builder_settings_text_speed');
    let textSpeedVal = savedTextSpeed ? parseInt(savedTextSpeed) : (gameData.gameTextSpeed || 3); 
    if (textSpeedVal === 5) textSpeedVal = 3; // Fallback for legacy text speed 5
    
    const savedImgSpeed = window.isPreview ? null : localStorage.getItem('if_builder_settings_image_speed');
    let imgSpeedVal = 0.5;
    if (savedImgSpeed) {
        const speedVal = parseInt(savedImgSpeed);
        if (speedVal === 1) imgSpeedVal = 2.0;
        else if (speedVal === 2) imgSpeedVal = 1.0;
        else if (speedVal === 3) imgSpeedVal = 0.5;
        else if (speedVal === 4) imgSpeedVal = 0.2;
        else {
            const parsed = parseFloat(savedImgSpeed);
            imgSpeedVal = isNaN(parsed) ? 0.5 : parsed;
        }
    } else {
        const rawSpeed = gameData.gameImageSpeed;
        const speedVal = rawSpeed !== undefined && rawSpeed !== null ? Number(rawSpeed) : 3;
        if (speedVal === 1) imgSpeedVal = 2.0;
        else if (speedVal === 2) imgSpeedVal = 1.0;
        else if (speedVal === 3 || speedVal === 5) imgSpeedVal = 0.5;
        else if (speedVal === 4) imgSpeedVal = 0.2;
        else imgSpeedVal = 0.5;
    }
    
    if (isNaN(imgSpeedVal) || imgSpeedVal < 0.1 || imgSpeedVal > 3.0) {
        imgSpeedVal = 0.5;
    }
    
    let typeSpeedBase = 40;
    let textAnimDuration = '0.5s';
    if (textSpeedVal === 1) {
        typeSpeedBase = 150;
        textAnimDuration = '2.0s';
    } else if (textSpeedVal === 2) {
        typeSpeedBase = 80;
        textAnimDuration = '1.0s';
    } else if (textSpeedVal === 3) {
        typeSpeedBase = 40;
        textAnimDuration = '0.5s';
    } else {
        typeSpeedBase = 15;
        textAnimDuration = '0.2s';
    }
    const imageAnimDuration = imgSpeedVal + 's';
    
    document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
    document.documentElement.style.setProperty('--image-anim-speed', imageAnimDuration);

    const updateFogSizes = (fogContainer) => {
        if (!fogContainer) return;
        const img1 = new Image();
        const img2 = new Image();
        img1.src = "https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-1.png";
        img2.src = "https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-2.png";

        const update = () => {
            const rect = fogContainer.getBoundingClientRect();
            const W = rect.width;
            const H = rect.height;
            if (W === 0 || H === 0) return;

            if (img1.complete && img1.naturalWidth) {
                const R1 = img1.naturalWidth / img1.naturalHeight;
                const vw = W / H > R1 ? W : H * R1;
                const vh = W / H > R1 ? W / R1 : H;
                fogContainer.style.setProperty('--fog-width-1', vw + 'px');
                fogContainer.style.setProperty('--fog-height-1', vh + 'px');
            }
            if (img2.complete && img2.naturalWidth) {
                const R2 = img2.naturalWidth / img2.naturalHeight;
                const vw = W / H > R2 ? W : H * R2;
                const vh = W / H > R2 ? W / R2 : H;
                fogContainer.style.setProperty('--fog-width-2', vw + 'px');
                fogContainer.style.setProperty('--fog-height-2', vh + 'px');
            }
        };

        img1.onload = update;
        img2.onload = update;
        
        window.addEventListener('resize', update);
        update(); 
    };

    (gameData.consequenceTrackers || []).forEach(t => { trackers[t.id] = t.initialValue; });

    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const endingRestartButtons = document.querySelectorAll('#positive-ending-screen .ending-restart-button, #negative-ending-screen .ending-restart-button');
    
    const gameContainer = document.getElementById('game-container');
    const imageContainer = document.getElementById('image-container');
    const sceneImage = document.getElementById('scene-image');
    const sceneImageBack = document.getElementById('scene-image-back');
    const sceneDescription = document.getElementById('scene-description');
    const verbInput = document.getElementById('verb-input');
    const submitVerb = document.getElementById('submit-verb');
    const actionPopup = document.getElementById('action-popup');
    const suggestionsButton = document.getElementById('suggestions-button');
    const inventoryButton = document.getElementById('inventory-button');
    const diaryButton = document.getElementById('diary-button');
    const notesButton = document.getElementById('notes-button');
    const trackersButton = document.getElementById('trackers-button');
    const systemButton = document.getElementById('system-button');
    const exportPdfButton = document.getElementById('export-pdf-button');
    const sceneNameOverlay = document.getElementById('scene-name-overlay');
    // Overlay Injection if not present
    let sceneOverlay = document.getElementById('scene-overlay');
    if (!sceneOverlay && imageContainer) {
        sceneOverlay = document.createElement('div');
        sceneOverlay.id = 'scene-overlay';
        sceneOverlay.className = 'scene-overlay'; // Base class
        imageContainer.appendChild(sceneOverlay);
    }

    const soundEffectAudio = document.getElementById('scene-sound-effect');
    const bgmAudio = document.getElementById('bgm-audio');
    
    const standardActionBar = document.getElementById('standard-action-bar');
    const endingActionBar = document.getElementById('ending-action-bar');
    const viewEndingButton = document.getElementById('view-ending-button');
    
    const diaryModal = document.getElementById('diary-modal');
    const diaryLog = document.getElementById('diary-log');
    const notesModal = document.getElementById('notes-modal');
    const notesTextarea = document.getElementById('notes-textarea');
    const trackersModal = document.getElementById('trackers-modal');
    const trackersContent = document.getElementById('trackers-content');
    const itemModal = document.getElementById('item-modal');
    const itemModalName = document.getElementById('item-modal-name');
    const itemModalImageContainer = document.getElementById('item-modal-image-container');
    const itemModalImage = document.getElementById('item-modal-image');
    const itemModalDescription = document.getElementById('item-modal-description');
    
    const acquisitionModal = document.getElementById('acquisition-modal');
    const acquisitionModalTitle = document.getElementById('acquisition-modal-title');
    const acquisitionModalImageContainer = document.getElementById('acquisition-modal-image-container');
    const acquisitionModalImage = document.getElementById('acquisition-modal-image');
    const acquisitionModalDescription = document.getElementById('acquisition-modal-description');
    
    const systemModal = document.getElementById('system-modal');
    const settingsModal = document.getElementById('settings-modal');
    const systemModalTitle = document.getElementById('system-modal-title');
    const systemMenuMain = document.getElementById('system-menu-main');
    const systemSlotsContainer = document.getElementById('system-slots-container');
    const slotsList = document.getElementById('slots-list');
    const btnSaveMenu = document.getElementById('btn-save-menu');
    const btnLoadMenu = document.getElementById('btn-load-menu');
    const btnMainMenu = document.getElementById('btn-main-menu');
    const btnBackSystem = document.getElementById('btn-back-system');
    
    const closeButtons = document.querySelectorAll('.modal-close-button');

    // Vignette screen elements detection and injection
    let vignetteScreen = document.getElementById('vignette-screen');
    // Force remove existing element to ensure updates are applied (fixing stale DOM issues)
    if (vignetteScreen) vignetteScreen.remove();

    console.log('Injecting Vignette screen...');
    const vDiv = document.createElement('div');
    vDiv.id = 'vignette-screen';
    vDiv.className = 'splash-screen hidden';
    // Use inline styles as a fallback to guarantee the look matches splash button even if CSS is missing
    const btnStyle = 'font-family: var(--font-family); padding: 12px 24px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color); transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; background-color: var(--splash-button-bg);';
    vDiv.innerHTML = '<div id="vignette-overlay" class="scene-overlay" style="z-index: 1;"></div><div class="splash-content" style="z-index: 10; position: relative;"><div class="splash-text"><h1 id="vignette-title"></h1><p id="vignette-description"></p></div><div class="splash-buttons" style="position: relative; z-index: 10;"><button id="vignette-continue-button" class="ending-restart-button" style="' + btnStyle + '"></button></div></div>';
    document.body.appendChild(vDiv);
    vignetteScreen = vDiv;

    const vignetteTitle = document.getElementById('vignette-title');
    const vignetteDescription = document.getElementById('vignette-description');
    const vignetteContinueButton = document.getElementById('vignette-continue-button');

    // View Diary button in vignettes
    const vignetteDiaryButton = document.createElement('button');
    vignetteDiaryButton.id = 'vignette-diary-button';
    vignetteDiaryButton.className = 'ending-restart-button hidden';
    vignetteDiaryButton.style.cssText = btnStyle + ' margin-top: 10px;';
    vignetteDiaryButton.textContent = (gameData.gameTranslations && gameData.gameTranslations.view_diary_btn) || 'Ver Diário';
    if (vignetteContinueButton && vignetteContinueButton.parentElement) {
        vignetteContinueButton.parentElement.appendChild(vignetteDiaryButton);
    }
    vignetteDiaryButton.addEventListener('click', () => showDiary(true));

    // Also add to standard ending screens
    [positiveEndingScreen, negativeEndingScreen].forEach(screen => {
        if (!screen) return;
        const btnContainer = screen.querySelector('.splash-buttons') || screen.querySelector('.splash-content');
        if (btnContainer) {
            const endDiaryBtn = document.createElement('button');
            endDiaryBtn.className = 'ending-restart-button';
            endDiaryBtn.style.cssText = btnStyle + ' margin-top: 10px;';
            endDiaryBtn.textContent = gameData.gameTranslations.view_diary_btn;
            btnContainer.appendChild(endDiaryBtn);
            endDiaryBtn.addEventListener('click', () => showDiary(true));
        }
    });

    const audioBlobCache = new Map();
    const getAudioSrc = async (src) => {
        if (!src) return "";
        if (src.startsWith('blob:') || src.startsWith('data:')) return src;
        if (audioBlobCache.has(src)) return audioBlobCache.get(src);
        try {
            const response = await fetch(src);
            if (!response.ok) throw new Error('Audio fetch failed');
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            audioBlobCache.set(src, blobUrl);
            return blobUrl;
        } catch (e) {
            console.warn('Failed to fetch audio as blob, falling back to original source:', e);
            return src;
        }
    };

    const playSound = (src) => {
        if (src && soundEffectAudio) {
            getAudioSrc(src).then(resolvedSrc => {
                try {
                    soundEffectAudio.pause();
                    soundEffectAudio.currentTime = 0;
                } catch (_) {}
                soundEffectAudio.src = resolvedSrc;
                soundEffectAudio.play().catch((e) => console.warn("playSound failed:", e));
            });
        }
    };

    let bgmFadeInterval = null;
    const playBgm = (src) => {
        if (!bgmAudio) return;
        if (src === currentBgmSrc) {
            if (bgmAudio.paused && src) {
                bgmAudio.play().catch(() => {});
            }
            return;
        }
        
        const fadeOut = (callback) => {
            if (bgmFadeInterval) clearInterval(bgmFadeInterval);
            let vol = bgmAudio.volume;
            bgmFadeInterval = setInterval(() => {
                vol -= 0.1;
                if (vol <= 0) {
                    clearInterval(bgmFadeInterval);
                    bgmAudio.pause();
                    bgmAudio.volume = 0;
                    try { bgmAudio.currentTime = 0; } catch (_) {}
                    callback();
                } else {
                    bgmAudio.volume = Math.max(0, vol);
                }
            }, 50);
        };

        const fadeIn = () => {
            if (bgmFadeInterval) clearInterval(bgmFadeInterval);
            bgmAudio.volume = 0;
            try { bgmAudio.currentTime = 0; } catch (_) {}
            bgmAudio.play().catch(() => {});
            let vol = 0;
            bgmFadeInterval = setInterval(() => {
                vol += 0.1;
                if (vol >= 1) {
                    clearInterval(bgmFadeInterval);
                    bgmAudio.volume = 1;
                } else {
                    bgmAudio.volume = Math.min(1, vol);
                }
            }, 50);
        };

        const applyNewBgm = (resolvedSrc) => {
            try {
                bgmAudio.pause();
                bgmAudio.currentTime = 0;
            } catch (_) {}
            bgmAudio.src = resolvedSrc;
            const onMeta = () => {
                try { bgmAudio.currentTime = 0; } catch (_) {}
                bgmAudio.removeEventListener('loadedmetadata', onMeta);
            };
            bgmAudio.addEventListener('loadedmetadata', onMeta);
            fadeIn();
        };

        let targetSrc = src;
        currentBgmSrc = src;
        if (!src) {
            fadeOut(() => {
                try {
                    bgmAudio.pause();
                    bgmAudio.currentTime = 0;
                } catch (_) {}
                bgmAudio.src = "";
            });
            return;
        }

        if (bgmAudio.src && !bgmAudio.paused) {
            fadeOut(() => {
                getAudioSrc(targetSrc).then(resolvedSrc => {
                    if (currentBgmSrc !== targetSrc) return;
                    applyNewBgm(resolvedSrc);
                });
            });
        } else {
            getAudioSrc(targetSrc).then(resolvedSrc => {
                if (currentBgmSrc !== targetSrc) return;
                applyNewBgm(resolvedSrc);
            });
        }
    };

    class RainEffect {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.drops = [];
            this.animationFrameId = null;
            this.overlay = null;
            // Config
            this.fall_speed = 0.7;
            this.wind_speed = 5;
            this.rain_weight = 0.11;
            this.rain_color = '255,255,255';
            this.started = false;
            this.boundResize = null;
        }

        init(targetId) {
            this.overlay = document.getElementById(targetId);
            if (!this.overlay) return;
            
            // Check if canvas already exists
            let canvas = this.overlay.querySelector('.rain-canvas');
            if (!canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'rain-canvas';
                this.overlay.appendChild(this.canvas);
                
                // Add Lightning Layer
                const lightning = document.createElement('div');
                lightning.className = 'lightning-layer';
                this.overlay.appendChild(lightning);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext('2d');
            
            // Resize immediately
            this.resizer();
            if (!this.boundResize) {
                this.boundResize = () => this.resizer();
                window.addEventListener('resize', this.boundResize);
            }
        }

        start(targetId = 'scene-overlay') {
            if (this.started && this.currentTargetId === targetId) return;
            if (this.started) this.stop();
            this.currentTargetId = targetId;
            this.init(targetId);
            if (!this.ctx) return;
            this.started = true;
            this.loop();
        }

        stop() {
            this.started = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        randomFrom(min, max) {
            return (Math.random() * (max - min) + min);
        }

        resizer() {
            if (!this.canvas || !this.overlay) return;
            const width = this.overlay.clientWidth || window.innerWidth;
            const height = this.overlay.clientHeight || window.innerHeight;
            this.canvas.width = width;
            this.canvas.height = height;
            
            const drop_count = Math.min(150, Math.max(30, Math.floor(width * this.rain_weight * 0.75)));
            this.drops = [];
            for (let i = 0; i < drop_count; i++) {
                this.drops[i] = new Drop(this);
            }
        }

        loop() {
            if (!this.started || !this.ctx || !this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.drops.length; i++) {
                this.drops[i].fall();
                this.drops[i].draw(this.ctx);
            }
            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }
    }

    class Drop {
        constructor(effect) {
            this.effect = effect;
            this.reset(true);
        }
        
        reset(initial = false) {
            const canvas = this.effect.canvas;
            if (!canvas) return;
            this.r = this.effect.randomFrom(0.8, 1.8);
            this.l = this.r * 220;
            this.x = this.effect.randomFrom(canvas.width * -0.25, canvas.width * 1.125);
            this.y = initial ? this.effect.randomFrom(0, canvas.height) : this.effect.randomFrom(canvas.height * -0.2, canvas.height * -0.8);
            this.dx = this.effect.randomFrom(this.effect.wind_speed - 3, this.effect.wind_speed + 3);
            this.dy = this.r * (100 * this.effect.fall_speed);
            this.offset = this.l * (this.dx / this.dy);
            this.opacity = this.effect.randomFrom(0.15, 0.55);
            this.color = 'rgba(' + this.effect.rain_color + ', ' + this.opacity + ')';
        }

        draw(ctx) {
            if (!ctx) return;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.r;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.offset, this.y + this.l);
            ctx.stroke();
        }

        fall() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.effect.canvas && this.y > (this.effect.canvas.height * 1.25)) {
                this.reset(false);
            }
        }
    }

    const rainEffect = new RainEffect();

    // Confetti Effect Classes
    class Vector2 {
        constructor(x, y) { this.x = x; this.y = y; }
        Length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
        Add(v) { this.x += v.x; this.y += v.y; }
        Sub(v) { this.x -= v.x; this.y -= v.y; }
        Div(f) { this.x /= f; this.y /= f; }
        Mul(f) { this.x *= f; this.y *= f; }
        Normalize() {
            const len = this.Length();
            if (len !== 0) { this.x /= len; this.y /= len; }
        }
        static Sub(v0, v1) { return new Vector2(v0.x - v1.x, v0.y - v1.y); }
    }

    class EulerMass {
        constructor(x, y, mass, drag) {
            this.position = new Vector2(x, y);
            this.mass = mass; this.drag = drag;
            this.force = new Vector2(0, 0);
            this.velocity = new Vector2(0, 0);
        }
        AddForce(f) { this.force.Add(f); }
        Integrate(dt) {
            const acc = new Vector2(this.force.x, this.force.y);
            const speed = this.velocity.Length();
            const dragVel = new Vector2(this.velocity.x, this.velocity.y);
            dragVel.Mul(this.drag * this.mass * speed);
            acc.Sub(dragVel);
            acc.Div(this.mass);
            const posDelta = new Vector2(this.velocity.x, this.velocity.y);
            posDelta.Mul(dt);
            this.position.Add(posDelta);
            acc.Mul(dt);
            this.velocity.Add(acc);
            this.force = new Vector2(0, 0);
        }
    }

    class ConfettiPaper {
        constructor(x, y, effect) {
            this.effect = effect;
            this.pos = new Vector2(x, y);
            this.rotationSpeed = Math.random() * 600 + 800;
            this.angle = (Math.PI / 180) * Math.random() * 360;
            this.rotation = (Math.PI / 180) * Math.random() * 360;
            this.cosA = 1.0;
            this.size = 5.0;
            this.oscillationSpeed = Math.random() * 1.5 + 0.5;
            this.xSpeed = 40.0;
            this.ySpeed = Math.random() * 60 + 50.0;
            this.corners = [];
            this.time = Math.random();
            const colors = [["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];
            const ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0];
            this.backColor = colors[ci][1];
            for (let i = 0; i < 4; i++) {
                this.corners[i] = new Vector2(
                    Math.cos(this.angle + (Math.PI / 180) * (i * 90 + 45)),
                    Math.sin(this.angle + (Math.PI / 180) * (i * 90 + 45))
                );
            }
        }
        Update(dt) {
            this.time += dt;
            this.rotation += this.rotationSpeed * dt;
            this.cosA = Math.cos((Math.PI / 180) * this.rotation);
            this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * dt;
            this.pos.y += this.ySpeed * dt;
            if (this.pos.y > this.effect.canvasHeight) {
                this.pos.x = Math.random() * this.effect.canvasWidth;
                this.pos.y = 0;
            }
        }
        Draw(g) {
            const retina = window.devicePixelRatio || 1;
            g.fillStyle = this.cosA > 0 ? this.frontColor : this.backColor;
            g.beginPath();
            g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
            for (let i = 1; i < 4; i++) {
                g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
            }
            g.closePath();
            g.fill();
        }
    }

    class ConfettiRibbon {
        constructor(x, y, count, dist, thickness, angle, mass, drag, effect) {
            this.effect = effect;
            this.particleDist = dist; this.particleCount = count;
            this.particleMass = mass; this.particleDrag = drag;
            this.particles = [];
            const colors = [["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];
            const ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0]; this.backColor = colors[ci][1];
            this.xOff = Math.cos((Math.PI / 180) * angle) * thickness;
            this.yOff = Math.sin((Math.PI / 180) * angle) * thickness;
            this.position = new Vector2(x, y);
            this.prevPosition = new Vector2(x, y);
            this.velocityInherit = Math.random() * 2 + 4;
            this.time = Math.random() * 100;
            this.oscillationSpeed = Math.random() * 2 + 2;
            this.oscillationDistance = Math.random() * 40 + 40;
            this.ySpeed = Math.random() * 40 + 80;
            for (let i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(x, y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        }
        Update(dt) {
            this.time += dt * this.oscillationSpeed;
            this.position.y += this.ySpeed * dt;
            this.position.x += Math.cos(this.time) * this.oscillationDistance * dt;
            this.particles[0].position = this.position;
            const dX = this.prevPosition.x - this.position.x;
            const dY = this.prevPosition.y - this.position.y;
            const delta = Math.sqrt(dX * dX + dY * dY);
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            for (let i = 1; i < this.particleCount; i++) {
                const dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
                dirP.Normalize();
                dirP.Mul((delta / dt) * this.velocityInherit);
                this.particles[i].AddForce(dirP);
            }
            for (let i = 1; i < this.particleCount; i++) {
                this.particles[i].Integrate(dt);
            }
            for (let i = 1; i < this.particleCount; i++) {
                const rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
                rp2.Sub(this.particles[i - 1].position);
                rp2.Normalize();
                rp2.Mul(this.particleDist);
                rp2.Add(this.particles[i - 1].position);
                this.particles[i].position = rp2;
            }
            if (this.position.y > this.effect.canvasHeight + this.particleDist * this.particleCount) {
                this.Reset();
            }
        }
        Reset() {
            this.position.y = -Math.random() * this.effect.canvasHeight;
            this.position.x = Math.random() * this.effect.canvasWidth;
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            this.velocityInherit = Math.random() * 2 + 4;
            this.time = Math.random() * 100;
            this.oscillationSpeed = Math.random() * 2.0 + 1.5;
            this.oscillationDistance = Math.random() * 40 + 40;
            this.ySpeed = Math.random() * 40 + 80;
            const colors = [["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];
            const ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0]; this.backColor = colors[ci][1];
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        }
        Side(x1, y1, x2, y2, x3, y3) { return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2); }
        Draw(g) {
            const retina = window.devicePixelRatio || 1;
            for (let i = 0; i < this.particleCount - 1; i++) {
                const p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
                const p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
                g.fillStyle = this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0 ? this.frontColor : this.backColor;
                g.strokeStyle = g.fillStyle;
                g.beginPath();
                g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                g.lineTo(p1.x * retina, p1.y * retina);
                g.lineTo(p0.x * retina, p0.y * retina);
                g.closePath();
                g.stroke();
                g.fill();
            }
        }
    }

    class ConfettiEffect {
        constructor() {
            this.canvas = null; this.ctx = null;
            this.papers = []; this.ribbons = [];
            this.animationFrameId = null;
            this.overlay = null;
            this.canvasWidth = 0; this.canvasHeight = 0;
            this.started = false;
            this.duration = 1.0 / 50;
            this.boundResize = null;
        }
        init(targetId) {
            this.overlay = document.getElementById(targetId);
            if (!this.overlay) return;
            let canvas = this.overlay.querySelector('.confetti-canvas');
            if (!canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'confetti-canvas';
                this.overlay.appendChild(this.canvas);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext('2d');
            this.resizer();
            if (!this.boundResize) {
                this.boundResize = () => this.resizer();
                window.addEventListener('resize', this.boundResize);
            }
        }
        start(targetId = 'scene-overlay') {
            if (this.started && this.currentTargetId === targetId) return;
            if (this.started) this.stop();
            this.currentTargetId = targetId;
            this.init(targetId);
            if (!this.ctx) return;
            this.started = true;
            this.loop();
        }
        stop() {
            this.started = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        resizer() {
            if (!this.canvas || !this.overlay) return;
            const retina = window.devicePixelRatio || 1;
            this.canvasWidth = this.overlay.clientWidth;
            this.canvasHeight = this.overlay.clientHeight;
            this.canvas.width = this.canvasWidth * retina;
            this.canvas.height = this.canvasHeight * retina;
            this.papers = [];
            for (let i = 0; i < 95; i++) {
                this.papers.push(new ConfettiPaper(Math.random() * this.canvasWidth, Math.random() * this.canvasHeight, this));
            }
            this.ribbons = [];
            for (let i = 0; i < 11; i++) {
                this.ribbons.push(new ConfettiRibbon(Math.random() * this.canvasWidth, -Math.random() * this.canvasHeight * 2, 30, 8.0, 8.0, 45, 1, 0.05, this));
            }
        }
        loop() {
            if (!this.started || !this.ctx || !this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.papers.length; i++) {
                this.papers[i].Update(this.duration);
                this.papers[i].Draw(this.ctx);
            }
            for (let i = 0; i < this.ribbons.length; i++) {
                this.ribbons[i].Update(this.duration);
                this.ribbons[i].Draw(this.ctx);
            }
            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }
    }

    const confettiEffect = new ConfettiEffect();

    class GlitchEffect {
        constructor() {
            this.canvas = null; this.ctx = null;
            this.animationFrameId = null;
            this.overlay = null;
            this.started = false;
            this.width = 0; this.height = 0;
            this.boundResize = null;
        }

        init(targetId) {
            this.overlay = document.getElementById(targetId);
            if (!this.overlay) return;
            
            let canvas = this.overlay.querySelector('.glitch-canvas');
            if (!canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'glitch-canvas';
                this.overlay.appendChild(this.canvas);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            if (!this.boundResize) {
                this.boundResize = () => this.resize();
                window.addEventListener('resize', this.boundResize);
            }
        }

        resize() {
            if (!this.canvas || !this.overlay) return;
            this.width = this.canvas.width = this.overlay.clientWidth;
            this.height = this.canvas.height = this.overlay.clientHeight;
        }

        start(targetId = 'scene-overlay') {
            if (this.started && this.currentTargetId === targetId) return;
            if (this.started) this.stop();
            this.currentTargetId = targetId;
            this.init(targetId);
            if (!this.ctx || !this.overlay) return;
            
            this.overlay.classList.add('overlay-glitch');
            this.started = true;
            this.loop();
        }

        stop() {
            this.started = false;
            if (this.overlay) this.overlay.classList.remove('overlay-glitch');
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.width, this.height);
        }

        loop() {
            if (!this.started || !this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.width, this.height);

            // 1. Random horizontal slice displacements
            if (Math.random() > 0.9) {
                const sliceHeight = Math.random() * 50 + 5;
                const sliceY = Math.random() * this.height;
                
                this.ctx.fillStyle = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + (Math.random() * 0.5) + ')';
                this.ctx.fillRect(0, sliceY, this.width, sliceHeight);

                if (Math.random() > 0.5) {
                   this.ctx.clearRect(0, Math.random() * this.height, this.width, Math.random() * 10);
                }
            }

            // 2. RGB Shift / Blocks
            if (Math.random() > 0.8) {
                const blockW = Math.random() * 200 + 50;
                const blockH = Math.random() * 50 + 10;
                const blockX = Math.random() * this.width;
                const blockY = Math.random() * this.height;

                this.ctx.globalCompositeOperation = 'color-dodge';
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(blockX - 5, blockY, blockW, blockH);
                this.ctx.fillStyle = '#0000ff';
                this.ctx.fillRect(blockX + 5, blockY, blockW, blockH);
                this.ctx.globalCompositeOperation = 'source-over';
            }

            // 3. Scanline jitter
            if (Math.random() > 0.95) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.fillRect(0, 0, this.width, this.height);
            }

            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }
    }

    const glitchEffect = new GlitchEffect();

    const init = () => {
        const startAudioOnInteraction = () => {
            if (bgmAudio.paused && !isGameEnded && bgmAudio.src && bgmAudio.src !== window.location.href && bgmAudio.src !== "") {
                bgmAudio.play().catch(() => {});
            }
            document.removeEventListener('mousedown', startAudioOnInteraction);
            document.removeEventListener('keydown', startAudioOnInteraction);
        };
        document.addEventListener('mousedown', startAudioOnInteraction);
        document.addEventListener('keydown', startAudioOnInteraction);

        // Menu Principal & System Button Hooks
        const gearSystemButton = document.getElementById('gear-system-button');
        if (gearSystemButton) {
            gearSystemButton.classList.add('hidden');
        }

        const resumeBtn = document.getElementById('start-resume-game-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        hideStartScreen(() => {
                            if (gearSystemButton) {
                                gearSystemButton.classList.add('hidden');
                            }
                        });
                    });
                });
            });
        }

        const newGameBtn = document.getElementById('start-new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                if (isGameSessionActive && !window.isPreview) {
                    if (!confirm('Começar de novo apagará seu progresso atual e o caminho salvo automaticamente. Deseja continuar?')) {
                        return;
                    }
                }
                
                // Novo jogo apaga o autosave imediatamente!
                removeGameSave('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'));
                
                // Start game first so the first scene is rendered behind the menu
                startGame();
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        hideStartScreen(() => {
                            if (gearSystemButton) {
                                gearSystemButton.classList.add('hidden');
                            }
                        });
                    });
                });
            });
        }

        const continueBtn = document.getElementById('start-continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (isGameSessionActive) {
                    hideStartScreen();
                } else {
                    const latestSave = getLatestSave();
                    if (latestSave) {
                        // Load save first so it is rendered behind the menu
                        loadGameFromData(latestSave);
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                hideStartScreen(() => {
                                    if (gearSystemButton) {
                                        gearSystemButton.classList.add('hidden');
                                    }
                                });
                            });
                        });
                    }
                }
            });
        }

        const startSavesBtn = document.getElementById('start-saves-btn');
        const startScreenButtons = document.querySelector('.start-screen-buttons');
        const startScreenSavesContainer = document.getElementById('start-screen-saves-container');
        
        if (startSavesBtn) {
            startSavesBtn.addEventListener('click', () => {
                if (startScreenButtons) startScreenButtons.classList.add('hidden');
                if (startScreenSavesContainer) startScreenSavesContainer.classList.remove('hidden');
                renderStartScreenSlots();
            });
        }

        const startScreenSavesBackBtn = document.getElementById('start-screen-saves-back-btn');
        if (startScreenSavesBackBtn) {
            startScreenSavesBackBtn.addEventListener('click', () => {
                if (startScreenSavesContainer) startScreenSavesContainer.classList.add('hidden');
                if (startScreenButtons) startScreenButtons.classList.remove('hidden');
                showStartScreen(true);
            });
        }

        const startOptionsBtn = document.getElementById('start-options-btn');
        const startScreenOptionsContainer = document.getElementById('start-screen-options-container');
        if (startOptionsBtn) {
            startOptionsBtn.addEventListener('click', () => {
                if (startScreenButtons) startScreenButtons.classList.add('hidden');
                if (startScreenOptionsContainer) startScreenOptionsContainer.classList.remove('hidden');
                syncSquareSliders();
            });
        }

        const startScreenOptionsBackBtn = document.getElementById('start-screen-options-back-btn');
        if (startScreenOptionsBackBtn) {
            startScreenOptionsBackBtn.addEventListener('click', () => {
                if (startScreenOptionsContainer) startScreenOptionsContainer.classList.add('hidden');
                if (startScreenButtons) startScreenButtons.classList.remove('hidden');
                showStartScreen(true);
            });
        }

        const getSpeedLabel = (level) => {
            const l = parseInt(level);
            if (l === 1) return "Muito Lento";
            if (l === 2) return "Lento";
            if (l === 3) return "Normal";
            if (l === 4) return "Rápido";
            return "Normal";
        };

        const syncSquareSliders = () => {
            const sqVolume = document.getElementById('start-square-volume');
            const sqVolumeVal = document.getElementById('start-square-volume-val');
            const sqTextSpeed = document.getElementById('start-square-text-speed');
            const sqTextSpeedVal = document.getElementById('start-square-text-speed-val');
            const sqImageSpeed = document.getElementById('start-square-image-speed');
            const sqImageSpeedVal = document.getElementById('start-square-image-speed-val');

            const savedVol = (window.isPreview ? null : localStorage.getItem('if_builder_settings_volume')) || '100';
            if (sqVolume) {
                sqVolume['value'] = savedVol;
                if (sqVolumeVal) sqVolumeVal.textContent = savedVol + '%';
            }

            const savedTextSpeed = (window.isPreview ? null : localStorage.getItem('if_builder_settings_text_speed')) || '3';
            if (sqTextSpeed) {
                sqTextSpeed['value'] = savedTextSpeed;
                if (sqTextSpeedVal) sqTextSpeedVal.textContent = getSpeedLabel(savedTextSpeed);
            }

            const savedImageSpeed = (window.isPreview ? null : localStorage.getItem('if_builder_settings_image_speed')) || '3';
            if (sqImageSpeed) {
                sqImageSpeed['value'] = savedImageSpeed;
                if (sqImageSpeedVal) sqImageSpeedVal.textContent = getSpeedLabel(savedImageSpeed);
            }
        };

        const bgm = bgmAudio;
        const sfx = soundEffectAudio;

        const sqVolume = document.getElementById('start-square-volume');
        const sqVolumeVal = document.getElementById('start-square-volume-val');
        if (sqVolume) {
            sqVolume.addEventListener('input', (e) => {
                const target = e.target;
                const volVal = parseFloat(target['value']);
                if (sqVolumeVal) sqVolumeVal.textContent = volVal + '%';
                if (bgm) bgm.volume = volVal / 100;
                if (sfx) sfx.volume = volVal / 100;
                localStorage.setItem('if_builder_settings_volume', volVal.toString());
            });
        }

        const sqTextSpeed = document.getElementById('start-square-text-speed');
        const sqTextSpeedVal = document.getElementById('start-square-text-speed-val');
        if (sqTextSpeed) {
            sqTextSpeed.addEventListener('input', (e) => {
                const target = e.target;
                const speed = parseInt(target['value']);
                if (sqTextSpeedVal) sqTextSpeedVal.textContent = getSpeedLabel(speed);
                textSpeedVal = speed;
                
                // Map qualitative text speed: 1 = Muito Lento (150ms), 2 = Lento (80ms), 3 = Normal (40ms), 4 = Rápido (15ms)
                if (speed === 1) {
                    typeSpeedBase = 150;
                    textAnimDuration = '2.0s';
                } else if (speed === 2) {
                    typeSpeedBase = 80;
                    textAnimDuration = '1.0s';
                } else if (speed === 3) {
                    typeSpeedBase = 40;
                    textAnimDuration = '0.5s';
                } else {
                    typeSpeedBase = 15;
                    textAnimDuration = '0.2s';
                }
                
                document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
                if (!window.isPreview) localStorage.setItem('if_builder_settings_text_speed', speed.toString());
            });
        }

        const sqImageSpeed = document.getElementById('start-square-image-speed');
        const sqImageSpeedVal = document.getElementById('start-square-image-speed-val');
        if (sqImageSpeed) {
            sqImageSpeed.addEventListener('input', (e) => {
                const target = e.target;
                const speed = parseInt(target['value']);
                if (sqImageSpeedVal) sqImageSpeedVal.textContent = getSpeedLabel(speed);
                if (!window.isPreview) localStorage.setItem('if_builder_settings_image_speed', speed.toString());
                
                // Map qualitative image transition speed: 1 = Muito Lento (2.0s), 2 = Lento (1.0s), 3 = Normal (0.5s), 4 = Rápido (0.2s)
                let imageDuration = '0.5s';
                if (speed === 1) imageDuration = '2.0s';
                else if (speed === 2) imageDuration = '1.0s';
                else if (speed === 3) imageDuration = '0.5s';
                else if (speed === 4) imageDuration = '0.2s';
                
                document.documentElement.style.setProperty('--image-anim-speed', imageDuration);
            });
        }



        const volumeSlider = document.getElementById('settings-volume-slider');
        if (volumeSlider) {
            const savedVol = window.isPreview ? null : localStorage.getItem('if_builder_settings_volume');
            if (savedVol !== null) {
                volumeSlider.value = savedVol;
                if (bgm) bgm.volume = parseFloat(savedVol) / 100;
                if (sfx) sfx.volume = parseFloat(savedVol) / 100;
            } else {
                if (bgm) volumeSlider.value = (bgm.volume * 100).toString();
            }

            volumeSlider.addEventListener('input', (e) => {
                const target = e.target;
                const volVal = parseFloat(target.value);
                if (bgm) bgm.volume = volVal / 100;
                if (sfx) sfx.volume = volVal / 100;
                localStorage.setItem('if_builder_settings_volume', volVal.toString());
            });
        }

        const speedSlider = document.getElementById('settings-speed-slider');
        if (speedSlider) {
            speedSlider.setAttribute('min', '1');
            speedSlider.setAttribute('max', '4');
            speedSlider.setAttribute('step', '1');

            const savedSpeed = window.isPreview ? null : localStorage.getItem('if_builder_settings_text_speed');
            if (savedSpeed !== null) {
                speedSlider.value = savedSpeed;
                textSpeedVal = parseInt(savedSpeed);
                if (textSpeedVal === 1) {
                    typeSpeedBase = 150;
                    textAnimDuration = '2.0s';
                } else if (textSpeedVal === 2) {
                    typeSpeedBase = 80;
                    textAnimDuration = '1.0s';
                } else if (textSpeedVal === 3) {
                    typeSpeedBase = 40;
                    textAnimDuration = '0.5s';
                } else {
                    typeSpeedBase = 15;
                    textAnimDuration = '0.2s';
                }
                document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
            } else {
                speedSlider.value = textSpeedVal.toString();
            }

            speedSlider.addEventListener('input', (e) => {
                const target = e.target;
                const speed = parseInt(target.value);
                textSpeedVal = speed;
                if (speed === 1) {
                    typeSpeedBase = 150;
                    textAnimDuration = '2.0s';
                } else if (speed === 2) {
                    typeSpeedBase = 80;
                    textAnimDuration = '1.0s';
                } else if (speed === 3) {
                    typeSpeedBase = 40;
                    textAnimDuration = '0.5s';
                } else {
                    typeSpeedBase = 15;
                    textAnimDuration = '0.2s';
                }
                document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
                if (!window.isPreview) localStorage.setItem('if_builder_settings_text_speed', speed.toString());
            });
        }

        // ESC Key listener
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const startScreen = document.getElementById('start-screen');
                const isTransitioning = startScreen && (
                    startScreen.classList.contains('menu-trans-fade-in') ||
                    startScreen.classList.contains('menu-trans-fade-out') ||
                    startScreen.classList.contains('menu-trans-slide-in') ||
                    startScreen.classList.contains('menu-trans-slide-out')
                );
                if (isTransitioning) return;
                // If any modal is visible, close it instead of showing start screen
                let modalClosed = false;
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                        modalClosed = true;
                    }
                });
                if (modalClosed) return;

                if (gameData.enableSystemMenu && !window.isSceneTest) {
                    const startScreen = document.getElementById('start-screen');
                    if (startScreen.classList.contains('hidden')) {
                        if (isGameSessionActive) {
                            showStartScreen();
                        }
                    } else {
                        if (isGameSessionActive) {
                            hideStartScreen(() => {
                                gameContainer.classList.remove('hidden');
                                if (gearSystemButton) gearSystemButton.classList.add('hidden');
                            });
                        }
                    }
                } else {
                    toggleSystemMenu();
                }
            }
        });

        // Hide main menu button inside modal if Menu Principal is enabled
        if (gameData.enableSystemMenu && btnMainMenu) {
            btnMainMenu.classList.add('hidden');
        }

        // Auto-start game or show Start Screen
        if (gameData.enableSystemMenu && !window.isSceneTest) {
            showStartScreen(true);
        } else {
            startGame();
        }
        endingRestartButtons.forEach(btn => btn.addEventListener('click', () => {
             // Prepare the game behind the ending screen
             startGame();
             gameContainer.classList.remove('hidden');
             gameContainer.classList.remove('fade-out');

             positiveEndingScreen.classList.add('fade-out');
             negativeEndingScreen.classList.add('fade-out');
             setTimeout(() => {
                 positiveEndingScreen.classList.add('hidden'); 
                 negativeEndingScreen.classList.add('hidden');
                 positiveEndingScreen.classList.remove('fade-out');
                 negativeEndingScreen.classList.remove('fade-out');
             }, 1000);
        }));
        if (submitVerb) {
            submitVerb.addEventListener('mousedown', (e) => { e.preventDefault(); });
            submitVerb.addEventListener('click', (e) => {
                e.preventDefault();
                handleInput();
            });
        }
        if (verbInput) {
            verbInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });
        }
        if (suggestionsButton) suggestionsButton.addEventListener('click', () => togglePopup('suggestions'));
        if (inventoryButton) inventoryButton.addEventListener('click', () => togglePopup('inventory'));
        if (diaryButton) diaryButton.addEventListener('click', () => showDiary(false));
        if (notesButton && notesModal) {
            notesButton.addEventListener('click', () => {
                notesModal.classList.remove('hidden');
            });
        }
        if (notesTextarea) {
            notesTextarea.addEventListener('input', () => {
                autoSaveGame();
            });
        }
        if (trackersButton) trackersButton.addEventListener('click', showTrackers);
        if (systemButton) systemButton.addEventListener('click', toggleSystemMenu);
        if (exportPdfButton) {
            if (gameData.diaryAllowExport === false) {
                exportPdfButton.classList.add('hidden');
            } else {
                exportPdfButton.classList.remove('hidden');
            }
            console.log('Botão de exportação encontrado, anexando listener...');
            exportPdfButton.addEventListener('click', exportDiaryToPDF);
        } else {
            console.error('ERRO: Botão de exportação (#export-pdf-button) NÃO encontrado no DOM durante init.');
        }
        closeButtons.forEach(btn => btn.addEventListener('click', (e) => { e.target.closest('.modal-overlay')?.classList.add('hidden'); }));
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
        });
        if (btnSaveMenu) btnSaveMenu.addEventListener('click', () => renderSlots('save'));
        if (btnLoadMenu) btnLoadMenu.addEventListener('click', () => renderSlots('load'));
        if (btnBackSystem) btnBackSystem.addEventListener('click', () => { if (systemSlotsContainer) systemSlotsContainer.classList.add('hidden'); if (systemMenuMain) systemMenuMain.classList.remove('hidden'); if (systemModalTitle) systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema'; });
        
        if (viewEndingButton) {
            viewEndingButton.addEventListener('click', () => {
                 const isWin = isGameEnded === 'win';
                 // For defeat: check if there's a defeat scene/vignette to navigate to
                 if (!isWin) {
                     const defeatSceneId = Object.keys(gameData.cenas).find(id => gameData.cenas[id].isDefeatOutcome);
                     if (defeatSceneId) {
                         // Reset UI back to standard action bar for the defeat vignette
                         if (standardActionBar) standardActionBar.classList.remove('hidden');
                         if (endingActionBar) endingActionBar.classList.add('hidden');
                         isGameEnded = false;
                         loadScene(defeatSceneId, true);
                         return;
                     }
                 }
                 const endScreen = isWin ? positiveEndingScreen : negativeEndingScreen;
                 const endMusic = isWin ? gameData.positiveEndingMusic : gameData.negativeEndingMusic;
                 if (endMusic) playBgm(endMusic); else playBgm("");
                 if (endScreen) {
                     endScreen.style.zIndex = '0';
                     endScreen.classList.remove('hidden');
                 }
                 if (gameContainer) {
                     gameContainer.classList.add('fade-out');
                     setTimeout(() => {
                        gameContainer.classList.add('hidden');
                        if (endScreen) endScreen.style.zIndex = ''; 
                     }, 1000);
                 }
            });
        }
        
        if (btnMainMenu) {
            btnMainMenu.onclick = (e) => {
                if (systemModal) systemModal.classList.add('hidden');
                isGameEnded = false; 
                startGame();
            };
        }
        if (window.isSceneTest) startGame();
    };

    const exportDiaryToPDF = () => {
        console.log('Iniciando exportação de PDF...');
        
        const runExport = () => {
            if (typeof html2pdf === 'undefined') {
                console.error('Biblioteca html2pdf não encontrada.');
                alert("Erro: Biblioteca de PDF não carregada.");
                return;
            }

            const originalText = exportPdfButton.textContent;
            exportPdfButton.textContent = 'Gerando...';
            exportPdfButton.disabled = true;

            const opt = {
                margin:       [0, 0],
                filename:     (gameData.gameTitle || 'Diario') + '_Log.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    allowTaint: true,
                    letterRendering: true
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Criar um container temporário no DOM para garantir que o html2canvas funcione
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-10000px';
            container.style.top = '0';
            container.style.width = '1800px'; 
            container.style.backgroundColor = '#ffffff';
            document.body.appendChild(container);

            const element = diaryLog.cloneNode(true);
            element.style.height = 'auto';
            element.style.maxHeight = 'none';
            element.style.overflow = 'visible';
            element.style.maskImage = 'none';
            element.style.webkitMaskImage = 'none';
            element.style.padding = '20px'; 
            element.style.backgroundColor = '#ffffff';
            element.style.color = '#333333';
            element.style.display = 'block';
            element.style.width = '100%';
            
            const allElements = element.querySelectorAll('*');
            allElements.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.backgroundImage = 'none';
                    el.style.backgroundColor = 'transparent';
                    el.style.color = '#333333';
                    el.style.borderColor = '#eeeeee';
                    el.style.boxShadow = 'none';
                    el.style.textShadow = 'none';
                    el.style.fontSize = '8pt';
                    el.style.lineHeight = '1.4';
                    el.style.margin = '0';
                }
            });

            element.querySelectorAll('.diary-entry').forEach(entry => {
                entry.style.display = 'flex';
                entry.style.gap = '20px';
                entry.style.marginBottom = '20px';
                entry.style.paddingBottom = '15px';
                entry.style.borderBottom = '1px solid #eeeeee';
                entry.style.alignItems = 'flex-start';
                entry.style.width = '100%';
                entry.style.boxSizing = 'border-box';
            });

            element.querySelectorAll('img').forEach(img => {
                img.style.width = '30%';
                img.style.height = 'auto';
                img.style.borderRadius = '2px';
                img.style.display = 'block';
                img.style.flexShrink = '0';
            });

            element.querySelectorAll('.text-container').forEach(text => {
                text.style.flex = '1';
                text.style.width = '65%';
            });

            element.querySelectorAll('.scene-name').forEach(name => {
                name.style.fontSize = '10pt';
                name.style.fontWeight = 'bold';
                name.style.color = '#000000';
                name.style.display = 'block';
                name.style.marginBottom = '12px';
            });

            container.appendChild(element);

            html2pdf().set(opt).from(element).save().then(() => {
                console.log('PDF gerado com sucesso.');
                document.body.removeChild(container);
                exportPdfButton.textContent = originalText;
                exportPdfButton.disabled = false;
            }).catch(err => {
                console.error('Erro crítico na geração do PDF:', err);
                document.body.removeChild(container);
                alert("Erro ao gerar PDF: " + (err.message || "Verifique o console para detalhes técnicos."));
                exportPdfButton.textContent = originalText;
                exportPdfButton.disabled = false;
            });
        };

        runExport();
    };

    const startGame = () => {
        removeGameSave('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'));
        currentSceneId = gameData.cena_inicial; 
        if ((!currentSceneId || !gameData.cenas[currentSceneId]) && gameData.cenas && Object.keys(gameData.cenas).length > 0) {
            currentSceneId = Object.keys(gameData.cenas)[0];
        }
        inventory = []; 
        visitedScenes = []; 
        actionLog = []; 
        chances = gameData.gameMaxChances || 3; 
        trackers = {}; 
        removedObjectsFromScenes = {};
        if (notesTextarea) {
            notesTextarea.value = '';
        }
        isGameEnded = false;
        isGameSessionActive = true;
        gameStartTime = Date.now();
        gameEndTime = null;

        if (bgmAudio) {
            try {
                bgmAudio.pause();
                bgmAudio.currentTime = 0;
            } catch (_) {}
        }
        currentBgmSrc = null;

        // Hide retrospective button on restart
        if (vignetteDiaryButton) vignetteDiaryButton.classList.add('hidden');
        (gameData.consequenceTrackers || []).forEach(t => { trackers[t.id] = t.initialValue; });
        
        // Fix Audio Persistence: If the starting scene has no specific music.
        // If it is a SCENE TEST, we do NOT fallback to global music (keep it silent/clean).
        const startScene = gameData.cenas[currentSceneId];
        const isStartVignette = startScene && startScene.vignetteType && startScene.vignetteType !== 'none';
        if (startScene) {
            if (startScene.backgroundMusic) {
                playBgm(startScene.backgroundMusic);
            } else if (!window.isSceneTest && (!startScene.vignetteType || startScene.vignetteType === 'none')) {
                playBgm(gameData.gameBackgroundMusic || "");
            } else {
                playBgm(""); 
            }
            loadScene(currentSceneId, false);
        } else {
             console.error("Start scene not found:", currentSceneId);
        }

        if (standardActionBar) standardActionBar.classList.remove('hidden');
        if (endingActionBar) endingActionBar.classList.add('hidden');
        
        if (gameContainer && !isStartVignette) {
            gameContainer.classList.remove('hidden');
            gameContainer.classList.add('ready');
        }
    };

    const loadGameFromData = (jsonString) => {
        try {
            const save = JSON.parse(jsonString);
            if (save) {
                currentSceneId = save.currentSceneId; 
                inventory = save.inventory; 
                visitedScenes = save.visitedScenes || []; 
                actionLog = save.actionLog || []; 
                chances = save.chances; 
                trackers = save.trackers || {}; 
                removedObjectsFromScenes = save.removedObjectsFromScenes || {};
                if (notesTextarea) {
                    notesTextarea.value = save.notes || '';
                }
                isGameEnded = false;
                isGameSessionActive = true;
                standardActionBar.classList.remove('hidden');
                endingActionBar.classList.add('hidden');
                systemModal.classList.add('hidden');
                loadScene(currentSceneId, false);
                gameContainer.classList.remove('hidden');
                gameContainer.classList.add('ready');
            }
        } catch (e) { startGame(); }
    };

    const getLatestSave = () => {
        const autoKey = 'if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        const manual1Key = 'if_builder_manual_1_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        const manual2Key = 'if_builder_manual_2_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        
        const autoSave = getGameSave(autoKey);
        const m1Save = getGameSave(manual1Key);
        const m2Save = getGameSave(manual2Key);
        
        let latestSave = null;
        let latestTime = 0;
        
        [autoSave, m1Save, m2Save].forEach(saveStr => {
            if (saveStr) {
                try {
                    const data = JSON.parse(saveStr);
                    const time = Date.parse(data.timestamp) || 0;
                    if (time > latestTime) {
                        latestTime = time;
                        latestSave = saveStr;
                    }
                } catch (e) {}
            }
        });
        return latestSave;
    };

    const showStartScreen = (skipTransition = false) => {
        const startScreen = document.getElementById('start-screen');
        const startTitle = document.getElementById('start-screen-title');
        const newGameBtn = document.getElementById('start-new-game-btn');
        const continueBtn = document.getElementById('start-continue-btn');
        const savesBtn = document.getElementById('start-saves-btn');
        const gearBtn = document.getElementById('gear-system-button');

        if (!startScreen) {
            startGame();
            return;
        }

        if (!skipTransition) {
            const isTransitioning = startScreen.classList.contains('menu-trans-fade-in') ||
                                    startScreen.classList.contains('menu-trans-fade-out') ||
                                    startScreen.classList.contains('menu-trans-slide-in') ||
                                    startScreen.classList.contains('menu-trans-slide-out');
            if (isTransitioning) return;
        }

        // Reset containers back to root start screen
        const startScreenButtons = startScreen.querySelector('.start-screen-buttons');
        const startScreenSavesContainer = document.getElementById('start-screen-saves-container');
        const startScreenOptionsContainer = document.getElementById('start-screen-options-container');

        if (startScreenButtons) startScreenButtons.classList.remove('hidden');
        if (startScreenSavesContainer) startScreenSavesContainer.classList.add('hidden');
        if (startScreenOptionsContainer) startScreenOptionsContainer.classList.add('hidden');

        // Main Menu transitions speed - Unified
        const menuTransition = gameData.gameMenuTransitionType || 'fade';
        let speed = gameData.gameMenuTransitionSpeed !== undefined ? Number(gameData.gameMenuTransitionSpeed) : 500;
        if (speed > 10) {
            speed = speed / 1000;
        }
        if (speed > 5.0) speed = 0.5;
        document.documentElement.style.setProperty('--menu-anim-speed', speed + 's');

        startScreen.classList.remove('menu-trans-fade-in', 'menu-trans-fade-out', 'menu-trans-slide-in', 'menu-trans-slide-out');

        // Show start screen
        startScreen.classList.remove('hidden');

        if (skipTransition) {
            // No transitions on first load or instant resets
        } else {
            // Force reflow to ensure CSS animations play correctly
            void startScreen.offsetWidth;
            
            if (menuTransition === 'none') {
                // No anim
            } else if (menuTransition === 'fade') {
                startScreen.classList.add('menu-trans-fade-in');
                setTimeout(() => {
                    startScreen.classList.remove('menu-trans-fade-in');
                }, speed * 1000 + 100);
            } else if (menuTransition === 'slide') {
                startScreen.classList.add('menu-trans-slide-in');
                setTimeout(() => {
                    startScreen.classList.remove('menu-trans-slide-in');
                }, speed * 1000 + 100);
            }
            if (gameData.gameMenuTransitionSound) {
                playSound(gameData.gameMenuTransitionSound);
            }
        }

        // Render custom title if configured
        if (startTitle) {
            if (gameData.showStartScreenTitle !== false) {
                startTitle.textContent = gameData.startScreenTitle || gameData.gameTitle || 'Minha Aventura de Texto';
                startTitle.classList.remove('hidden');
            } else {
                startTitle.classList.add('hidden');
            }
        }

        // Handle buttons visibility and texts
        if (isGameSessionActive) {
            if (newGameBtn) newGameBtn.textContent = gameData.gameRestartButtonText || 'Começar de novo';
        } else {
            if (newGameBtn) newGameBtn.textContent = 'Começar';
        }

        // Check if there are any saves OR active session to show the "Continuar" button
        const latestSave = getLatestSave();
        if ((latestSave || isGameSessionActive) && continueBtn) {
            continueBtn.classList.remove('hidden');
        } else if (continueBtn) {
            continueBtn.classList.add('hidden');
        }

        // Check autosave presence to show/hide "Caminhos salvos" button
        const autoKey = 'if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        const autoData = getGameSave(autoKey);
        if (savesBtn) {
            if (autoData) {
                savesBtn.classList.remove('hidden');
            } else {
                savesBtn.classList.add('hidden');
            }
        }

        // Hide gear button when we are on the Menu Principal itself
        if (gearBtn) gearBtn.classList.add('hidden');
    };

    const hideStartScreen = (callback) => {
        const startScreen = document.getElementById('start-screen');
        if (!startScreen) {
            if (callback) callback();
            return;
        }

        const isTransitioning = startScreen.classList.contains('menu-trans-fade-in') ||
                                startScreen.classList.contains('menu-trans-fade-out') ||
                                startScreen.classList.contains('menu-trans-slide-in') ||
                                startScreen.classList.contains('menu-trans-slide-out');
        if (isTransitioning) return;

        if (gameData.gameMenuTransitionSound) {
            playSound(gameData.gameMenuTransitionSound);
        }

        const transition = gameData.gameMenuTransitionType || 'fade';
        let speed = gameData.gameMenuTransitionSpeed !== undefined ? Number(gameData.gameMenuTransitionSpeed) : 500;
        if (speed > 10) {
            speed = speed / 1000;
        }
        if (speed > 5.0) speed = 0.5;
        document.documentElement.style.setProperty('--menu-anim-speed', speed + 's');

        if (transition === 'none') {
            startScreen.classList.add('hidden');
            startScreen.classList.remove('menu-trans-fade-in', 'menu-trans-fade-out', 'menu-trans-slide-in', 'menu-trans-slide-out');
            if (callback) callback();
        } else {
            startScreen.classList.remove('menu-trans-fade-in', 'menu-trans-fade-out', 'menu-trans-slide-in', 'menu-trans-slide-out');
            
            // Force reflow
            void startScreen.offsetWidth;
            
            if (transition === 'fade') {
                startScreen.classList.add('menu-trans-fade-out');
            } else if (transition === 'slide') {
                startScreen.classList.add('menu-trans-slide-out');
            }

            setTimeout(() => {
                startScreen.classList.add('hidden');
                startScreen.classList.remove('menu-trans-fade-in', 'menu-trans-fade-out', 'menu-trans-slide-in', 'menu-trans-slide-out');
                if (callback) callback();
            }, speed * 1000 + 100);
        }
    };

    const autoSaveGame = () => {
        if (isGameEnded) return;
        const save = { currentSceneId, inventory, visitedScenes, actionLog, chances, trackers, removedObjectsFromScenes, notes: notesTextarea ? notesTextarea.value : '', timestamp: new Date().toLocaleString() };
        setGameSave('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'), JSON.stringify(save));
    };

    const renderSlots = (mode) => {
        systemMenuMain.classList.add('hidden'); systemSlotsContainer.classList.remove('hidden'); slotsList.innerHTML = '';
        systemModalTitle.textContent = gameData.enableSystemMenu ? 'Caminhos salvos' : (mode === 'save' ? (gameData.gameSaveMenuTitle || 'Salvar Jogo') : (gameData.gameLoadMenuTitle || 'Carregar Jogo'));

        if (gameData.enableSystemMenu) {
            // Render 1 Autosave + 2 Manual Saves
            // --- 1. AUTOSAVE SLOT ---
            const autoKey = 'if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
            const autoData = getGameSave(autoKey);
            const autoDiv = document.createElement('div'); autoDiv.className = 'slot-item';
            let autoHtml = '';
            if (autoData) {
                try {
                    const data = JSON.parse(autoData);
                    const sceneName = gameData.cenas[data.currentSceneId]?.name || 'Desconhecido';
                    autoHtml = '<div class="slot-info"><span class="slot-title">Caminho salvo automaticamente - ' + sceneName + '</span><span class="slot-meta">' + data.timestamp + '</span></div>';
                } catch (e) {
                    autoHtml = '<div class="slot-info"><span class="slot-title">Caminho salvo automaticamente</span><span class="slot-empty">Erro ao ler dados</span></div>';
                }
            } else {
                autoHtml = '<div class="slot-info"><span class="slot-title">Caminho salvo automaticamente</span><span class="slot-empty">Sem dados</span></div>';
            }
            autoDiv.innerHTML = window.safeHTML(autoHtml);
            if (autoData) {
                autoDiv.addEventListener('click', () => {
                    loadGameFromData(autoData);
                });
            }
            slotsList.appendChild(autoDiv);

            // --- 2. MANUAL SAVES (Slots 1 & 2) ---
            for (let i = 1; i <= 2; i++) {
                const slotKey = 'if_builder_manual_' + i + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
                const savedData = getGameSave(slotKey);
                const slotDiv = document.createElement('div'); slotDiv.className = 'slot-item';
                let contentHtml = '';
                if (savedData) {
                    try {
                        const data = JSON.parse(savedData);
                        const sceneName = gameData.cenas[data.currentSceneId]?.name || 'Desconhecido';
                        contentHtml = '<div class="slot-info"><span class="slot-title">Caminho salvo ' + i + ' - ' + sceneName + '</span><span class="slot-meta">' + data.timestamp + '</span></div>';
                        contentHtml += '<button class="slot-delete-btn" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>';
                    } catch (e) {
                        contentHtml = '<div class="slot-info"><span class="slot-title">Caminho salvo ' + i + '</span><span class="slot-empty">Erro ao ler dados</span></div>';
                    }
                } else {
                    if (mode === 'save') {
                        contentHtml = '<div class="slot-info" style="text-align: center; width: 100%;"><span class="slot-title" style="font-weight: normal; color: rgba(255,255,255,0.75); cursor: pointer;">Clique para salvar</span></div>';
                    } else {
                        contentHtml = '<div class="slot-info" style="text-align: center; width: 100%;"><span class="slot-title" style="font-weight: normal; color: rgba(255,255,255,0.3);">Slot vazio</span></div>';
                    }
                }
                slotDiv.innerHTML = window.safeHTML(contentHtml);
                
                // Add button listeners
                const deleteBtn = slotDiv.querySelector('.slot-delete-btn');
                
                slotDiv.addEventListener('click', (e) => {
                    const deleteBtnClicked = e.target.closest('.slot-delete-btn');
                    if (deleteBtnClicked) {
                        return;
                    }
                    if (mode === 'save') {
                        if (!savedData) {
                            performSave(i);
                        }
                    } else if (savedData) {
                        loadGameFromData(savedData);
                    }
                });

                if (deleteBtn && savedData) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeGameSave(slotKey);
                        renderSlots(mode);
                    });
                }
                slotsList.appendChild(slotDiv);
            }
        } else {
            // Legacy / Standard behavior
            for (let i = 1; i <= 3; i++) {
                const slotKey = 'if_builder_slot_' + i + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
                const savedData = getGameSave(slotKey);
                const slotDiv = document.createElement('div'); slotDiv.className = 'slot-item';
                let contentHtml = '';
                if (savedData) {
                    const data = JSON.parse(savedData); const sceneName = gameData.cenas[data.currentSceneId]?.name || 'Desconhecido';
                    contentHtml = '<div class="slot-info"><span class="slot-title">Slot ' + i + ' - ' + sceneName + '</span><span class="slot-meta">' + data.timestamp + '</span></div>';
                    contentHtml += '<button class="slot-delete-btn" data-slot="' + i + '" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>';
                } else {
                    contentHtml = '<div class="slot-info"><span class="slot-title">Slot ' + i + '</span><span class="slot-empty">Vazio</span></div>';
                }
                slotDiv.innerHTML = window.safeHTML(contentHtml);
                slotDiv.addEventListener('click', (e) => { 
                    const deleteBtn = e.target.closest('.slot-delete-btn');
                    if (deleteBtn) {
                        e.stopPropagation();
                        const slot = deleteBtn.getAttribute('data-slot');
                        removeGameSave('if_builder_slot_' + slot + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'));
                        renderSlots(mode);
                        return;
                    } 
                    if (mode === 'save') {
                        if (!savedData) {
                            performSave(i);
                        }
                    } 
                    else if (mode === 'load' && savedData) loadGameFromData(savedData); 
                });
                slotsList.appendChild(slotDiv);
            }
        }
    };

    const performSave = (slotIndex) => {
        const slotKey = gameData.enableSystemMenu
            ? 'if_builder_manual_' + slotIndex + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas')
            : 'if_builder_slot_' + slotIndex + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        const save = { currentSceneId, inventory, visitedScenes, actionLog, chances, trackers, removedObjectsFromScenes, notes: notesTextarea ? notesTextarea.value : '', timestamp: new Date().toLocaleString() };
        setGameSave(slotKey, JSON.stringify(save)); renderSlots('save');
    };

    const renderStartScreenSlots = () => {
        const slotsList = document.getElementById('start-screen-slots-list');
        if (!slotsList) return;
        slotsList.innerHTML = '';

        const alignment = gameData.startScreenButtonAlignment || 'center';

        // Render 1 Autosave + 2 Manual Saves
        // --- 1. AUTOSAVE SLOT ---
        const autoKey = 'if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        const autoData = getGameSave(autoKey);
        const autoDiv = document.createElement('div');
        autoDiv.className = 'slot-item';
        
        let autoHtml = '';
        if (autoData) {
            try {
                const data = JSON.parse(autoData);
                const sceneName = gameData.cenas[data.currentSceneId]?.name || 'Desconhecido';
                const textAlignment = alignment === 'right' ? 'right' : (alignment === 'center' ? 'center' : 'left');
                autoHtml = '<div class="slot-info" style="text-align: ' + textAlignment + '; width: 100%;"><span class="slot-title">Progresso automático - ' + sceneName + '</span><span class="slot-meta">' + data.timestamp + '</span></div>';
            } catch (e) {
                autoHtml = '<div class="slot-info"><span class="slot-title">Progresso automático</span><span class="slot-empty">Erro ao ler dados</span></div>';
            }
        } else {
            autoHtml = '<div class="slot-info" style="text-align: center; width: 100%;"><span class="slot-title">Progresso automático</span><span class="slot-empty">Nenhum progresso automático disponível</span></div>';
        }
        
        autoDiv.innerHTML = window.safeHTML(autoHtml);
        if (autoData) {
            autoDiv.addEventListener('click', () => {
                loadGameFromData(autoData);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        hideStartScreen(() => {
                            if (gearSystemButton) {
                                gearSystemButton.classList.add('hidden');
                            }
                        });
                    });
                });
            });
        }
        slotsList.appendChild(autoDiv);

        // --- 2. MANUAL SAVES (Slots 1 & 2) ---
        for (let i = 1; i <= 2; i++) {
            const slotKey = 'if_builder_manual_' + i + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
            const savedData = getGameSave(slotKey);
            const slotDiv = document.createElement('div');
            
            const deleteBtnHtml = '<button class="slot-delete-btn" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>';
            let contentHtml = '';
            
            if (savedData) {
                slotDiv.className = 'slot-item';
                try {
                    const data = JSON.parse(savedData);
                    const sceneName = gameData.cenas[data.currentSceneId]?.name || 'Desconhecido';
                    const textAlignment = alignment === 'right' ? 'right' : (alignment === 'center' ? 'center' : 'left');
                    contentHtml = deleteBtnHtml + '<div class="slot-info" style="text-align: ' + textAlignment + '; padding-left: 58px; padding-right: 24px; width: 100%;"><span class="slot-title">Caminho salvo ' + i + ' - ' + sceneName + '</span><span class="slot-meta">' + data.timestamp + '</span></div>';
                } catch (e) {
                    contentHtml = '<div class="slot-info" style="padding-left: 58px; padding-right: 24px;"><span class="slot-title">Caminho salvo ' + i + '</span><span class="slot-empty">Erro ao ler dados</span></div>';
                }
            } else {
                const disabledClass = isGameSessionActive ? '' : ' disabled';
                slotDiv.className = 'slot-item dashed-slot' + disabledClass;
                
                if (isGameSessionActive) {
                    contentHtml = '<div class="slot-info" style="text-align: center; width: 100%;"><span class="slot-title" style="font-weight: normal; color: rgba(255,255,255,0.75);">Clique para salvar</span></div>';
                } else {
                    contentHtml = '<div class="slot-info" style="text-align: center; width: 100%;"><span class="slot-title" style="font-weight: normal; color: rgba(255,255,255,0.3);">Slot vazio</span></div>';
                }
            }
            
            slotDiv.innerHTML = window.safeHTML(contentHtml);
            
            const deleteBtn = slotDiv.querySelector('.slot-delete-btn');

            if (deleteBtn && savedData) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeGameSave(slotKey);
                    renderStartScreenSlots();
                });
            }
            
            slotDiv.addEventListener('click', () => {
                if (!savedData && isGameSessionActive) {
                    performStartScreenSave(i);
                } else if (savedData) {
                    loadGameFromData(savedData);
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            hideStartScreen(() => {
                                if (gearSystemButton) {
                                    gearSystemButton.classList.add('hidden');
                                }
                            });
                        });
                    });
                }
            });

            slotsList.appendChild(slotDiv);
        }
    };

    const performStartScreenSave = (slotIndex) => {
        const slotKey = 'if_builder_manual_' + slotIndex + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
        const save = { currentSceneId, inventory, visitedScenes, actionLog, chances, trackers, removedObjectsFromScenes, notes: notesTextarea ? notesTextarea.value : '', timestamp: new Date().toLocaleString() };
        setGameSave(slotKey, JSON.stringify(save));
        renderStartScreenSlots();
    };

    const getObjectsForScene = (sceneId) => {
        const scene = gameData.cenas[sceneId]; 
        if (!scene) return [];
        let objects = (scene.objectIds || []).map(id => gameData.globalObjects[id]).filter(Boolean).map(o => JSON.parse(JSON.stringify(o)));
        const removedIds = removedObjectsFromScenes[sceneId] || [];
        objects = objects.filter(o => !removedIds.includes(o.id));
        return objects;
    };
    
    const flagObjectAsRemoved = (sceneId, objectId) => {
        if (!removedObjectsFromScenes[sceneId]) removedObjectsFromScenes[sceneId] = [];
        if (!removedObjectsFromScenes[sceneId].includes(objectId)) {
            removedObjectsFromScenes[sceneId].push(objectId);
        }
    };

    const updateTrackers = (effects) => {
        if (!effects) return;
        effects.forEach(effect => { if (Object.prototype.hasOwnProperty.call(trackers, effect.trackerId)) trackers[effect.trackerId] += effect.valueChange; });
        checkTrackers();
    };

    const checkTrackers = () => {
        const definitions = gameData.consequenceTrackers || [];
        for (const def of definitions) { if (trackers[def.id] >= def.maxValue && def.consequenceSceneId) { setTimeout(() => { loadScene(def.consequenceSceneId, true, 'fade'); }, 500); return; } }
    };

    const showVignetteScreen = (scene) => {
        // Hide retrospective button by default, only show for conclusions
        if (vignetteDiaryButton) vignetteDiaryButton.classList.add('hidden');

        // If it's a conclusion vignette, set the end state flags manually
        // We avoid calling activateEndingUI here because that would swap action bars 
        // in the game container, causing buttons to "pop in" during the cross-fade.
        if (scene.vignetteType === 'conclusion') {
             isGameEnded = 'win';
             gameEndTime = Date.now();
             
             // Show the diary button on the vignette screen if enabled
             if (vignetteDiaryButton && gameData.enableRetrospective !== false) {
                 vignetteDiaryButton.classList.remove('hidden');
             }
        }
        
        // Vertical Alignment
        vignetteScreen.classList.remove('align-v-center', 'align-v-bottom');
        if (gameData.gameSplashContentVerticalAlignment === 'center') {
            vignetteScreen.classList.add('align-v-center');
        } else {
            vignetteScreen.classList.add('align-v-bottom');
        }
        
        // Set vignette content
        if (vignetteTitle) {
            vignetteTitle.textContent = scene.name || '';
            vignetteTitle.classList.toggle('hidden', !!scene.omitSplashTitle);
        }
        if (vignetteDescription) {
            vignetteDescription.textContent = scene.description || '';
            vignetteDescription.classList.toggle('hidden', !!scene.omitSplashDescription);
        }
        
        // Set button text
        const buttonText = scene.vignetteButtonText || (scene.vignetteType === 'conclusion' ? (gameData.gameRestartButtonText || 'Restart') : (gameData.gameContinueButtonText || 'Continue'));
        if (vignetteContinueButton) vignetteContinueButton.textContent = buttonText;
        
        // Set background image
        if (scene.image) {
            vignetteScreen.style.backgroundImage = 'url(' + scene.image + ')';
        } else {
            vignetteScreen.style.backgroundImage = 'none';
        }

        // Overlay Effect for Vignette
        const vOverlay = document.getElementById('vignette-overlay');
        if (vOverlay) {
            vOverlay.className = 'scene-overlay'; 
            if (scene.overlayEffect) {
                vOverlay.classList.add('overlay-' + scene.overlayEffect);
            }

        }
        
        // Play background music for this vignette scene
        if (scene.backgroundMusic) {
            playBgm(scene.backgroundMusic);
        }
        
        // Handle button click
        const handleVignetteClick = () => {
            if (typeof rainEffect !== 'undefined') rainEffect.stop();
            
            if (scene.vignetteType === 'conclusion') {
                // Restart game
                playBgm(gameData.gameBackgroundMusic || "");
                startGame();
                
                // CRITICAL FIX: If the game starts with a vignette (opening), 
                // we must NOT fade out the vignette screen, or it will be skipped.
                const nextScene = findScene(currentSceneId);
                const isNextVignette = nextScene && nextScene.vignetteType && nextScene.vignetteType !== 'none';
                
                if (!isNextVignette) {
                    // Only reveal game container if we are transitioning to a narrative scene
                    gameContainer.classList.remove('hidden');
                    gameContainer.classList.remove('fade-out');

                    vignetteScreen.classList.add('fade-out');
                    setTimeout(() => {
                        vignetteScreen.classList.add('hidden');
                        vignetteScreen.classList.remove('fade-out');
                    }, 1000);
                }
                return;

            } else if (scene.vignetteNextSceneId) {
                const nextSceneId = scene.vignetteNextSceneId;
                const nextScene = findScene(nextSceneId);
                
                if (nextScene) {
                    const isNextVignette = nextScene.vignetteType && nextScene.vignetteType !== 'none';
                    
                    if (isNextVignette) {
                        // Vignette to Vignette: Just load the next one instantly
                        // The showVignetteScreen call inside loadScene will update the content
                        loadScene(nextSceneId, false);
                    } else {
                        // Vignette to Narrative: Load narrative behind, then fade out vignette
                        loadScene(nextSceneId, false);
                        gameContainer.classList.remove('hidden');
                        gameContainer.classList.remove('fade-out');
                        
                        vignetteScreen.classList.add('fade-out');
                        setTimeout(() => {
                            vignetteScreen.classList.add('hidden');
                            vignetteScreen.classList.remove('fade-out');
                        }, 1000);
                    }
                } else {
                    console.warn('Vignette target scene not found:', nextSceneId);
                    vignetteScreen.classList.add('fade-out');
                    setTimeout(() => {
                        vignetteScreen.classList.add('hidden');
                        vignetteScreen.classList.remove('fade-out');
                        gameContainer.classList.remove('hidden');
                        gameContainer.classList.remove('fade-out');
                    }, 1000);
                }
            } else {
                // No next scene defined: Fade out vignette to show current game container
                gameContainer.classList.remove('hidden');
                gameContainer.classList.remove('fade-out');
                vignetteScreen.classList.add('fade-out');
                setTimeout(() => {
                    vignetteScreen.classList.add('hidden');
                    vignetteScreen.classList.remove('fade-out');
                }, 1000);
            }
        };
        
        vignetteContinueButton.onclick = handleVignetteClick;

        // Credits rendering for conclusion vignettes
        const existingCredits = vignetteScreen.querySelector('.vignette-credits');
        if (existingCredits) existingCredits.remove();

        if (scene.creditsText && scene.creditsText.trim()) {
            const creditsDiv = document.createElement('div');
            creditsDiv.className = 'vignette-credits';
            if (scene.creditsScrollEnabled) {
                creditsDiv.classList.add('credits-scroll');
            }

            // Determine which side the content is on to put credits on the opposite
            // Content defaults to right (flex-end), but align-left class moves it to left
            const isContentLeft = vignetteScreen.classList.contains('align-left');
            if (isContentLeft) {
                creditsDiv.classList.add('credits-right');
            } else {
                creditsDiv.classList.add('credits-left');
            }

            const creditsInner = document.createElement('div');
            creditsInner.className = 'vignette-credits-text';
            creditsInner.textContent = scene.creditsText;
            creditsDiv.appendChild(creditsInner);
            vignetteScreen.appendChild(creditsDiv);
        }
        
        // Show the vignette screen FIRST, then start rain effect after it's visible
        vignetteScreen.classList.remove('hidden');
        
        // Rain Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'rain') {
            requestAnimationFrame(() => {
                if (typeof rainEffect !== 'undefined') rainEffect.start('vignette-overlay');
            });
        } else {
            if (typeof rainEffect !== 'undefined') rainEffect.stop();
        }

        // Blur Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'blur') {
            requestAnimationFrame(() => {
                const overlayEl = document.getElementById('vignette-overlay');
                if (overlayEl) {
                    // Clear any existing blur container first
                    const existing = overlayEl.querySelector('.blur-overlay-container');
                    if (existing) existing.remove();
                    
                    const blurContainer = document.createElement('div');
                    blurContainer.className = 'blur-overlay-container';
                    blurContainer.innerHTML = '<div class="blur-rumble-layer"></div><div class="blur-flicker-layer"></div><div class="blur-grain-layer"></div><div class="blur-vignette-layer"></div>';
                    overlayEl.appendChild(blurContainer);
                }
            });
        } else {
            if (vOverlay) {
                const existing = vOverlay.querySelector('.blur-overlay-container');
                if (existing) existing.remove();
            }
        }

        // Chromatic Aberration Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'chromatic') {
            requestAnimationFrame(() => {
                const overlayEl = document.getElementById('vignette-overlay');
                if (overlayEl) {
                    // Clear any existing chromatic container first
                    const existing = overlayEl.querySelector('.chromatic-overlay-container');
                    if (existing) existing.remove();
                    
                    const chromaticContainer = document.createElement('div');
                    chromaticContainer.className = 'chromatic-overlay-container';
                    chromaticContainer.innerHTML = '<div class="chromatic-jerk-wrapper"><div class="chromatic-layer chromatic-red"></div><div class="chromatic-layer chromatic-green"></div><div class="chromatic-layer chromatic-blue"></div><div class="chromatic-flicker"></div></div><div class="chromatic-scanlines"></div>';
                    overlayEl.appendChild(chromaticContainer);
                }
            });
        } else {
            if (vOverlay) {
                const existing = vOverlay.querySelector('.chromatic-overlay-container');
                if (existing) existing.remove();
            }
        }

        // TV Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'tv') {
            requestAnimationFrame(() => {
                const overlayEl = document.getElementById('vignette-overlay');
                if (overlayEl) {
                    // Use CSS class - filter is applied via ::before pseudo-element to only affect background
                    vignetteScreen.classList.add('tv-active');

                    // Clear any existing TV container first
                    const existing = overlayEl.querySelector('.tv-overlay-container');
                    if (existing) existing.remove();
                    
                    const tvContainer = document.createElement('div');
                    tvContainer.className = 'tv-overlay-container';
                    tvContainer.innerHTML = '<div class="tv-screen-wrapper"><div class="tv-rgb-grid"></div><div class="tv-scanlines"></div><div class="tv-vignette"></div><div class="tv-glow"></div><div class="tv-flicker"></div><div class="tv-interference"></div></div>';
                    overlayEl.appendChild(tvContainer);
                }
            });
        } else {
            // Remove CSS class
            vignetteScreen.classList.remove('tv-active');
            if (vOverlay) {
                vOverlay.parentElement?.classList.remove('tv-distortion-active-lg');
                const existing = vOverlay.querySelector('.tv-overlay-container');
                if (existing) existing.remove();
            }
        }

        // Confetti Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'confetti') {
            requestAnimationFrame(() => {
                if (typeof confettiEffect !== 'undefined') confettiEffect.start('vignette-overlay');
            });
        } else {
            if (typeof confettiEffect !== 'undefined') confettiEffect.stop();
        }

        // Glitch Effect Logic for Vignette - Inject SVG filter and apply to background
        if (scene.overlayEffect === 'glitch') {
            requestAnimationFrame(() => {
                // Ensure SVG filter exists
                if (!document.getElementById('glitch-distortion-filter')) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('style', 'position:absolute;width:0;height:0;');
                    svg.innerHTML = '<defs><filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%"><feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset"><animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset"><animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" /><feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/><feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/><feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/><feBlend in="red" in2="green" mode="screen" result="rg"/><feBlend in="rg" in2="blue" mode="screen" result="rgb"/><feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5"><animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
                    document.body.appendChild(svg);
                }
                // Use CSS class - filter is applied via ::before pseudo-element
                vignetteScreen.classList.add('glitch-active');
                if (typeof glitchEffect !== 'undefined') glitchEffect.start('vignette-overlay');
            });
        } else {
            // Remove CSS class
            vignetteScreen.classList.remove('glitch-active');
            if (typeof glitchEffect !== 'undefined') glitchEffect.stop();
        }

        // Nosferatu Effect Logic for Vignette
        if (scene.overlayEffect === 'nosferatu') {
            requestAnimationFrame(() => {
                const overlayEl = document.getElementById('vignette-overlay');
                if (overlayEl) {
                    // Clear any existing nosferatu container first
                    const existing = overlayEl.querySelector('.nosferatu-container');
                    if (existing) existing.remove();
                    
                    const nosferatuContainer = document.createElement('div');
                    nosferatuContainer.className = 'nosferatu-container';
                    nosferatuContainer.innerHTML = '<div class="nosferatu-cinema"></div><div class="nosferatu-scratch"></div><div class="nosferatu-effect-scratch"></div><div class="nosferatu-grain"></div><div class="nosferatu-vignette"></div>';
                    overlayEl.appendChild(nosferatuContainer);
                }
                // CSS class handles the background filter via ::before pseudo-element
                vignetteScreen.classList.add('nosferatu-active');
            });
        } else {
            // Remove nosferatu filter if not active and not other filter effect
            if (scene.overlayEffect !== 'tv' && scene.overlayEffect !== 'glitch') {
                vignetteScreen.style.filter = '';
            }
            vignetteScreen.classList.remove('nosferatu-active');
            if (vOverlay) {
                const existing = vOverlay.querySelector('.nosferatu-container');
                if (existing) existing.remove();
            }
        }

        // Wiggle Effect Logic for Vignette
        if (scene.overlayEffect === 'wiggle') {
            requestAnimationFrame(() => {
                // CSS class handles the background animation via ::before pseudo-element
                vignetteScreen.classList.add('wiggle-active');
            });
        } else {
            vignetteScreen.classList.remove('wiggle-active');
        }

        // Fog Effect Logic for Vignette
        if (scene.overlayEffect === 'fog') {
            requestAnimationFrame(() => {
                const overlayEl = document.getElementById('vignette-overlay');
                if (overlayEl) {
                    const existing = overlayEl.querySelector('.fog-container');
                    if (existing) existing.remove();
                    
                    const fogContainer = document.createElement('div');
                    fogContainer.className = 'fog-container';
                    fogContainer.innerHTML = '<div class="fog-img fog-img-first"></div><div class="fog-img fog-img-second"></div>';
                    overlayEl.appendChild(fogContainer);
                    overlayEl.classList.add('overlay-fog');
                    
                    updateFogSizes(fogContainer);
                }
            });
        } else {
            if (vOverlay) {
                vOverlay.classList.remove('overlay-fog');
                const existing = vOverlay.querySelector('.fog-container');
                if (existing) existing.remove();
            }
        }
    };

    const findScene = (sceneId) => {
        if (!sceneId) return null;
        const cenas = (gameData && (gameData.cenas || gameData.scenes)) || {};
        if (cenas[sceneId]) return cenas[sceneId];
        const lowerId = String(sceneId).trim().toLowerCase();
        for (const key of Object.keys(cenas)) {
            if (key.trim().toLowerCase() === lowerId) {
                return cenas[key];
            }
        }
        for (const val of Object.values(cenas)) {
            if (val && val.id && String(val.id).trim().toLowerCase() === lowerId) {
                return val;
            }
        }
        return null;
    };

    const loadScene = (sceneId, transition = true, transitionType = null, transitionSpeed = null, successPrefix = null, inputEchoText = null) => {
        let scene = findScene(sceneId);
        if (!scene) {
            const keys = Object.keys((gameData && gameData.cenas) || {});
            if (keys.length > 0) {
                sceneId = keys[0];
                scene = gameData.cenas[sceneId];
            } else {
                return;
            }
        }
        if (!scene) return;
        sceneId = scene.id;
        if (scene.backgroundMusic) {
            playBgm(scene.backgroundMusic);
        } else if (scene.stopBackgroundMusic) {
            playBgm("");
        }
        const oldChances = chances;
        if (scene.removesChanceOnEntry && gameData.enableChances) chances--; 
        if (scene.restoresChanceOnEntry && gameData.enableChances) chances = Math.min(chances + 1, gameData.gameMaxChances);
        
        if (chances !== oldChances) {
            lastChanceChange = {
                type: chances < oldChances ? 'lost' : 'restored',
                index: chances < oldChances ? chances : (chances - 1)
            };
        }
        currentSceneId = sceneId;
        if (!visitedScenes.includes(sceneId)) visitedScenes.push(sceneId);
        if (scene.sceneType === 'hypercard_stack') {
            const startCard = (scene.stackCards && scene.stackCards.length > 0)
                ? (scene.stackCards.find(c => c.id === scene.startCardId) || scene.stackCards[0])
                : null;
            const cardName = startCard ? startCard.name : '';
            const displayName = scene.name + (cardName ? ' · ' + cardName : '');
            const displayImage = startCard ? (startCard.image || scene.image) : scene.image;
            const displayDescription = startCard ? (startCard.description || '') : '';
            actionLog.push({ type: 'scene', name: displayName, timestamp: new Date().toLocaleTimeString(), description: displayDescription, image: displayImage });
        } else {
            actionLog.push({ type: 'scene', name: scene.name, timestamp: new Date().toLocaleTimeString(), description: scene.description, image: scene.image });
        }
        
        // Check if this is a vignette scene
        if (scene.vignetteType && scene.vignetteType !== 'none') {
            if (transition) {
                // Prepare vignette screen with fade-out before making it visible
                vignetteScreen.classList.add('fade-out');
                showVignetteScreen(scene);
                
                // Cross-fade: fade out game and fade in vignette
                gameContainer.classList.add('fade-out');
                
                // Trigger fade-in for vignette
                requestAnimationFrame(() => {
                    vignetteScreen.classList.remove('fade-out');
                });

                setTimeout(() => {
                    gameContainer.classList.add('hidden');
                    gameContainer.classList.remove('fade-out');
                }, 1000);
            } else {
                showVignetteScreen(scene);
                // If no transition, hide game container immediately
                gameContainer.classList.add('hidden');
            }
            autoSaveGame();
            return;
        }
        
        gameContainer.classList.remove('hidden');
        gameContainer.classList.remove('fade-out');
        
        let effectiveTransition = (transitionType && transitionType !== 'default')
            ? transitionType
            : (gameData.gameImageTransitionType || 'fade');
        if (effectiveTransition === 'slide') effectiveTransition = 'slide-left';
        if (effectiveTransition === 'none') transition = false;

        let speed = 0.5;
        if (transitionSpeed !== null && transitionSpeed !== undefined && transitionSpeed !== '') {
            const speedVal = Number(transitionSpeed);
            if (speedVal === 1) speed = 2.0;
            else if (speedVal === 2) speed = 1.0;
            else if (speedVal === 3) speed = 0.5;
            else if (speedVal === 4) speed = 0.2;
            else if (speedVal === 200) speed = 0.2;
            else if (speedVal === 500) speed = 0.5;
            else if (speedVal === 1000) speed = 1.0;
            else if (speedVal === 2000) speed = 2.0;
            else if (speedVal > 0 && speedVal <= 10) speed = speedVal;
        } else {
            const savedImageSpeedStr = window.isPreview ? null : localStorage.getItem('if_builder_settings_image_speed');
            if (savedImageSpeedStr) {
                const speedVal = parseInt(savedImageSpeedStr);
                if (speedVal === 1) speed = 2.0;
                else if (speedVal === 2) speed = 1.0;
                else if (speedVal === 3) speed = 0.5;
                else if (speedVal === 4) speed = 0.2;
            } else {
                const rawSpeed = gameData.gameImageSpeed;
                const speedVal = rawSpeed !== undefined && rawSpeed !== null ? Number(rawSpeed) : 3;
                if (speedVal === 1) speed = 2.0;
                else if (speedVal === 2) speed = 1.0;
                else if (speedVal === 3 || speedVal === 5) speed = 0.5;
                else if (speedVal === 4) speed = 0.2;
                else speed = 0.5;
            }
        }
        if (typeof speed !== 'number' || isNaN(speed)) {
            speed = 0.5;
        }
        const defaultDuration = speed + 's';
        document.documentElement.style.setProperty('--image-anim-speed', defaultDuration);

        const isTargetHyperCard = scene.sceneType === 'hypercard_stack';
        const isCurrentHyperCard = gameContainer && gameContainer.classList.contains('hypercard-fullscreen');

        if (isTargetHyperCard && !isCurrentHyperCard && transition && gameData.enableImages !== false) {
            // Transitioning from Branch/Chapter to Scenario (HyperCard Fullscreen)
            const durationMs = speed * 1000;

            if (effectiveTransition !== 'none' && gameContainer) {
                // Clone the previous branch view container to perform smooth outgoing transition
                const clone = gameContainer.cloneNode(true);
                clone.id = 'branch-transition-clone';
                clone.className = gameContainer.className + ' scene-curtain-transition ' + ('trans-' + effectiveTransition + '-out');
                clone.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;overflow:hidden;background-color:var(--bg-color);margin:0;padding:0;';
                document.body.appendChild(clone);

                // Render scenario in fullscreen directly underneath
                renderScene(scene, successPrefix, inputEchoText);

                setTimeout(() => {
                    clone.remove();
                }, durationMs + 50);
            } else {
                renderScene(scene, successPrefix, inputEchoText);
            }

            autoSaveGame();
            return;
        }

        if (transition && sceneImage && sceneImageBack && gameData.enableImages !== false && !isTargetHyperCard) {
             sceneImageBack.src = scene.image || ''; sceneImageBack.classList.toggle('hidden', !scene.image);
             if (sceneImage.src) {
                 sceneImage.classList.remove('hidden'); const animClass = 'trans-' + effectiveTransition + '-out'; sceneImage.classList.add(animClass);
                 if (sceneOverlay) {
                     sceneOverlay.style.transition = 'opacity ' + defaultDuration + ' ease-in-out';
                     sceneOverlay.style.opacity = '0';
                 }
                 const durationMs = speed * 1000;
                 setTimeout(() => { 
                     renderScene(scene, successPrefix, inputEchoText); 
                     sceneImage.classList.remove(animClass); 
                     sceneImageBack.src = ''; 
                     sceneImageBack.classList.add('hidden'); 
                     if (sceneOverlay) {
                         sceneOverlay.style.opacity = '1';
                     }
                 }, durationMs + 50);
             } else renderScene(scene, successPrefix, inputEchoText);
        } else { renderScene(scene, successPrefix, inputEchoText); }
        autoSaveGame();
    };

    const formatText = (text) => text.replace(/<([^>]+)>/g, '<span class="highlight-word" data-word="$1">$1</span>');

    const setupHighlights = (element) => {
        element.querySelectorAll('.highlight-word').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isPrinting) return; 
                const word = span.dataset.word;
                const currentVal = verbInput.textContent.trim();
                verbInput.textContent = currentVal ? (currentVal + ' ' + word) : word;
                verbInput.focus();
                
                // Move cursor to end for contenteditable
                if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
                    const range = document.createRange();
                    range.selectNodeContents(verbInput);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
        });
    };

    const renderChancesIcons = () => {
        const chancesContainer = document.getElementById('chances-container');
        if (!chancesContainer) return;
        if (!gameData.enableChances) {
            chancesContainer.style.display = 'none';
            return;
        }
        chancesContainer.innerHTML = '';
        const iconSvg = ICONS[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
        const iconOutlineSvg = ICONS_OUTLINE[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
        for (let i = 0; i < (gameData.gameMaxChances || 3); i++) {
            const icon = document.createElement('div');
            const isLost = i >= chances;
            icon.className = 'chance-icon ' + (isLost ? 'lost' : '');
            
            // Aplicar animação se este ícone foi o afetado agora
            if (lastChanceChange && lastChanceChange.index === i) {
                icon.classList.add('animate-chance-' + lastChanceChange.type);
            }
            
            icon.innerHTML = isLost ? iconOutlineSvg : iconSvg;
            chancesContainer.appendChild(icon);
        }
        lastChanceChange = null;
    };

    const adjustLayoutForImagesAndChances = (scene) => {
        const imagePanel = imageContainer ? imageContainer.parentElement : null;
        const textPanel = document.querySelector('.text-panel');
        const chancesContainer = document.getElementById('chances-container');
        const actionButtons = document.querySelector('.action-buttons');
        const actionPopup = document.getElementById('action-popup');
        const standardActionBar = document.getElementById('standard-action-bar');
        const suggestionsButton = document.getElementById('suggestions-button');
        const inventoryButton = document.getElementById('inventory-button');
        const diaryButton = document.getElementById('diary-button');
        const notesButton = document.getElementById('notes-button');
        const trackersButton = document.getElementById('trackers-button');
        const systemButton = document.getElementById('system-button');
        const isImagesEnabled = gameData.enableImages !== false;
        
        if (sceneNameOverlay) {
            sceneNameOverlay.style.whiteSpace = 'nowrap';
        }

        const gameContainer = document.getElementById('game-container');

        if (scene.sceneType === 'hypercard_stack') {
            if (gameContainer) gameContainer.classList.add('hypercard-fullscreen');

            // Scene Title (Left)
            if (sceneNameOverlay && imageContainer) {
                if (sceneNameOverlay.parentElement !== imageContainer) {
                    imageContainer.appendChild(sceneNameOverlay);
                }
                sceneNameOverlay.style.position = 'fixed';
                sceneNameOverlay.style.top = '20px';
                sceneNameOverlay.style.left = '20px';
                sceneNameOverlay.style.margin = '0';
                sceneNameOverlay.style.height = '36px';
                sceneNameOverlay.style.minHeight = '36px';
                sceneNameOverlay.style.display = 'flex';
                sceneNameOverlay.style.alignItems = 'center';
                sceneNameOverlay.style.zIndex = '40';
            }

            // Interactive Buttons (Center)
            let centerBar = document.getElementById('hypercard-center-bar');
            if (!centerBar) {
                centerBar = document.createElement('div');
                centerBar.id = 'hypercard-center-bar';
                centerBar.className = 'hypercard-center-bar';
                if (imageContainer) {
                    imageContainer.appendChild(centerBar);
                } else if (gameContainer) {
                    gameContainer.appendChild(centerBar);
                }
            }

            if (actionButtons && centerBar) {
                if (actionButtons.parentElement !== centerBar) {
                    centerBar.appendChild(actionButtons);
                }
                actionButtons.style.display = 'flex';
                actionButtons.style.margin = '0';
                actionButtons.style.position = 'relative';
            }

            if (actionPopup && actionButtons && actionPopup.parentElement !== actionButtons) {
                actionButtons.appendChild(actionPopup);
            }

            // Chances Icons (Right)
            if (chancesContainer && imageContainer) {
                if (chancesContainer.parentElement !== imageContainer) {
                    imageContainer.appendChild(chancesContainer);
                }
                chancesContainer.style.position = 'fixed';
                chancesContainer.style.top = '20px';
                chancesContainer.style.right = '20px';
                chancesContainer.style.margin = '0';
                chancesContainer.style.height = '36px';
                chancesContainer.style.zIndex = '40';
                chancesContainer.style.display = gameData.enableChances ? 'flex' : 'none';
                chancesContainer.style.alignItems = 'center';
                chancesContainer.style.gap = '8px';
                chancesContainer.style.justifyContent = 'flex-end';
                chancesContainer.style.backgroundColor = 'transparent';
                chancesContainer.style.padding = '0';
                chancesContainer.style.border = 'none';
                chancesContainer.style.borderRadius = '0';
                chancesContainer.style.backdropFilter = 'none';
                chancesContainer.style.boxSizing = 'border-box';
            }

            // Suggestions button is strictly and unconditionally hidden in scenario
            if (suggestionsButton) {
                suggestionsButton.classList.add('hidden');
                suggestionsButton.style.setProperty('display', 'none', 'important');
            }

            // Manage visibility of interactive buttons in scenario
            if (inventoryButton) {
                const isInvEnabled = gameData.enableInventory !== false;
                inventoryButton.classList.toggle('hidden', !isInvEnabled);
                inventoryButton.style.display = isInvEnabled ? '' : 'none';
            }
            if (diaryButton) {
                const isDiaryEnabled = gameData.enableDiary !== false;
                diaryButton.classList.toggle('hidden', !isDiaryEnabled);
                diaryButton.style.display = isDiaryEnabled ? '' : 'none';
            }
            if (notesButton) {
                const isNotesEnabled = !!gameData.enableNotes;
                notesButton.classList.toggle('hidden', !isNotesEnabled);
                notesButton.style.display = isNotesEnabled ? '' : 'none';
            }
            if (trackersButton) {
                const hasTrackers = (gameData.consequenceTrackers || []).length > 0;
                trackersButton.classList.toggle('hidden', !hasTrackers);
                trackersButton.style.display = hasTrackers ? '' : 'none';
            }
            if (systemButton) {
                const isSysBtn = !gameData.enableSystemMenu && (gameData.gameShowSystemButton ?? true);
                systemButton.classList.toggle('hidden', !isSysBtn);
                systemButton.style.display = isSysBtn ? '' : 'none';
            }

            renderChancesIcons();
            return;
        } else {
            if (gameContainer) gameContainer.classList.remove('hypercard-fullscreen');

            const centerBar = document.getElementById('hypercard-center-bar');
            if (centerBar) {
                centerBar.remove();
            }

            if (standardActionBar) {
                if (actionPopup) {
                    if (actionPopup.parentElement !== standardActionBar) {
                        standardActionBar.insertBefore(actionPopup, standardActionBar.firstChild);
                    }
                    actionPopup.style.removeProperty('left');
                    actionPopup.style.removeProperty('transform');
                    actionPopup.style.removeProperty('top');
                }
                if (actionButtons) {
                    if (actionButtons.parentElement !== standardActionBar) {
                        const inputArea = standardActionBar.querySelector('.input-area') || standardActionBar.querySelector('.choices-container');
                        if (inputArea) {
                            standardActionBar.insertBefore(actionButtons, inputArea);
                        } else {
                            standardActionBar.appendChild(actionButtons);
                        }
                    }
                    actionButtons.style.margin = '';
                    actionButtons.style.position = '';
                    actionButtons.style.display = '';
                }
            }

            const topBar = document.getElementById('hypercard-top-bar');
            if (topBar) topBar.remove();

            if (suggestionsButton) {
                const isChoice = gameData.gameInteractionType === 'choice';
                const isSuggEnabled = (gameData.enableSuggestions ?? true) && !isChoice;
                suggestionsButton.classList.toggle('hidden', !isSuggEnabled);
                suggestionsButton.style.display = isSuggEnabled ? '' : 'none';
            }
            if (inventoryButton) {
                const isChoice = gameData.gameInteractionType === 'choice';
                const isInvEnabled = (gameData.enableInventory ?? true) && !isChoice;
                inventoryButton.classList.toggle('hidden', !isInvEnabled);
                inventoryButton.style.display = isInvEnabled ? '' : 'none';
            }
        }
        
        if (!isImagesEnabled) {
            // Completely hide image panel and container
            if (imagePanel) {
                imagePanel.style.display = 'none';
                imagePanel.style.flex = '';
                imagePanel.style.width = '';
                imagePanel.style.height = '';
                imagePanel.style.maxWidth = '';
            }
            if (imageContainer) imageContainer.style.display = 'none';
            if (textPanel) {
                textPanel.style.display = '';
                textPanel.style.padding = '0';
            }
            if (standardActionBar) standardActionBar.classList.remove('hidden');
            
            // Create text-scene-header if not present
            let textSceneHeader = document.getElementById('text-scene-header');
            if (!textSceneHeader && textPanel) {
                textSceneHeader = document.createElement('div');
                textSceneHeader.id = 'text-scene-header';
                textSceneHeader.className = 'text-scene-header';
                
                // Style the header container using standard CSS tokens
                textSceneHeader.style.display = 'flex';
                textSceneHeader.style.justifyContent = 'space-between';
                textSceneHeader.style.alignItems = 'center';
                textSceneHeader.style.marginBottom = '20px';
                textSceneHeader.style.paddingBottom = '10px';
                textSceneHeader.style.borderBottom = '2px solid var(--border-color)';
                
                // Insert before scene-description
                if (sceneDescription) {
                    textPanel.insertBefore(textSceneHeader, sceneDescription);
                } else {
                    textPanel.appendChild(textSceneHeader);
                }
            }
            
            if (textSceneHeader) {
                // Move scene-name-overlay and chances-container to the text-scene-header
                if (sceneNameOverlay) {
                    textSceneHeader.appendChild(sceneNameOverlay);
                    
                    // Reset styling for inline text display
                    sceneNameOverlay.style.position = 'relative';
                    sceneNameOverlay.style.top = '0';
                    sceneNameOverlay.style.left = '0';
                    sceneNameOverlay.style.border = '2px solid var(--border-color)';
                    sceneNameOverlay.style.backgroundColor = 'var(--scene-name-overlay-bg)';
                    sceneNameOverlay.style.color = 'var(--scene-name-overlay-text-color)';
                    sceneNameOverlay.style.pointerEvents = 'none';
                    sceneNameOverlay.style.padding = '6px 12px';
                    sceneNameOverlay.style.margin = '0';
                    sceneNameOverlay.style.boxSizing = 'border-box';
                }
                
                if (chancesContainer) {
                    textSceneHeader.appendChild(chancesContainer);
                    
                    // Reset chances styling for inline display
                    chancesContainer.style.position = 'relative';
                    chancesContainer.style.top = '0';
                    chancesContainer.style.right = '0';
                    chancesContainer.style.margin = '0';
                    chancesContainer.style.padding = '0';
                    chancesContainer.style.backgroundColor = 'transparent';
                    chancesContainer.style.border = 'none';
                    chancesContainer.style.backdropFilter = 'none';
                }
            }
        } else {
            // Restore default panels visibility
            if (imagePanel) {
                imagePanel.style.display = '';
                imagePanel.style.alignItems = '';
                imagePanel.style.justifyContent = '';
                imagePanel.style.flex = '';
                imagePanel.style.width = '';
                imagePanel.style.height = '';
                imagePanel.style.maxWidth = '';
                imagePanel.style.backgroundColor = '';
            }
            if (imageContainer) {
                imageContainer.style.display = '';
                imageContainer.style.alignItems = '';
                imageContainer.style.justifyContent = '';
                imageContainer.style.width = '';
                imageContainer.style.height = '';
                imageContainer.style.overflow = '';
                imageContainer.style.backgroundColor = '';
                imageContainer.style.position = '';
            }
            if (sceneImage) {
                sceneImage.style.objectFit = '';
                sceneImage.style.maxWidth = '';
                sceneImage.style.maxHeight = '';
                sceneImage.style.width = '';
                sceneImage.style.height = '';
                sceneImage.style.position = '';
                sceneImage.style.display = '';
                sceneImage.style.margin = '';
                sceneImage.style.borderRadius = '';
            }
            if (textPanel) {
                textPanel.style.display = '';
                textPanel.style.padding = '';
            }
            if (standardActionBar) {
                standardActionBar.classList.remove('hidden');
                if (actionButtons && actionButtons.parentElement === standardActionBar) {
                    actionButtons.style.margin = '';
                    actionButtons.style.position = '';
                    actionButtons.style.display = '';
                }
            }
            
            // Remove text-scene-header and hypercard stage if present
            const textSceneHeader = document.getElementById('text-scene-header');
            if (textSceneHeader) {
                textSceneHeader.remove();
            }
            const stage = document.getElementById('hypercard-stage');
            if (stage && imageContainer) {
                if (sceneImage && sceneImage.parentElement === stage) {
                    imageContainer.appendChild(sceneImage);
                }
                stage.remove();
            }
            
            // Move scene-name-overlay back inside imageContainer
            if (sceneNameOverlay && imageContainer) {
                imageContainer.appendChild(sceneNameOverlay);
                
                // Style scene-name-overlay for absolute overlay mode
                sceneNameOverlay.style.position = 'absolute';
                sceneNameOverlay.style.top = '20px';
                sceneNameOverlay.style.left = '20px';
                sceneNameOverlay.style.border = '2px solid var(--border-color)';
                sceneNameOverlay.style.backgroundColor = 'var(--scene-name-overlay-bg)';
                sceneNameOverlay.style.color = 'var(--scene-name-overlay-text-color)';
                sceneNameOverlay.style.padding = '6px 12px';
                sceneNameOverlay.style.margin = '0';
                sceneNameOverlay.style.boxSizing = 'border-box';
            }
            
            // Move chances-container inside imageContainer in the top-right corner
            if (chancesContainer && imageContainer) {
                imageContainer.appendChild(chancesContainer);
                
                // Absolute overlay positioning (floating directly over image)
                chancesContainer.style.position = 'absolute';
                chancesContainer.style.top = '20px'; // Matching top padding of sceneNameOverlay
                chancesContainer.style.right = '20px';
                chancesContainer.style.margin = '0';
                chancesContainer.style.zIndex = '30';
                chancesContainer.style.display = 'flex';
                chancesContainer.style.alignItems = 'center';
                chancesContainer.style.gap = '8px';
                chancesContainer.style.justifyContent = 'flex-end';
                chancesContainer.style.backgroundColor = 'transparent';
                chancesContainer.style.padding = '0';
                chancesContainer.style.border = 'none';
                chancesContainer.style.borderRadius = '0';
                chancesContainer.style.backdropFilter = 'none';
                chancesContainer.style.boxSizing = 'border-box';
            }
        }
    };

    let currentStackCardId = null;

    const showImageLightbox = (imgSrc) => {
        if (!imgSrc) return;
        let lightbox = document.getElementById('image-lightbox-modal');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'image-lightbox-modal';
            lightbox.className = 'modal-overlay hidden';
            lightbox.style.zIndex = '9999';
            lightbox.style.cursor = 'pointer';
            lightbox.innerHTML = 
                '<button class="modal-close-button" id="image-lightbox-close" style="position: fixed; top: 15px; right: 20px; z-index: 10000;">&times;</button>' +
                '<div class="image-lightbox-container" style="max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; position: relative;">' +
                    '<img id="image-lightbox-img" src="" alt="Detalhe da Imagem" style="max-width: 90vw; max-height: 85vh; object-fit: contain; border: 2px solid var(--border-color); background: #000; box-shadow: 0 10px 40px rgba(0,0,0,0.8);" />' +
                '</div>';
            document.body.appendChild(lightbox);

            const closeLightbox = () => lightbox.classList.add('hidden');
            const closeBtn = lightbox.querySelector('.modal-close-button');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeLightbox();
                });
            }
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.id === 'image-lightbox-img' || e.target.closest('.image-lightbox-container')) {
                    closeLightbox();
                }
            });
        }
        const lightboxImg = lightbox.querySelector('#image-lightbox-img');
        if (lightboxImg) lightboxImg.src = imgSrc;
        lightbox.classList.remove('hidden');
    };

    const showFloatingDialogue = (title, text, image) => {
        let modal = document.getElementById('hypercard-floating-dialogue');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'hypercard-floating-dialogue';
            modal.className = 'modal-overlay hidden';
            modal.innerHTML = 
                '<div class="modal-content item-modal-content hypercard-dialogue-content">' +
                    '<button class="modal-close-button" id="hypercard-dialogue-close">&times;</button>' +
                    '<div class="item-modal-body">' +
                        '<div id="hypercard-dialogue-image-container" class="item-modal-image-container hidden" title="Clique para ampliar">' +
                            '<img id="hypercard-dialogue-image" src="" alt="Imagem" />' +
                        '</div>' +
                        '<div id="hypercard-dialogue-text-container" class="item-modal-text-container">' +
                            '<h3 id="hypercard-dialogue-name" class="item-modal-name"></h3>' +
                            '<p id="hypercard-dialogue-description"></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(modal);

            const closeDialogue = () => {
                modal.classList.add('hidden');
            };
            const closeBtn = modal.querySelector('.modal-close-button');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeDialogue();
                });
            }
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeDialogue();
            });
        }

        // Clean up any legacy duplicate title elements if existing in DOM
        const legacyTopTitle = modal.querySelector('#hypercard-dialogue-title');
        if (legacyTopTitle) legacyTopTitle.remove();

        const modalContent = modal.querySelector('.modal-content');
        const nameEl = modal.querySelector('#hypercard-dialogue-name');
        const descEl = modal.querySelector('#hypercard-dialogue-description') || modal.querySelector('#hypercard-dialogue-text');
        const imgContainer = modal.querySelector('#hypercard-dialogue-image-container') || modal.querySelector('#hypercard-dialogue-img-container');
        const imgEl = modal.querySelector('#hypercard-dialogue-image') || modal.querySelector('#hypercard-dialogue-img');

        const finalTitle = title || "Examinar";
        if (nameEl) nameEl.textContent = finalTitle;
        if (descEl) {
            descEl.innerHTML = window.safeHTML(formatText(text || ""), { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
            setupHighlights(descEl);
        }
        
        if (imgContainer && imgEl) {
            if (image) {
                imgEl.src = image;
                imgContainer.classList.remove('hidden');
                if (modalContent) modalContent.classList.add('has-image');
                imgContainer.onclick = (e) => {
                    e.stopPropagation();
                    showImageLightbox(image);
                };
            } else {
                imgEl.src = '';
                imgContainer.classList.add('hidden');
                if (modalContent) modalContent.classList.remove('has-image');
                imgContainer.onclick = null;
            }
        }
        modal.classList.remove('hidden');
    };

    const renderHyperCardStack = (scene, targetCardId = null) => {
        const cards = scene.stackCards && scene.stackCards.length > 0 ? scene.stackCards : [];
        if (cards.length === 0) return;

        const isCardChange = targetCardId !== null && targetCardId !== currentStackCardId;
        const card = cards.find(c => c.id === (targetCardId || currentStackCardId || scene.startCardId)) || cards[0];
        currentStackCardId = card.id;

        if (isCardChange) {
            const cardDisplayName = scene.name + (card.name ? ' · ' + card.name : '');
            actionLog.push({
                type: 'scene',
                name: cardDisplayName,
                timestamp: new Date().toLocaleTimeString(),
                description: card.description || '',
                image: card.image || ''
            });
            autoSaveGame();
        }

        // Clean up previous overlay and stage
        const existingOverlay = document.getElementById('hypercard-hotspot-overlay');
        if (existingOverlay) existingOverlay.remove();
        const existingRevealBtn = document.getElementById('hypercard-reveal-btn');
        if (existingRevealBtn) existingRevealBtn.remove();

        if (sceneNameOverlay) {
            sceneNameOverlay.textContent = scene.name + (card.name ? ' · ' + card.name : '');
            sceneNameOverlay.style.opacity = '1';
        }

        renderChancesIcons();
        applySceneOverlay(scene.overlayEffect);

        if (imageContainer && sceneImage) {
            let stage = document.getElementById('hypercard-stage');
            if (!stage) {
                stage = document.createElement('div');
                stage.id = 'hypercard-stage';
                imageContainer.appendChild(stage);
                stage.addEventListener('click', () => {
                    const p = document.getElementById('action-popup');
                    if (p && !p.classList.contains('hidden')) {
                        p.classList.add('hidden');
                        activePopupType = null;
                    }
                });
            }

            if (sceneOverlay && sceneOverlay.parentElement !== imageContainer) {
                imageContainer.appendChild(sceneOverlay);
            }

            let imageBack = document.getElementById('hypercard-image-back');
            if (!imageBack) {
                imageBack = document.createElement('img');
                imageBack.id = 'hypercard-image-back';
                imageBack.className = 'hidden';
                stage.appendChild(imageBack);
            }

            if (sceneImage.parentElement !== stage) {
                stage.appendChild(sceneImage);
            }

            // Update image
            sceneImage.src = card.image || '';
            sceneImage.classList.toggle('hidden', !card.image);
            if (imageContainer) imageContainer.classList.toggle('no-image', !card.image);

            // Clean up existing overlay and icon badges from previous cards
            const existingOverlay = stage.querySelector('#hypercard-hotspot-overlay');
            if (existingOverlay) existingOverlay.remove();
            stage.querySelectorAll('.hypercard-hotspot-icon-badge').forEach(el => el.remove());

            const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            overlay.id = 'hypercard-hotspot-overlay';
            overlay.setAttribute('viewBox', '0 0 1000 1000');
            overlay.setAttribute('preserveAspectRatio', 'none');
            overlay.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;z-index:25;pointer-events:auto;overflow:visible;');
            stage.appendChild(overlay);

            let filterStyle = '';
            if (scene.overlayEffect === 'nosferatu') {
                filterStyle = 'filter:sepia(0.8) contrast(1.1) brightness(0.9);';
            } else if (scene.overlayEffect === 'glitch') {
                filterStyle = 'filter:url(#glitch-distortion-filter);';
            }
            stage.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;margin:0;padding:0;';
            sceneImage.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:center;border-radius:0;border:none;margin:0;padding:0;pointer-events:none;z-index:2;' + filterStyle;
            if (imageBack) {
                imageBack.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:center;border-radius:0;border:none;margin:0;padding:0;pointer-events:none;z-index:1;' + filterStyle;
            }

            const HOTSPOT_ICONS_SVG = {
                eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
                mouse: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>',
                hand: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
                search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
                'arrow-up': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
                'arrow-down': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
                'arrow-left': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
                'arrow-right': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
                box: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
                key: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',
                sword: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>',
                flask: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.15 19.3c-.85 1.34.11 3.1 1.69 3.1h12.32c1.58 0 2.54-1.76 1.69-3.1L14 9.31V2"/><line x1="8.5" x2="15.5" y1="2" y2="2"/><line x1="6.5" x2="17.5" y1="15" y2="15"/></svg>',
                book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>',
                map: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>',
                crown: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>',
                star: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
                heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
                zap: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
                shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
                coins: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18 6v1a6 6 0 0 1-6 6H9"/><circle cx="16" cy="16" r="6"/></svg>',
                clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
                skull: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/></svg>',
                user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
                trophy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
                alert: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
                flame: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
                droplet: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
                sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
                moon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
                activity: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
            };

            const isRevealingZones = false;

            (card.hotspots || []).forEach(hotspot => {
                const hx = hotspot.x * 10;
                const hy = hotspot.y * 10;
                const hw = hotspot.width * 10;
                const hh = hotspot.height * 10;

                let elem;
                if (hotspot.shape === 'circle') {
                    elem = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                    elem.setAttribute('cx', String(hx + hw / 2));
                    elem.setAttribute('cy', String(hy + hh / 2));
                    elem.setAttribute('rx', String(hw / 2));
                    elem.setAttribute('ry', String(hh / 2));
                } else if (hotspot.shape === 'polygon' && hotspot.points && hotspot.points.length > 0) {
                    elem = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    elem.setAttribute('points', hotspot.points.map(p => (p.x * 10) + ',' + (p.y * 10)).join(' '));
                } else {
                    elem = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    elem.setAttribute('x', String(hx));
                    elem.setAttribute('y', String(hy));
                    elem.setAttribute('width', String(hw));
                    elem.setAttribute('height', String(hh));
                    elem.setAttribute('rx', '4');
                }

                elem.setAttribute('vector-effect', 'non-scaling-stroke');
                // The clickable area itself is always transparent
                elem.setAttribute('fill', 'transparent');
                elem.setAttribute('stroke', 'transparent');
                elem.setAttribute('stroke-width', '2');
                elem.setAttribute('class', 'hypercard-hotspot-zone');
                elem.style.cursor = 'pointer';

                // Centered Icon Badge in the middle of the hotspot (Square, strict color fidelity)
                const iconName = hotspot.icon || 'eye';
                const iconSvg = HOTSPOT_ICONS_SVG[iconName] || HOTSPOT_ICONS_SVG['eye'];
                const centerX = hotspot.x + hotspot.width / 2;
                const centerY = hotspot.y + hotspot.height / 2;

                const hideBg = !!hotspot.hideIconBg;
                const iconColor = hotspot.iconColor || '#ffffff';
                const bgColor = hideBg ? 'transparent' : (hotspot.iconBgColor || '#000000');
                const borderColor = hideBg ? 'transparent' : (hotspot.iconBorderColor || '#30363d');
                const borderCss = hideBg ? 'border:none;' : 'border:1px solid ' + borderColor + ';';
                const shadowCss = 'box-shadow:none;';

                const iconEl = document.createElement('div');
                iconEl.className = 'hypercard-hotspot-icon-badge';
                iconEl.style.cssText = 'position:absolute;left:' + centerX + '%;top:' + centerY + '%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:0;background:' + bgColor + ';' + borderCss + 'display:flex;align-items:center;justify-content:center;color:' + iconColor + ';' + shadowCss + 'pointer-events:none;transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);z-index:28;';
                iconEl.innerHTML = iconSvg;

                const isAlwaysVisible = hotspot.highlightStyle === 'icons-visible' || hotspot.highlightStyle === 'always-visible' || hotspot.highlightStyle === 'pulsing-pin';
                const isHidden = hotspot.highlightStyle === 'hidden';

                if (isAlwaysVisible) {
                    iconEl.style.opacity = '1';
                    iconEl.style.transform = 'translate(-50%, -50%) scale(1)';
                } else if (isHidden) {
                    iconEl.style.display = 'none';
                    iconEl.style.opacity = '0';
                } else {
                    // icons-hover
                    iconEl.style.opacity = '0';
                    iconEl.style.transform = 'translate(-50%, -50%) scale(0.85)';
                }
                stage.appendChild(iconEl);

                // Hover interaction - STRICT COLOR FIDELITY & NO GLOW
                elem.addEventListener('mouseenter', () => {
                    if (!isAlwaysVisible && !isHidden) {
                        iconEl.style.display = 'flex';
                        iconEl.style.opacity = '1';
                        iconEl.style.transform = 'translate(-50%, -50%) scale(1.08)';
                    } else if (isAlwaysVisible) {
                        iconEl.style.transform = 'translate(-50%, -50%) scale(1.08)';
                    }
                });

                elem.addEventListener('mouseleave', () => {
                    if (!isAlwaysVisible && !isHidden) {
                        iconEl.style.opacity = isRevealingZones ? '1' : '0';
                        iconEl.style.transform = 'translate(-50%, -50%) scale(1)';
                    } else if (isAlwaysVisible) {
                        iconEl.style.transform = 'translate(-50%, -50%) scale(1)';
                    }
                });

                if (hotspot.title) {
                    const titleTag = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                    titleTag.textContent = hotspot.title;
                    elem.appendChild(titleTag);
                }

                elem.addEventListener('click', (e) => {
                    e.stopPropagation();

                    if (hotspot.soundEffect) {
                        try {
                            const snd = new Audio(hotspot.soundEffect);
                            snd.play().catch(() => {});
                        } catch (err) {}
                    }

                    if (hotspot.requiresInInventory) {
                        const hasRequired = inventory.some(i => i.id === hotspot.requiresInInventory);
                        if (!hasRequired) {
                            const dialogTitle = hotspot.title || "Bloqueado";
                            showFloatingDialogue("Bloqueado", hotspot.lockedMessage || "Você não possui o item necessário para interagir aqui.");
                            actionLog.push({ type: 'input', text: '> ' + dialogTitle });
                            actionLog.push({ type: 'output', text: hotspot.lockedMessage || "Você não possui o item necessário para interagir aqui." });
                            autoSaveGame();
                            return;
                        }
                        if (hotspot.consumesItem) {
                            removeFromInventory(hotspot.requiresInInventory);
                        }
                    }

                    if (hotspot.actionType === 'collect_item' && hotspot.addsToInventory) {
                        const itemObj = gameData.globalObjects ? gameData.globalObjects[hotspot.addsToInventory] : null;
                        if (itemObj) {
                            addToInventory(itemObj);
                            const dialogTitle = hotspot.title || hotspot.examineTitle || itemObj.name || "Objeto Coletado";
                            const dialogText = hotspot.examineText || ("Você obteve: " + itemObj.name);
                            const dialogImg = itemObj.image || hotspot.examineImage || '';
                            showFloatingDialogue(dialogTitle, dialogText, dialogImg);
                            actionLog.push({ type: 'input', text: '> ' + dialogTitle });
                            actionLog.push({ type: 'output', text: dialogText, image: dialogImg });
                            autoSaveGame();
                        }
                    }

                    if (hotspot.trackerEffects && hotspot.trackerEffects.length > 0) {
                        updateTrackers(hotspot.trackerEffects);
                    }

                    let effectiveTrans = hotspot.transition || gameData.gameImageTransitionType || 'fade';
                    if (effectiveTrans === 'slide') effectiveTrans = 'slide-left';

                    if (hotspot.actionType === 'navigate_card' && hotspot.targetCardId) {
                        const targetCard = cards.find(c => c.id === hotspot.targetCardId);
                        const targetImg = targetCard ? targetCard.image : '';

                        actionLog.push({ type: 'input', text: '> ' + (hotspot.title || 'Mudar de vista') });

                        // Immediately hide all current icons alongside the transitioning image
                        stage.querySelectorAll('.hypercard-hotspot-icon-badge').forEach(el => {
                            el.style.transition = 'opacity 0.25s ease-out';
                            el.style.opacity = '0';
                            el.style.pointerEvents = 'none';
                        });
                        overlay.style.pointerEvents = 'none';

                        if (effectiveTrans !== 'none' && sceneImage && sceneImage.src && targetImg && imageBack) {
                            imageBack.src = targetImg;
                            imageBack.classList.remove('hidden');
                            const animClass = 'trans-' + effectiveTrans + '-out';
                            sceneImage.classList.add(animClass);
                            setTimeout(() => {
                                renderHyperCardStack(scene, hotspot.targetCardId);
                                sceneImage.classList.remove(animClass);
                                imageBack.src = '';
                                imageBack.classList.add('hidden');
                            }, 380);
                        } else {
                            renderHyperCardStack(scene, hotspot.targetCardId);
                        }
                    } else if (hotspot.actionType === 'navigate_scene' && hotspot.targetSceneId) {
                        const targetScene = findScene(hotspot.targetSceneId);

                        if (hotspot.title) {
                            actionLog.push({ type: 'input', text: '> ' + hotspot.title });
                        }

                        // Immediately hide all current icons alongside the transitioning image
                        stage.querySelectorAll('.hypercard-hotspot-icon-badge').forEach(el => {
                            el.style.transition = 'opacity 0.25s ease-out';
                            el.style.opacity = '0';
                            el.style.pointerEvents = 'none';
                        });
                        overlay.style.pointerEvents = 'none';

                        const isTargetScenario = targetScene && targetScene.sceneType === 'hypercard_stack';

                        if (!isTargetScenario) {
                            // Transitioning from Scenario to Branch/Chapter
                            // Create a temporary standalone curtain snapshot of the current view
                            const currentViewImg = (sceneImage && sceneImage.src) ? sceneImage.src : (card && card.image ? card.image : '');
                            if (effectiveTrans !== 'none' && currentViewImg) {
                                const curtain = document.createElement('div');
                                curtain.className = 'scene-curtain-transition ' + ('trans-' + effectiveTrans + '-out');
                                curtain.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background-image:url("' + currentViewImg + '");background-size:cover;background-position:center;background-repeat:no-repeat;z-index:9999;pointer-events:none;';
                                document.body.appendChild(curtain);

                                setTimeout(() => {
                                    curtain.remove();
                                }, 380);
                            }

                            // Load target branch scene directly
                            loadScene(hotspot.targetSceneId, false);
                        } else {
                            // Scenario to another Scenario
                            const targetImg = targetScene ? (targetScene.stackCards && targetScene.stackCards[0] ? targetScene.stackCards[0].image : (targetScene.image || '')) : '';
                            if (effectiveTrans !== 'none' && sceneImage && sceneImage.src && targetImg && imageBack) {
                                imageBack.src = targetImg;
                                imageBack.classList.remove('hidden');
                                const animClass = 'trans-' + effectiveTrans + '-out';
                                sceneImage.classList.add(animClass);
                                setTimeout(() => {
                                    loadScene(hotspot.targetSceneId, false);
                                    sceneImage.classList.remove(animClass);
                                    imageBack.src = '';
                                    imageBack.classList.add('hidden');
                                }, 380);
                            } else {
                                loadScene(hotspot.targetSceneId, false);
                            }
                        }
                    } else if (hotspot.actionType === 'examine') {
                        const dialogTitle = hotspot.title || hotspot.examineTitle || "Examinar";
                        showFloatingDialogue(dialogTitle, hotspot.examineText || "", hotspot.examineImage);
                        actionLog.push({ type: 'input', text: '> ' + dialogTitle });
                        if (hotspot.examineText || hotspot.examineImage) {
                            actionLog.push({ type: 'output', text: hotspot.examineText || "", image: hotspot.examineImage });
                        }
                        autoSaveGame();
                    } else if (hotspot.actionType === 'toggle_tracker') {
                        const dialogTitle = hotspot.title || "Rastreador";
                        if (hotspot.examineText) {
                            showFloatingDialogue(dialogTitle, hotspot.examineText, hotspot.examineImage);
                            actionLog.push({ type: 'input', text: '> ' + dialogTitle });
                            actionLog.push({ type: 'output', text: hotspot.examineText, image: hotspot.examineImage });
                        }
                        autoSaveGame();
                    }
                });

                overlay.appendChild(elem);
            });
        }
    };

    const applySceneOverlay = (overlayEffect) => {
        if (!sceneOverlay) return;
        sceneOverlay.className = 'scene-overlay'; // Reset
        sceneOverlay.style.opacity = '1';
        sceneOverlay.style.zIndex = '5';
        sceneOverlay.style.pointerEvents = 'none';

        // Clear previous effect DOM
        const existingBlur = sceneOverlay.querySelector('.blur-overlay-container');
        if (existingBlur) existingBlur.remove();
        const existingChromatic = sceneOverlay.querySelector('.chromatic-overlay-container');
        if (existingChromatic) existingChromatic.remove();
        const existingTV = sceneOverlay.querySelector('.tv-overlay-container');
        if (existingTV) existingTV.remove();
        const existingConfetti = sceneOverlay.querySelector('.confetti-overlay-container');
        if (existingConfetti) existingConfetti.remove();
        const existingGlitch = sceneOverlay.querySelector('.glitch-canvas');
        if (existingGlitch) existingGlitch.remove();

        if (overlayEffect) {
            sceneOverlay.classList.add('overlay-' + overlayEffect);
        }

        // Rain Effect Logic
        if (overlayEffect === 'rain') {
            if (typeof rainEffect !== 'undefined') rainEffect.start('scene-overlay');
        } else {
            if (typeof rainEffect !== 'undefined') rainEffect.stop();
        }

        // Blur Effect Logic
        if (overlayEffect === 'blur') {
            const blurContainer = document.createElement('div');
            blurContainer.className = 'blur-overlay-container';
            blurContainer.innerHTML = '<div class="blur-rumble-layer"></div><div class="blur-flicker-layer"></div><div class="blur-grain-layer"></div><div class="blur-vignette-layer"></div>';
            sceneOverlay.appendChild(blurContainer);
        }

        // Chromatic Aberration Effect Logic
        if (overlayEffect === 'chromatic') {
            const chromaticContainer = document.createElement('div');
            chromaticContainer.className = 'chromatic-overlay-container';
            chromaticContainer.innerHTML = '<div class="chromatic-jerk-wrapper"><div class="chromatic-layer chromatic-red"></div><div class="chromatic-layer chromatic-green"></div><div class="chromatic-layer chromatic-blue"></div><div class="chromatic-flicker"></div></div><div class="chromatic-scanlines"></div>';
            sceneOverlay.appendChild(chromaticContainer);
        }

        // TV Effect Logic
        if (overlayEffect === 'tv') {
            sceneOverlay.parentElement?.classList.add('tv-distortion-active');
            
            const tvContainer = document.createElement('div');
            tvContainer.className = 'tv-overlay-container';
            tvContainer.innerHTML = '<div class="tv-screen-wrapper"><div class="tv-rgb-grid"></div><div class="tv-scanlines"></div><div class="tv-vignette"></div><div class="tv-glow"></div><div class="tv-flicker"></div><div class="tv-interference"></div></div>';
            sceneOverlay.appendChild(tvContainer);
        } else {
            sceneOverlay.parentElement?.classList.remove('tv-distortion-active');
        }

        // Confetti Effect Logic
        if (overlayEffect === 'confetti') {
            if (typeof confettiEffect !== 'undefined') confettiEffect.start('scene-overlay');
        } else {
            if (typeof confettiEffect !== 'undefined') confettiEffect.stop();
        }

        // Glitch Effect Logic
        if (overlayEffect === 'glitch') {
            if (!document.getElementById('glitch-distortion-filter')) {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('style', 'position:absolute;width:0;height:0;');
                svg.innerHTML = '<defs><filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%"><feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset"><animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset"><animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" /><feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/><feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/><feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/><feBlend in="red" in2="green" mode="screen" result="rg"/><feBlend in="rg" in2="blue" mode="screen" result="rgb"/><feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5"><animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
                document.body.appendChild(svg);
            }
            if (sceneImage) sceneImage.style.filter = 'url(#glitch-distortion-filter)';
            if (sceneImageBack) sceneImageBack.style.filter = 'url(#glitch-distortion-filter)';
            sceneOverlay.parentElement?.classList.add('glitch-distortion-active');
            if (typeof glitchEffect !== 'undefined') glitchEffect.start('scene-overlay');
        } else {
            if (sceneImage) sceneImage.style.filter = '';
            if (sceneImageBack) sceneImageBack.style.filter = '';
            sceneOverlay.parentElement?.classList.remove('glitch-distortion-active');
            if (typeof glitchEffect !== 'undefined') glitchEffect.stop();
        }

        // Nosferatu Effect Logic
        if (overlayEffect === 'nosferatu') {
            const existing = sceneOverlay.querySelector('.nosferatu-container');
            if (existing) existing.remove();
            
            const nosferatuContainer = document.createElement('div');
            nosferatuContainer.className = 'nosferatu-container';
            nosferatuContainer.innerHTML = '<div class="nosferatu-cinema"></div><div class="nosferatu-scratch"></div><div class="nosferatu-effect-scratch"></div><div class="nosferatu-grain"></div><div class="nosferatu-vignette"></div>';
            sceneOverlay.appendChild(nosferatuContainer);
            
            if (sceneImage) sceneImage.style.filter = 'sepia(0.8) contrast(1.1) brightness(0.9)';
            if (sceneImageBack) sceneImageBack.style.filter = 'sepia(0.8) contrast(1.1) brightness(0.9)';
            sceneOverlay.parentElement?.classList.add('nosferatu-active');
        } else {
            const existing = sceneOverlay.querySelector('.nosferatu-container');
            if (existing) existing.remove();
            sceneOverlay.parentElement?.classList.remove('nosferatu-active');
            if (overlayEffect !== 'glitch' && overlayEffect !== 'tv') {
                if (sceneImage) sceneImage.style.filter = '';
                if (sceneImageBack) sceneImageBack.style.filter = '';
            }
        }

        // Wiggle Effect Logic
        if (overlayEffect === 'wiggle') {
            sceneOverlay.parentElement?.classList.add('wiggle-active');
        } else {
            sceneOverlay.parentElement?.classList.remove('wiggle-active');
        }

        // Fog Effect Logic
        if (overlayEffect === 'fog') {
             const existing = sceneOverlay.querySelector('.fog-container');
             if (existing) existing.remove();

             const fogContainer = document.createElement('div');
             fogContainer.className = 'fog-container';
             fogContainer.innerHTML = '<div class="fog-img fog-img-first"></div><div class="fog-img fog-img-second"></div>';
             sceneOverlay.appendChild(fogContainer);
             sceneOverlay.classList.add('overlay-fog');
             
             updateFogSizes(fogContainer);
        } else {
             sceneOverlay.classList.remove('overlay-fog');
             const existing = sceneOverlay.querySelector('.fog-container');
             if (existing) existing.remove();
        }
    };

    const renderScene = (scene, successPrefix = null, inputEchoText = null) => {
        adjustLayoutForImagesAndChances(scene);

        // Clear any previous HyperCard overlay if entering standard scene
        const existingOverlay = document.getElementById('hypercard-hotspot-overlay');
        if (existingOverlay && scene.sceneType !== 'hypercard_stack') existingOverlay.remove();
        const existingRevealBtn = document.getElementById('hypercard-reveal-btn');
        if (existingRevealBtn && scene.sceneType !== 'hypercard_stack') existingRevealBtn.remove();

        // Always apply scene overlay (works for both hypercard stacks and standard scenes)
        applySceneOverlay(scene.overlayEffect);

        if (scene.sceneType === 'hypercard_stack') {
            renderHyperCardStack(scene);
            return;
        }

        const isImagesEnabled = gameData.enableImages !== false;
        if (scene.image && isImagesEnabled && scene.sceneType !== 'hypercard_stack') { sceneImage.src = scene.image; sceneImage.classList.remove('hidden'); imageContainer.classList.remove('no-image'); }
        else if (scene.sceneType !== 'hypercard_stack') { sceneImage.src = ''; sceneImage.classList.add('hidden'); imageContainer.classList.add('no-image'); }
        if (sceneNameOverlay && scene.sceneType !== 'hypercard_stack') { sceneNameOverlay.textContent = scene.name; sceneNameOverlay.style.opacity = '1'; }

        sceneDescription.innerHTML = '';
        
        if (inputEchoText) {
            const formattedInput = inputEchoText.trim().startsWith('>') ? inputEchoText.trim() : ('> ' + inputEchoText.trim());
            const echo = document.createElement('p');
            echo.className = 'verb-echo';
            echo.textContent = formattedInput;
            sceneDescription.appendChild(echo);
            actionLog.push({ type: 'input', text: formattedInput, isLeadInput: true });
        }
        
        let fullDescription = scene.description || '';
        if (successPrefix) fullDescription = successPrefix + "\\n\\n" + fullDescription;

        const paragraphs = fullDescription.split(/\\n|\\\\n/).filter(p => p.trim().length > 0);
        let pIndex = 0; const textAnimType = (gameData.enableTextControl !== false) ? (gameData.gameTextAnimationType || 'fade') : 'none';
        const isImmersive = document.body.classList.contains('behavior-immersive') && window.innerWidth <= 768;

        const setDiceButtonsDisabled = (disabled) => {
            const parserDiceBtn = document.getElementById('parser-dice-roll-button');
            if (parserDiceBtn) {
                parserDiceBtn.disabled = disabled;
                parserDiceBtn.style.opacity = disabled ? '0.5' : '1';
                parserDiceBtn.style.cursor = disabled ? 'not-allowed' : 'pointer';
            }
            const choiceDiceBtns = document.querySelectorAll('.dice-roll-btn');
            choiceDiceBtns.forEach(btn => {
                btn.disabled = disabled;
                btn.style.opacity = disabled ? '0.5' : '1';
                btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
            });
        };

        isPrinting = true;
        setDiceButtonsDisabled(true);
        sceneDescription.classList.add('typewriting-active');
        
        // Loop protection
        renderSessionId++;
        const mySessionId = renderSessionId;

        let skipParagraph = false;
        const globalEnterSkip = (e) => {
            if (e.key === 'Enter' && isPrinting) {
                skipParagraph = true;
            }
        };
        window.addEventListener('keydown', globalEnterSkip);

        const renderNextParagraph = () => {
            skipParagraph = false;
            if (pIndex >= paragraphs.length) { 
                isPrinting = false;
                setDiceButtonsDisabled(false);
                sceneDescription.classList.remove('typewriting-active');
                if (chances <= 0) gameOver(); else if (scene.isEndingScene) activateEndingUI('win');
                return; 
            }

            const p = document.createElement('p'); const formattedHTML = formatText(paragraphs[pIndex]);
            if (textAnimType === 'typewriter') {
                p.className = 'scene-paragraph typewriter-cursor'; p.style.opacity = '1'; 
                p.innerHTML = window.safeHTML(formattedHTML, { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
                sceneDescription.appendChild(p);
                const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
                let node; const textNodes = []; while((node = walker.nextNode())) textNodes.push(node);
                const fullTexts = textNodes.map(n => n.nodeValue); textNodes.forEach(n => n.nodeValue = '');
                let nodeIdx = 0; let charIdx = 0;
                const type = () => {
                    if (mySessionId !== renderSessionId) {
                        window.removeEventListener('keydown', globalEnterSkip);
                        return;
                    }
                    if (skipParagraph || nodeIdx >= textNodes.length) {
                        // Complete all remaining text nodes immediately
                        for (let i = nodeIdx; i < textNodes.length; i++) {
                            textNodes[i].nodeValue = fullTexts[i];
                        }
                        p.classList.remove('typewriter-cursor');
                        setupHighlights(p);
                        finishParagraph();
                        return;
                    }
                    const currentNode = textNodes[nodeIdx]; const fullText = fullTexts[nodeIdx];
                    if (charIdx < fullText.length) { currentNode.nodeValue += fullText[charIdx]; charIdx++; if (sceneDescription) sceneDescription.scrollTop = sceneDescription.scrollHeight; setTimeout(type, typeSpeedBase); }
                    else { nodeIdx++; charIdx = 0; type(); }
                };
                type();
            } else { 
                p.innerHTML = window.safeHTML(formattedHTML, { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
                p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); finishParagraph(); 
            }
        };

        const finishParagraph = () => {
            pIndex++;
            if (pIndex < paragraphs.length) {
                if (gameData.gameTextReadingFlow === 'continuous') {
                    // Bypass pause for continuous flow
                    setTimeout(() => {
                        if (mySessionId === renderSessionId) renderNextParagraph();
                    }, 30);
                    return;
                }
                const continueBtn = document.createElement('div'); continueBtn.className = 'continue-indicator'; continueBtn.innerHTML = '<span>▼</span>';
                const continueHandler = (e) => { 
                    if (e) { if (e.type === 'keydown' && e.key !== 'Enter') return; e.stopPropagation(); if (e.type === 'keydown') e.preventDefault(); }
                    
                    // NO MODO IMERSIVO MOBILE: Limpa tudo ANTES de renderizar o próximo parágrafo
                    if (isImmersive) {
                        sceneDescription.innerHTML = '';
                    } else {
                        continueBtn.remove();
                    }
                    
                    sceneDescription.removeEventListener('click', continueHandler); 
                    window.removeEventListener('keydown', continueHandler);
                    if (mySessionId === renderSessionId) renderNextParagraph(); 
                };
                continueBtn.addEventListener('click', continueHandler); 
                sceneDescription.addEventListener('click', continueHandler);
                window.addEventListener('keydown', continueHandler);
                sceneDescription.appendChild(continueBtn); sceneDescription.scrollTop = sceneDescription.scrollHeight;
            } else { 
                isPrinting = false;
                setDiceButtonsDisabled(false);
                window.removeEventListener('keydown', globalEnterSkip);
                sceneDescription.classList.remove('typewriting-active');
                sceneDescription.scrollTop = sceneDescription.scrollHeight; 
                if (chances <= 0) gameOver(); else { verbInput.focus(); if (scene.isEndingScene) activateEndingUI('win'); }
            }
        };
        // Small delay to ensure any previous clear/setup settles? No, direct call is fine but verify ID.
        // renderNextParagraph called immediately
        if (mySessionId === renderSessionId) renderNextParagraph();
        
        renderChancesIcons();
        adjustLayoutForImagesAndChances(scene);
        
        // CHOICE MODE HANDLING
        if (gameData.gameInteractionType === 'choice') {
            const inputArea = document.querySelector('.input-area');
            if (inputArea) inputArea.classList.add('hidden');
            // Hide Suggestions and Inventory in IF/Choice mode
            if (suggestionsButton) suggestionsButton.classList.add('hidden');
            if (inventoryButton) inventoryButton.classList.add('hidden');
            
            // Create choices container and append to action-bar (same location as input-area)
            const choicesContainer = document.createElement('div');
            choicesContainer.className = 'choices-container';
            choicesContainer.id = 'choices-container'; // For easy removal on scene change
            choicesContainer.style.width = '100%';
            choicesContainer.style.display = 'flex';
            choicesContainer.style.flexDirection = 'column';
            choicesContainer.style.gap = '10px';
            choicesContainer.style.marginTop = '10px';
            
            // Remove any parser dice button if leftover
            const parserDiceBtn = document.getElementById('parser-dice-roll-button');
            if (parserDiceBtn) parserDiceBtn.remove();

            const isDiceAllowed = gameData.enableDiceRoll && scene.allowDiceRollInScene !== false;
            const diceSvgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dices" style="display:inline-block;vertical-align:middle;margin-right:6px;width:18px;height:18px;"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3.17l-4.25-4.25a2.24 2.24 0 0 0-3.17 0L10.5 6.58"/><path d="m6 18 4-4"/><path d="m14 10 4-4"/><path d="M7 14h.01"/><path d="M11 18h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>';
            const getDiceBtnText = () => gameData.gameDiceRollButtonText || ('Rolar ' + (gameData.diceType || 'd20').toUpperCase());

            if (isDiceAllowed) {
                const diceBtn = document.createElement('button');
                diceBtn.innerHTML = diceSvgIcon + '<span>' + getDiceBtnText() + '</span>';
                diceBtn.className = 'choice-button dice-roll-btn';
                diceBtn.style.padding = '12px 16px';
                diceBtn.style.textAlign = 'center';
                diceBtn.style.backgroundColor = 'var(--dice-button-bg, #3b82f6)';
                diceBtn.style.color = 'var(--dice-button-text-color, #ffffff)';
                diceBtn.style.border = '2px solid var(--dice-button-bg, #3b82f6)';
                diceBtn.style.borderRadius = '0px';
                diceBtn.style.fontFamily = 'var(--font-family)';
                diceBtn.style.fontSize = '1em';
                diceBtn.style.fontWeight = 'bold';
                diceBtn.style.cursor = 'pointer';
                diceBtn.style.transition = 'all 0.2s';
                diceBtn.style.width = '100%';
                diceBtn.style.textTransform = 'uppercase';
                diceBtn.style.display = 'flex';
                diceBtn.style.alignItems = 'center';
                diceBtn.style.justifyContent = 'center';

                diceBtn.onclick = () => {
                    diceBtn.disabled = true;
                    diceBtn.style.opacity = '0.5';
                    triggerDiceRoll(scene);
                };
                choicesContainer.appendChild(diceBtn);
            }

            if (scene.choices && scene.choices.length > 0) {
                scene.choices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.textContent = choice.label;
                    btn.className = 'choice-button';
                    // Inline styles for basic look, can be moved to CSS later or use existing classes
                    // Updated styling to match Action Button
                    btn.style.padding = '12px 16px';
                    btn.style.textAlign = 'center'; // Center text like action button
                    btn.style.backgroundColor = 'var(--action-button-bg, #ffffff)';
                    btn.style.color = 'var(--action-button-text-color, #0d1117)';
                    btn.style.border = '2px solid var(--border-color, rgba(255,255,255,0.2))';
                    btn.style.borderRadius = '0px'; // Square as requested
                    // Actually action button usually inherits standard border radius.
                    btn.style.fontFamily = 'var(--font-family)';
                    btn.style.fontSize = '1em';
                    btn.style.fontWeight = 'bold';
                    btn.style.cursor = 'pointer';
                    btn.style.transition = 'all 0.2s';
                    btn.style.width = '100%';
                    btn.style.textTransform = 'uppercase';

                    btn.onmouseover = () => {
                         btn.style.filter = 'brightness(0.9)';
                         btn.style.transform = 'translateY(-2px)';
                    };
                    btn.onmouseout = () => { 
                         btn.style.borderColor = 'var(--border-color, rgba(255,255,255,0.2))'; 
                         btn.style.transform = 'none'; 
                    };

                    btn.onclick = () => {
                        actionLog.push({ type: 'choice', text: '> ' + choice.label });
                        loadScene(choice.targetSceneId, true);
                    };
                    choicesContainer.appendChild(btn);
                });
            }
            // Insert choices container into standard-action-bar after action-buttons div
            const actionBar = document.getElementById('standard-action-bar');
            if (actionBar) {
                // Remove old choices if present
                const oldChoices = actionBar.querySelector('#choices-container');
                if (oldChoices) oldChoices.remove();
                // Append new choices
                actionBar.appendChild(choicesContainer);
            }
        } else {
            const inputArea = document.querySelector('.input-area');
            if (inputArea) inputArea.classList.remove('hidden');
            if (suggestionsButton) suggestionsButton.classList.remove('hidden');
            if (inventoryButton) inventoryButton.classList.remove('hidden');

            // Remove any leftover choices container
            const oldChoices = document.getElementById('choices-container');
            if (oldChoices) oldChoices.remove();

            // PARSER MODE DICE ROLL BUTTON INJECTION (To the RIGHT of Action button)
            let parserDiceBtn = document.getElementById('parser-dice-roll-button');
            const isDiceAllowed = gameData.enableDiceRoll && scene.allowDiceRollInScene !== false;
            const diceSvgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dices" style="display:inline-block;vertical-align:middle;margin-right:6px;width:18px;height:18px;"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3.17l-4.25-4.25a2.24 2.24 0 0 0-3.17 0L10.5 6.58"/><path d="m6 18 4-4"/><path d="m14 10 4-4"/><path d="M7 14h.01"/><path d="M11 18h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>';
            const getDiceBtnText = () => gameData.gameDiceRollButtonText || ('Rolar ' + (gameData.diceType || 'd20').toUpperCase());

            if (isDiceAllowed) {
                if (!parserDiceBtn && inputArea) {
                    parserDiceBtn = document.createElement('button');
                    parserDiceBtn.id = 'parser-dice-roll-button';
                    parserDiceBtn.className = 'dice-roll-btn-parser';
                    inputArea.appendChild(parserDiceBtn);
                }
                if (parserDiceBtn) {
                    parserDiceBtn.innerHTML = diceSvgIcon + '<span>' + getDiceBtnText() + '</span>';
                    parserDiceBtn.classList.remove('hidden');
                    parserDiceBtn.onclick = () => {
                        triggerDiceRoll(scene);
                    };
                }
            } else if (parserDiceBtn) {
                parserDiceBtn.classList.add('hidden');
            }
        }

        actionPopup.classList.add('hidden'); verbInput.textContent = ''; activePopupType = null;
    };

    const activateEndingUI = (type) => {
        isGameEnded = type;
        gameEndTime = Date.now();
        standardActionBar.classList.add('hidden');
        endingActionBar.classList.remove('hidden');

        // Show View Diary button only for victory/defeat if enabled
        const showRetrospective = gameData.enableRetrospective !== false;
        if ((type === 'win' || type === 'lose') && showRetrospective) {
            if (vignetteDiaryButton) vignetteDiaryButton.classList.remove('hidden');
        } else {
            if (vignetteDiaryButton) vignetteDiaryButton.classList.add('hidden');
        }

        removeGameSave('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'));
    };

    const gameOver = () => { 
        activateEndingUI('lose'); 
    };
    const handleInput = () => {
        if (isPrinting) return;
        const input = (verbInput ? (verbInput.innerText || verbInput.textContent || '') : '').trim();
        if (input) {
            processCommand(input);
            if (verbInput) {
                verbInput.textContent = '';
                verbInput.innerText = '';
            }
        }
    };
    
    // Prevent Enter from creating new lines in contenteditable and trigger handleInput instead
    verbInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInput();
        }
    });
    const hasWord = (word, text) => {
        if (!word || !text) return false;
        const normalizedWord = word.toLowerCase().trim();
        const normalizedText = text.toLowerCase();
        let index = normalizedText.indexOf(normalizedWord);
        while (index !== -1) {
            const charBefore = index > 0 ? normalizedText[index - 1] : ' ';
            const charAfter = index + normalizedWord.length < normalizedText.length ? normalizedText[index + normalizedWord.length] : ' ';
            const isBoundary = (char) => /[^a-zA-Z0-9áéíóúàèìòùâêîôûãõç]/.test(char);
            if (isBoundary(charBefore) && isBoundary(charAfter)) return true;
            index = normalizedText.indexOf(normalizedWord, index + 1);
        }
        return false;
    };

    const processCommand = (input) => {
        const inputLower = input.toLowerCase().trim();
        const echo = document.createElement('p'); echo.className = 'verb-echo'; echo.textContent = '> ' + input; sceneDescription.appendChild(echo);
        sceneDescription.scrollTop = sceneDescription.scrollHeight; actionLog.push({ type: 'input', text: '> ' + input });
        const scene = findScene(currentSceneId) || (gameData.cenas && gameData.cenas[currentSceneId]) || (gameData.scenes && gameData.scenes[currentSceneId]) || {}; 
        const sceneObjects = getObjectsForScene(currentSceneId); 
        for (const fv of (gameData.fixedVerbs || [])) { if (fv.verbs.some(v => hasWord(v, inputLower))) { printOutput(fv.description); return; } }
        if (gameData.enableDiceRoll) {
            const diceTriggerWords = ['rolar', 'dado', 'rolar dado', 'rolardado', 'd6', 'd20'];
            if (diceTriggerWords.some(w => hasWord(w, inputLower))) {
                triggerDiceRoll(scene);
                return;
            }
        }

        const sceneInteractions = (scene && scene.interactions) ? scene.interactions : [];

        let foundInteraction = sceneInteractions.find(i => {
            if (!i.verbs.some(v => hasWord(v, inputLower))) return false;
            if (i.requiresInInventory) {
                const reqObj = inventory.find(o => o.id === i.requiresInInventory);
                if (!reqObj) return false;
                if (!hasWord(reqObj.name.toLowerCase(), inputLower)) return false;
            }
            if (i.target) {
                const obj = sceneObjects.find(o => i.target === o.id) || inventory.find(o => o.id === i.target);
                if (!obj) return false;
                return hasWord(obj.name.toLowerCase(), inputLower);
            }
            const anyObjectMentioned = [...sceneObjects, ...inventory]
                .filter(o => o.id !== i.requiresInInventory)
                .some(o => hasWord(o.name.toLowerCase(), inputLower));
            return !anyObjectMentioned;
        });
        if (!foundInteraction) {
            foundInteraction = sceneInteractions.find(i => {
                if (!i.verbs.some(v => hasWord(v, inputLower))) return false;
                if (i.requiresInInventory) {
                    const reqObj = inventory.find(o => o.id === i.requiresInInventory);
                    if (!reqObj) return false;
                    if (!hasWord(reqObj.name.toLowerCase(), inputLower)) return false;
                }
                if (i.target) return false;
                return true;
            });
        }
        if (foundInteraction) { executeInteraction(foundInteraction); return; }
        if (hasWord('inventario', inputLower) || hasWord('i', inputLower)) { 
            if (gameData.enableInventory) { actionPopup.classList.add('hidden'); activePopupType = null; togglePopup('inventory'); }
            else { printOutput("O sistema de inventário está desativado."); }
            return; 
        }
        const lookVerbs = ['olhar', 'examinar', 'ver', 'ler'];
        if (lookVerbs.some(v => hasWord(v, inputLower))) {
             const obj = sceneObjects.find(o => hasWord(o.name.toLowerCase(), inputLower)) || inventory.find(o => hasWord(o.name.toLowerCase(), inputLower));
             if (obj) { printOutput(obj.examineDescription); return; }
             printOutput(scene.description); return;
        }
        printOutput((scene && scene.negativeFeedback) || gameData.mensagem_falha_padrao || "Não aconteceu nada.");
    };

    const matchDiceVerb = (verbStr, rollResult) => {
        if (!verbStr) return false;
        const v = verbStr.trim().toLowerCase();
        if (!v.startsWith('dice:')) return false;
        const valStr = v.substring(5).trim();
        if (valStr.includes('-')) {
            const parts = valStr.split('-');
            const min = parseInt(parts[0], 10);
            const max = parseInt(parts[1], 10);
            if (!isNaN(min) && !isNaN(max)) {
                return rollResult >= min && rollResult <= max;
            }
        }
        if (valStr.includes('..')) {
            const parts = valStr.split('..');
            const min = parseInt(parts[0], 10);
            const max = parseInt(parts[1], 10);
            if (!isNaN(min) && !isNaN(max)) {
                return rollResult >= min && rollResult <= max;
            }
        }
        const exact = parseInt(valStr, 10);
        if (!isNaN(exact)) {
            return rollResult === exact;
        }
        return false;
    };

    const playDiceRollOverlayAnimation = (diceType, finalResult, isSuccess, statusText, callback) => {
        const descContainer = document.getElementById('scene-description') || document.body;
        let overlay = document.getElementById('dice-roll-overlay');
        const diceSvgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dices" style="display:inline-block;vertical-align:middle;width:48px;height:48px;"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3.17l-4.25-4.25a2.24 2.24 0 0 0-3.17 0L10.5 6.58"/><path d="m6 18 4-4"/><path d="m14 10 4-4"/><path d="M7 14h.01"/><path d="M11 18h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>';
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'dice-roll-overlay';
            overlay.className = 'dice-roll-overlay';
            overlay.innerHTML = '<div class="dice-roll-box">' +
                '<div class="dice-roll-icon">' + diceSvgIcon + '</div>' +
                '<div class="dice-roll-number" id="dice-roll-number">?</div>' +
                '<div class="dice-roll-status" id="dice-roll-status"></div>' +
            '</div>';
            descContainer.appendChild(overlay);
        } else {
            if (overlay.parentNode !== descContainer) {
                descContainer.appendChild(overlay);
            }
            overlay.classList.remove('hidden');
        }

        const numberEl = overlay.querySelector('#dice-roll-number');
        const statusEl = overlay.querySelector('#dice-roll-status');
        if (numberEl) {
            numberEl.classList.remove('roll-final');
            numberEl.textContent = '?';
        }
        if (statusEl) {
            statusEl.classList.remove('roll-final', 'status-success', 'status-failure');
            statusEl.textContent = '';
        }

        const maxVal = diceType === 'd6' ? 6 : 20;
        let iterations = 0;
        const maxIterations = 12;
        const interval = setInterval(() => {
            iterations++;
            const randomVal = Math.floor(Math.random() * maxVal) + 1;
            if (numberEl) numberEl.textContent = randomVal;

            if (iterations >= maxIterations) {
                clearInterval(interval);
                if (numberEl) {
                    numberEl.textContent = finalResult;
                    numberEl.classList.add('roll-final');
                }
                if (statusEl && statusText) {
                    statusEl.textContent = statusText;
                    statusEl.className = 'dice-roll-status roll-final ' + (isSuccess ? 'status-success' : 'status-failure');
                }
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    if (callback) callback();
                }, 1600);
            }
        }, 60);
    };

    const triggerDiceRoll = (scene) => {
        if (isPrinting) return;
        const diceType = gameData.diceType || 'd20';
        const maxVal = diceType === 'd6' ? 6 : 20;
        const rollResult = Math.floor(Math.random() * maxVal) + 1;
        const prefix = gameData.diceRollTextPrefix || 'Você tirou';

        const config = (scene && scene.allowDiceRollInScene && scene.diceRollConfig) ? scene.diceRollConfig : null;
        const cutoff = config ? (config.cutoffValue || (diceType === 'd6' ? 4 : 10)) : (diceType === 'd6' ? 4 : 10);
        const isSuccess = rollResult >= cutoff;
        const statusText = isSuccess ? ((config && config.successText) || 'Sucesso!') : ((config && config.failureText) || 'Falha!');
        const inputEchoText = '> ' + statusText;

        playDiceRollOverlayAnimation(diceType, rollResult, isSuccess, statusText, () => {
            const resultText = '> ' + prefix + ' ' + rollResult;
            
            // Output dice result (> Você tirou X) in origin scene description and actionLog
            const echo = document.createElement('p');
            echo.className = 'verb-echo';
            echo.textContent = resultText;
            sceneDescription.appendChild(echo);
            sceneDescription.scrollTop = sceneDescription.scrollHeight;
            actionLog.push({ type: 'input', text: resultText });

            const targetInteractions = (scene && scene.interactions) ? scene.interactions : [];

            let targetVerb = null;
            if (config) {
                if (isSuccess) {
                    targetVerb = config.successVerb;
                } else {
                    targetVerb = config.failureVerb;
                }
            }

            let matched = null;
            if (targetVerb) {
                const normalizedTarget = targetVerb.trim().toLowerCase();
                matched = targetInteractions.find(i => {
                    return (i.verbs || []).some(v => v.trim().toLowerCase() === normalizedTarget);
                });
            }

            if (!matched) {
                matched = targetInteractions.find(i => {
                    return (i.verbs || []).some(v => matchDiceVerb(v, rollResult));
                });
            }

            if (matched) {
                executeInteraction(matched, inputEchoText);
            } else {
                const statusEcho = document.createElement('p');
                statusEcho.className = 'verb-echo';
                statusEcho.textContent = inputEchoText;
                sceneDescription.appendChild(statusEcho);
                sceneDescription.scrollTop = sceneDescription.scrollHeight;
                actionLog.push({ type: 'input', text: inputEchoText });
            }
        });
    };

    const executeInteraction = (interaction, inputEchoText = null) => {
        if (interaction.consumesItem && interaction.requiresInInventory) { removeFromInventory(interaction.requiresInInventory); }
        if (interaction.trackerEffects) updateTrackers(interaction.trackerEffects);
        if (interaction.addsToInventory && interaction.target) {
            const objInScene = getObjectsForScene(currentSceneId).find(o => o.id === interaction.target);
            if (objInScene) { 
                addToInventory(objInScene); 
                flagObjectAsRemoved(currentSceneId, objInScene.id); 
                // NEW: Trigger centered object image popup
                if (interaction.showObjectImage) {
                    openAcquisitionModal(objInScene, interaction.successMessage);
                }
            }
        } else if (interaction.removesTargetFromScene && interaction.target) flagObjectAsRemoved(currentSceneId, interaction.target);
        if (interaction.soundEffect) playSound(interaction.soundEffect);
        if (interaction.goToScene) loadScene(interaction.goToScene, true, interaction.transitionType, interaction.transitionSpeed, interaction.successMessage, inputEchoText);
        else {
            const scene = gameData.cenas[currentSceneId];
            if (interaction.newSceneDescription) { 
                if (interaction.successMessage) scene.description = interaction.successMessage + "\\n\\n" + interaction.newSceneDescription;
                else scene.description = interaction.newSceneDescription;
                renderScene(scene, null, inputEchoText); 
            } else if (interaction.successMessage) {
                if (inputEchoText) {
                    const formattedInput = inputEchoText.trim().startsWith('>') ? inputEchoText.trim() : ('> ' + inputEchoText.trim());
                    const echo = document.createElement('p');
                    echo.className = 'verb-echo';
                    echo.textContent = formattedInput;
                    sceneDescription.appendChild(echo);
                    actionLog.push({ type: 'input', text: formattedInput });
                }
                printOutput(interaction.successMessage);
            } else if (inputEchoText) {
                const formattedInput = inputEchoText.trim().startsWith('>') ? inputEchoText.trim() : ('> ' + inputEchoText.trim());
                const echo = document.createElement('p');
                echo.className = 'verb-echo';
                echo.textContent = formattedInput;
                sceneDescription.appendChild(echo);
                actionLog.push({ type: 'input', text: formattedInput });
            }
        }
    };

    const printOutput = (text) => {
        const textAnimType = gameData.gameTextAnimationType || 'fade';
        const p = document.createElement('p'); 
        const formattedHTML = formatText(text);
        actionLog.push({ type: 'output', text: text });
        if (textAnimType === 'typewriter') {
            isPrinting = true;
            sceneDescription.classList.add('typewriting-active');
            p.className = 'scene-paragraph typewriter-cursor'; 
            p.style.opacity = '1'; 
            p.innerHTML = window.safeHTML(formattedHTML, { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] }); 
            sceneDescription.appendChild(p);
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
            let node; const textNodes = []; while((node = walker.nextNode())) textNodes.push(node);
            const fullTexts = textNodes.map(n => n.nodeValue); textNodes.forEach(n => n.nodeValue = '');
            let nodeIdx = 0; let charIdx = 0;
            const type = () => {
                if (nodeIdx >= textNodes.length) { 
                    p.classList.remove('typewriter-cursor'); setupHighlights(p); isPrinting = false;
                    sceneDescription.classList.remove('typewriting-active');
                    sceneDescription.scrollTop = sceneDescription.scrollHeight; verbInput.focus();
                    return; 
                }
                const currentNode = textNodes[nodeIdx]; const fullText = fullTexts[nodeIdx];
                if (charIdx < fullText.length) { currentNode.nodeValue += fullText[charIdx]; charIdx++; if (sceneDescription) sceneDescription.scrollTop = sceneDescription.scrollHeight; setTimeout(type, typeSpeedBase); }
                else { nodeIdx++; charIdx = 0; type(); }
            };
            type();
            type();
        } else {
            // Also respecting session ID for safety though printOutput is usually atomic-ish or one-off
            if (textAnimType === 'typewriter') {
                 // Already handled by if block above
            } else {
                p.innerHTML = window.safeHTML(formattedHTML, { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
                p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); sceneDescription.scrollTop = sceneDescription.scrollHeight;
            }
        }
    };

    const findItemInInventoryById = (id) => inventory.find(o => o.id === id) || null;
    const addToInventory = (obj) => { if (!inventory.some(o => o.id === obj.id)) inventory.push(obj); };
    const removeFromInventory = (id) => { inventory = inventory.filter(i => i.id !== id); };
    
    const togglePopup = (type) => { 
        if (!actionPopup.classList.contains('hidden') && activePopupType === type) { 
            actionPopup.classList.add('hidden'); 
            activePopupType = null;
        } else { 
            if (type === 'suggestions') showSuggestions(); 
            if (type === 'inventory') showInventory(); 
            activePopupType = type;
        } 
    };

    const showSuggestions = () => {
        actionPopup.classList.remove('hidden'); 
        actionPopup.innerHTML = '';
        const currentSceneData = findScene(currentSceneId) || (gameData.cenas && gameData.cenas[currentSceneId]) || (gameData.scenes && gameData.scenes[currentSceneId]) || {};
        const sceneSuggestions = currentSceneData.suggestions || [];
        
        const container = document.createElement('div'); 
        container.className = 'action-popup-container';
        
        if (sceneSuggestions.length === 0) {
            const row1 = document.createElement('div'); 
            row1.className = 'action-popup-row empty-inventory-msg mb-2 text-center text-sm font-medium text-zinc-400 p-4';
            row1.textContent = gameData.gameSuggestionsEmptyFeedback || 'não há sugestões';
            container.appendChild(row1);
        } else {
            const row1 = document.createElement('div'); 
            row1.className = 'action-popup-row max-w-full flex-wrap justify-start';
            sceneSuggestions.forEach(v => { 
                const btn = document.createElement('button'); 
                btn.textContent = v; 
                btn.addEventListener('click', () => { 
                    verbInput.textContent = v.toLowerCase() + ' '; 
                    verbInput.focus(); 
                    // Move cursor to end of contenteditable
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(verbInput);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    actionPopup.classList.add('hidden'); 
                    activePopupType = null; 
                }); 
                row1.appendChild(btn); 
            });
            container.appendChild(row1); 
        }
        actionPopup.appendChild(container);

        const suggBtn = document.getElementById('suggestions-button');
        const actionBtns = document.querySelector('.action-buttons');
        if (suggBtn && actionBtns && document.getElementById('hypercard-center-bar')) {
            const centerOffset = suggBtn.offsetLeft + (suggBtn.offsetWidth / 2);
            actionPopup.style.setProperty('left', centerOffset + 'px', 'important');
            actionPopup.style.setProperty('transform', 'translateX(-50%)', 'important');
            actionPopup.style.setProperty('top', 'calc(100% + 8px)', 'important');
        } else {
            actionPopup.style.removeProperty('left');
            actionPopup.style.removeProperty('transform');
            actionPopup.style.removeProperty('top');
        }
    };
    const showInventory = () => {
        actionPopup.classList.remove('hidden'); actionPopup.innerHTML = ''; 
        const container = document.createElement('div'); container.className = 'action-popup-container';
        if (inventory.length === 0) { 
            const msg = document.createElement('div'); 
            msg.className = 'empty-inventory-msg';
            msg.textContent = gameData.gameInventoryEmptyFeedback || 'não há itens no inventário'; 
            container.appendChild(msg); 
        }
        else { 
            const list = document.createElement('div');
            list.className = 'action-popup-list';
            inventory.forEach(item => { 
                const btn = document.createElement('button'); 
                btn.textContent = item.name; 
                btn.addEventListener('click', () => { 
                    openItemModal(item); 
                    actionPopup.classList.add('hidden'); 
                    activePopupType = null; 
                }); 
                list.appendChild(btn); 
            }); 
            container.appendChild(list);
        }
        actionPopup.appendChild(container);

        const invBtn = document.getElementById('inventory-button');
        const actionBtns = document.querySelector('.action-buttons');
        if (invBtn && actionBtns && document.getElementById('hypercard-center-bar')) {
            const centerOffset = invBtn.offsetLeft + (invBtn.offsetWidth / 2);
            actionPopup.style.setProperty('left', centerOffset + 'px', 'important');
            actionPopup.style.setProperty('transform', 'translateX(-50%)', 'important');
            actionPopup.style.setProperty('top', 'calc(100% + 8px)', 'important');
        } else {
            actionPopup.style.removeProperty('left');
            actionPopup.style.removeProperty('transform');
            actionPopup.style.removeProperty('top');
        }
    };



    const showTrackers = () => {
        trackersContent.innerHTML = '';
        const definitions = gameData.consequenceTrackers || [];
        if (definitions.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'text-center text-zinc-400 p-4';
            msg.textContent = 'Não há rastreadores ativos';
            trackersContent.appendChild(msg);
        } else {
            definitions.forEach(def => {
                const currentVal = trackers[def.id] || 0;
                const percentage = Math.min(100, Math.max(0, (currentVal / def.maxValue) * 100));
                const barColor = def.barColor || '#ffffff';
                const item = document.createElement('div');
                item.className = 'tracker-item';
                
                item.innerHTML = window.safeHTML(
                    '<div class="tracker-item-header">' +
                        '<span class="tracker-item-name">' + def.name + '</span>' +
                        (!def.hideValue ? '<span class="tracker-item-values">' + currentVal + ' / ' + def.maxValue + '</span>' : '') +
                    '</div>' +
                    '<div class="tracker-bar-container">' +
                        '<div class="tracker-bar" style="width: ' + percentage + '%; background-color: ' + barColor + '; margin-left: ' + (def.invertBar ? 'auto' : '0') + '"></div>' +
                    '</div>'
                , { ADD_ATTR: ['style'] });
                trackersContent.appendChild(item);
            });
        }
        trackersModal.classList.remove('hidden');
    };

    const openItemModal = (item) => {
        if (!itemModal) return;
        const modalContent = itemModal.querySelector('.modal-content') || itemModal;
        if (itemModalName) itemModalName.textContent = item.name;
        if (itemModalDescription) {
            itemModalDescription.innerHTML = window.safeHTML(formatText(item.examineDescription || ''), { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
            setupHighlights(itemModalDescription);
        }
        if (itemModalImageContainer && itemModalImage) {
            if (item.image) {
                itemModalImage.src = item.image;
                itemModalImageContainer.classList.remove('hidden');
                modalContent.classList.add('has-image');
                itemModalImageContainer.onclick = (e) => {
                    e.stopPropagation();
                    showImageLightbox(item.image);
                };
            } else {
                itemModalImage.src = '';
                itemModalImageContainer.classList.add('hidden');
                modalContent.classList.remove('has-image');
                itemModalImageContainer.onclick = null;
            }
        }
        itemModal.classList.remove('hidden');
    };
    const openAcquisitionModal = (item, customDescription) => {
        if (!acquisitionModal) return;
        acquisitionModalTitle.textContent = item.name;
        acquisitionModalDescription.innerHTML = window.safeHTML(formatText(customDescription || item.examineDescription || ''), { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
        setupHighlights(acquisitionModalDescription);
        if (item.image && acquisitionModalImageContainer && acquisitionModalImage) {
            acquisitionModalImage.src = item.image;
            acquisitionModalImageContainer.classList.remove('hidden');
            acquisitionModalImageContainer.onclick = (e) => {
                e.stopPropagation();
                showImageLightbox(item.image);
            };
        } else if (acquisitionModalImageContainer) {
            acquisitionModalImageContainer.classList.add('hidden');
            acquisitionModalImageContainer.onclick = null;
        }
        acquisitionModal.classList.remove('hidden');
    };

    const toggleSystemMenu = () => {
        if (!systemModal) return;
        if (!systemModal.classList.contains('hidden')) {
            systemModal.classList.add('hidden');
        } else {
            if (systemMenuMain) systemMenuMain.classList.remove('hidden');
            if (systemSlotsContainer) systemSlotsContainer.classList.add('hidden');
            if (systemModalTitle) systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema';
            systemModal.classList.remove('hidden');
        }
    };

    const showDiary = (isConclusion = false) => {
        if (!diaryModal || !diaryLog) return;
        diaryLog.innerHTML = '';
        
        const diaryTitle = document.getElementById('diary-modal-title');
        if (diaryTitle) {
            diaryTitle.style.display = isConclusion ? 'none' : 'block';
        }

        // Show Stats if triggered from conclusion
        if (isConclusion) {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'diary-stats-container';
            
            const totalScenesCount = Object.keys(gameData.cenas).length;
            const visitedCount = visitedScenes.length;
            
            let timeStr = "0s";
            if (gameStartTime && gameEndTime) {
                const totalSeconds = Math.floor((gameEndTime - gameStartTime) / 1000);
                const hrs = Math.floor(totalSeconds / 3600);
                const mins = Math.floor((totalSeconds % 3600) / 60);
                const secs = totalSeconds % 60;
                
                if (hrs > 0) timeStr = hrs + "h " + mins + "m " + secs + "s";
                else if (mins > 0) timeStr = mins + "m " + secs + "s";
                else timeStr = secs + "s";
            }

            let totalWords = 0;
            actionLog.forEach(entry => {
                if (entry.type === 'scene' && entry.description) {
                    totalWords += entry.description.split(/\\s+/).filter(Boolean).length;
                } else if (entry.type === 'output' && entry.text) {
                    totalWords += entry.text.split(/\\s+/).filter(Boolean).length;
                }
            });

            statsContainer.innerHTML = window.safeHTML(
                '<div class="diary-stat-box">' +
                    '<span class="diary-stat-label">' + gameData.gameTranslations.stats_visited + '</span>' +
                    '<span class="diary-stat-value">' + visitedCount + ' / ' + totalScenesCount + ' ' + gameData.gameTranslations.of_scenes + '</span>' +
                '</div>' +
                '<div class="diary-stat-box">' +
                    '<span class="diary-stat-label">' + gameData.gameTranslations.stats_time + '</span>' +
                    '<span class="diary-stat-value">' + timeStr + '</span>' +
                '</div>' +
                '<div class="diary-stat-box">' +
                    '<span class="diary-stat-label">' + gameData.gameTranslations.total_words_read + '</span>' +
                    '<span class="diary-stat-value">' + totalWords + '</span>' +
                '</div>'
            );
            diaryLog.appendChild(statsContainer);
        }

        let currentInterContainer = null;
        let currentImagesCol = null;

        for (let i = 0; i < actionLog.length; i++) {
            const entry = actionLog[i];
            if (entry.type === 'scene') {
                const div = document.createElement('div'); div.className = 'diary-entry';
                
                const imagesCol = document.createElement('div');
                imagesCol.className = 'diary-images-column';
                if (entry.image) {
                    const img = document.createElement('img');
                    img.className = 'diary-main-image';
                    img.src = entry.image;
                    img.style.cursor = 'zoom-in';
                    img.title = 'Clique para ampliar';
                    img.onclick = () => showImageLightbox(entry.image);
                    imagesCol.appendChild(img);
                }
                div.appendChild(imagesCol);
                currentImagesCol = imagesCol;

                const txt = document.createElement('div'); txt.className = 'text-container'; 
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'scene-name';
                nameSpan.textContent = entry.name || '';
                txt.appendChild(nameSpan);

                if (i + 1 < actionLog.length && actionLog[i + 1].type === 'input' && actionLog[i + 1].isLeadInput) {
                    const leadInputP = document.createElement('p');
                    leadInputP.className = 'diary-input';
                    leadInputP.textContent = actionLog[i + 1].text;
                    txt.appendChild(leadInputP);
                    i++;
                }

                if (entry.description) {
                    const descP = document.createElement('p');
                    descP.innerHTML = window.safeHTML(formatText(entry.description || ''), { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
                    txt.appendChild(descP);
                }

                div.appendChild(txt);
                diaryLog.appendChild(div);
                setupHighlights(txt);
                currentInterContainer = document.createElement('div');
                currentInterContainer.className = 'diary-interactions-container';
                txt.appendChild(currentInterContainer);
            } else {
                if (currentInterContainer) {
                    if (entry.type === 'output' && entry.image && currentImagesCol) {
                        const subImg = document.createElement('img');
                        subImg.className = 'diary-examine-image';
                        subImg.src = entry.image;
                        subImg.style.cursor = 'zoom-in';
                        subImg.title = 'Clique para ampliar';
                        subImg.onclick = () => showImageLightbox(entry.image);
                        currentImagesCol.appendChild(subImg);
                    }
                    if (entry.text) {
                        const p = document.createElement('p');
                        p.className = 'diary-' + entry.type; 
                        if (entry.type === 'output') {
                            p.innerHTML = window.safeHTML(formatText(entry.text), { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] });
                            setupHighlights(p);
                        } else {
                            p.textContent = entry.text;
                        }
                        currentInterContainer.appendChild(p);
                    }
                }
            }
        }
        diaryModal.classList.remove('hidden'); 
        setTimeout(() => { 
            diaryLog.scrollTop = isConclusion ? 0 : diaryLog.scrollHeight; 
        }, 10);
    };
    try {
        init();
        if (gameData.enableSystemMenu && !window.isSceneTest && document.getElementById('start-screen')) {
            showStartScreen(true);
        } else {
            startGame();
        }
    } catch (e) {
        console.error("Initialization error:", e);
        try { init(); startGame(); } catch (err) {}
    }
});
