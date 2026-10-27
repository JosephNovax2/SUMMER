// ===== จุดเริ่มต้นของเว็บ =====
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/effects.css';
import './styles/season.css';

import { init } from './lib/store.js';
import { restoreSession } from './lib/auth.js';
import { installGlobalSounds } from './lib/sound.js';
import { initLayout } from './ui/layout.js';
import { initRouter } from './ui/router.js';
import { initEffects } from './ui/effects.js';
import { applySeason, decorateSeason } from './ui/season.js';
import { initCutsceneLogo, playIntro } from './ui/cutscene.js';
import { initCardSections } from './sections/cards.js';
import { initHome } from './sections/home.js';
import { initFarm } from './sections/farm.js';
import { initEvents } from './sections/events.js';
import { initGkey } from './sections/gkey.js';
import { initGacha, openShop } from './sections/gacha.js';
import { initMail, openMail } from './sections/mail.js';

applySeason();

playIntro(async () => {
    installGlobalSounds();
    initLayout({ onOpenMail: openMail, onOpenShop: openShop });
    initRouter();
    initEffects();
    decorateSeason();
    initCutsceneLogo();

    initHome();
    initFarm();
    initCardSections();
    initEvents();
    initGkey();
    initGacha();
    initMail();

    await init();
    await restoreSession();
});
