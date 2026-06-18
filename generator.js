const adjectives = [
    "brave","calm","clever","clumsy","eager","fierce","gentle","happy","jolly","kind",
    "lazy","proud","silly","swift","wild","ancient","bright","cold","dark","deep",
    "fuzzy","heavy","hidden","liquid","mystic","neon","shiny","silent","solid","warm",
    "cosmic","digital","funky","giant","magic","purple","quiet","rapid","secret","tiny",
    "angry","hungry","sleepy","lucky","grumpy","brawny","fancy","quirky","zesty","icy",
    "bitter","bland","spicy","sweet","tart","bold","bossy","brazen","chill","crazy",
    "dizzy","dopey","edgy","epic","fatal","fiery","flaky","fluid","flying","frozen",
    "glass","golden","grand","grassy","greedy","guilty","hairy","hardy","hasty","hollow",
    "holy","humble","inner","iron","juicy","keen","lawful","leafy","lethal","light",
    "lonely","loose","lunar","mad","major","mellow","mighty","molten","mortal","muddy",
    "narrow","noble","odd","outer","pale","plain","polar","primal","raw","regal",
    "rigid","rough","royal","rusty","sacred","salty","sandy","savage","scarce","shady",
    "sharp","shy","sleek","slim","smart","smoky","snowy","solar","sour","spare",
    "stable","stark","steady","steep","sticky","stiff","stony","stormy","strong","subtle",
    "sunny","tense","thick","thin","tight","tired","tough","toxic","tricky","ugly",
    "ultra","unique","urban","vacant","vague","vast","velvet","vivid","vocal","wavy",
    "weak","weird","wicked","windy","witty","wooden","worthy","young","astral","atomic",
    "azure","binary","bleak","blunt","broken","brutal","cheap","civil","clean","clear",
    "cozy","cruel","cubic","curly","damp","dense","dire","divine","dreamy","dusty",
    "eerie","elder","empty","exact","exotic","faint","fair","final","firm","flat",
    "foggy","foul","fragile","frank","fresh","global","glossy","gloomy","graceful","grim",
    "handy","harsh","hazy","hefty","honest","humid","ideal","ivory","jagged","jumbo",
    "large","lavish","lean","level","lively","livid","loyal","lush","marble","marine",
    "massive","mature","meager","mental","merry","mild","mini","mobile","modern","modest",
    "moody","muted","naive","nasty","native","nervy","nimble","normal","novel","opaque"
];

const nouns = [
    "alien","bear","cat","dog","dragon","eagle","fox","ghost","knight","ninja",
    "pirate","robot","shark","tiger","wizard","castle","cloud","comet","forest","galaxy",
    "moon","mountain","ocean","planet","river","rock","star","sun","tree","volcano",
    "apple","coffee","diamond","guitar","hammer","laptop","pencil","pizza","rocket","sword",
    "bridge","clock","engine","lantern","mirror","puzzle","shield","statue","temple","window",
    "anchor","armor","arrow","badge","baker","barrel","basket","battle","beacon","beast",
    "beetle","blade","blanket","block","board","boat","bone","book","bottle","brain",
    "branch","bread","brick","bronze","brush","bubble","bucket","buffer","bullet","button",
    "cabin","cable","camera","camp","candle","canvas","carbon","card","carpet","cedar",
    "chain","chalk","cherry","circle","cliff","cobra","coral","crane","crater","creek",
    "crown","crystal","curtain","dagger","desert","dome","drift","drum","dungeon","ember",
    "falcon","feather","flame","flask","flint","flute","fossil","fountain","furnace","glacier",
    "globe","gorge","grain","grape","harbor","hawk","helmet","heron","hive","honey",
    "horizon","hunter","iceberg","insect","iris","island","ivory","jackal","jade","jaguar",
    "jungle","kernel","kettle","kite","ladder","lava","legend","lemur","lever","lily",
    "lion","lizard","lodge","lotus","magnet","mango","manor","maple","marsh","meadow",
    "medal","melon","meteor","mill","mint","moat","monkey","mosaic","moth","mural",
    "nectar","needle","nest","olive","onion","orchid","otter","paddle","palace","palm",
    "panther","parrot","peach","pebble","pelican","pepper","petal","phoenix","pillar","plank",
    "plaza","plume","pocket","pollen","pond","portal","potion","prism","python","quartz",
    "rabbit","radar","raven","reef","ribbon","ridge","saddle","sage","salmon","sapphire",
    "scroll","serpent","shadow","shell","siren","skull","slate","sloth","snail","sphinx",
    "spiral","sponge","sprout","squirrel","stallion","steam","summit","swan","tablet","talon",
    "thorn","timber","token","torch","tower","trail","trident","trophy","tunnel","turtle",
    "tusk","valve","vapor","vessel","viper","walrus","wheat","whistle","willow","wraith"
];

const verbs = [
    "builds","crawls","dances","dreams","drinks","eats","explores","flies","hides","jumps",
    "laughs","learns","plays","reads","runs","sings","sleeps","smiles","swims","walks",
    "bounces","catches","chases","climbs","creates","defends","dodges","draws","drops","finds",
    "fixes","floats","glides","guards","hunts","invents","kicks","lifts","paints","pulls",
    "pushes","rolls","seeks","shouts","spins","throws","travels","wanders","watches","whispers",
    "accepts","adapts","admits","allows","argues","arrives","attacks","avoids","awakes","bakes",
    "bends","bites","blames","blinks","boils","borrows","breaks","brings","brushes","burns",
    "buys","calls","carries","carves","causes","cheats","checks","chews","chooses","cleans",
    "clears","clicks","closes","collects","comes","cooks","counts","covers","cracks","cries",
    "crushes","curses","dashes","delays","deletes","denies","digs","dims","dives","donates",
    "doubles","drafts","drags","drains","drifts","drills","drives","drums","dries","dumps",
    "dusts","dwells","earns","echoes","edits","elects","emits","enjoys","enters","erases",
    "erupts","evades","exerts","exits","expands","expects","exports","extends","extracts","faces",
    "fades","fails","falls","farms","favors","fears","feeds","feels","fences","fetches",
    "fights","fills","filters","fires","flashes","flees","flicks","flings","flips","floods",
    "flows","folds","follows","forces","forges","forms","founds","frames","freezes","fries",
    "gains","gasps","gathers","gazes","grabs","grants","grasps","greets","grinds","grips",
    "groans","grows","guides","halts","handles","hangs","harbors","hardens","harms","harvests",
    "haunts","heals","heats","helps","hoards","holds","honors","hopes","hurls","ignites",
    "imports","imposes","infers","inflates","informs","inhales","injects","inputs","inserts","insists",
    "installs","intends","invades","issues","jabs","jams","joins","judges","keeps","kneels",
    "knits","knocks","labels","lands","lasts","launches","lays","leads","leaks","leaps",
    "leaves","lends","levels","limits","links","lists","loads","locks","logs","looks",
    "lowers","lurks","manages","maps","marks","matches","melts","mends","merges","mines",
    "mixes","molds","mounts","moves","mutes","names","nests","nods","notes","nurses"
];

const adverbs = [
    "badly","bravely","brightly","calmly","carefully","clearly","closely","darkly","easily","fast",
    "gladly","hardly","joyfully","loudly","madly","neatly","poorly","quickly","quietly","sadly",
    "safely","sharply","slowly","smoothly","softly","swiftly","wildly","wisely","today","tomorrow",
    "always","never","often","rarely","sometimes","upward","downward","forward","backward","inside",
    "outside","nearby","here","there","everywhere","nowhere","anywhere","somewhere","forever","soon",
    "abruptly","boldly","briefly","broadly","busily","cheaply","chiefly","cleanly","coldly","crossly",
    "cruelly","daily","dearly","deeply","dimly","directly","dryly","duly","evenly","exactly",
    "fairly","falsely","fatally","fiercely","firmly","fondly","freely","fully","gently","grandly",
    "greatly","grimly","grossly","highly","hotly","hugely","idly","justly","keenly","kindly",
    "lastly","lately","lightly","likely","limply","lively","loosely","mainly","meekly","merely",
    "mildly","mostly","namely","nearly","nicely","nimbly","nobly","oddly","only","openly",
    "overly","partly","plainly","poorly","purely","rarely","rashly","really","richly","rightly",
    "roughly","rudely","seldom","simply","slyly","solely","sorely","steeply","sternly","stiffly",
    "subtly","surely","sweetly","tautly","tensely","thickly","thinly","tightly","truly","twice",
    "unduly","vainly","vastly","warmly","weakly","wholly","widely","yearly","acidly","aimlessly",
    "angrily","blindly","bluntly","bossily","briskly","broadly","coarsely","coolly","coyly","deftly",
    "densely","dizzily","dreamily","drowsily","eagerly","edgily","emptily","faintly","finally","firstly",
    "flatly","fondly","frankly","freshly","frostily","funnily","fussily","gaily","gamely","garishly",
    "giddily","glibly","glumly","greedily","handily","happily","harshly","hastily","hazily","heftily",
    "icily","inertly","jauntily","jointly","knavishly","largely","laxly","lazily","leanly","legally",
    "loftily","lovingly","lowly","luckily","lustily","merrily","messily","moistly","morally","moodily",
    "morbidly","mystically","narrowly","nastily","natively","nervily","neutrally","newly","noisily","numbly",
    "obediently","obliquely","obtusely","officially","ominously","outwardly","painfully","palely","partially","passively",
    "patiently","pensively","playfully","politely","possibly","potently","precisely","primly","privately","promptly",
    "properly","publicly","quaintly","queasily","queerly","radiantly","randomly","rapidly","rawly","readily"
];

const symbols = ["!","@","#","$","%","^","&","*","?","~","-","+","=","_",":","<",">","{","}"];
const mutationCharsStandard = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const mutationCharsNoSimilar = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%^&*";

let settings = {
    excludeSimilar: localStorage.getItem('excludeSimilar') === 'true',
    hapticEnabled: localStorage.getItem('hapticEnabled') !== 'false',
    pinlockEnabled: localStorage.getItem('pinlockEnabled') !== 'false'
};

let isPasswordRevealed = false;
let revealTimeout = null;

const LENGTH_RANGES = {
    short:  { min: 15, max: 20 },
    medium: { min: 15, max: 25 },
    long:   { min: 25, max: 45 }
};

function getSecureRandomInt(max) {
    if (max <= 1) return 0;
    const randomBuffer = new Uint32Array(1);
    const limit = Math.floor(0xFFFFFFFF / max) * max;
    do {
        window.crypto.getRandomValues(randomBuffer);
    } while (randomBuffer[0] >= limit);
    return randomBuffer[0] % max;
}

function getRandom(arr) {
    return arr[getSecureRandomInt(arr.length)];
}

function mutateWord(word) {
    const mutationChars = settings.excludeSimilar ? mutationCharsNoSimilar : mutationCharsStandard;
    const numInsertions = 1 + getSecureRandomInt(3);
    let chars = word.split('');
    for (let i = 0; i < numInsertions; i++) {
        const pos = getSecureRandomInt(chars.length + 1);
        const c = mutationChars[getSecureRandomInt(mutationChars.length)];
        chars.splice(pos, 0, c);
    }
    return chars.join('');
}

function secureShuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = getSecureRandomInt(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generatePassword() {
    triggerHaptic();
    const complexity = document.querySelector('input[name="complexity"]:checked')?.value || 'medium';
    const { min: minLen, max: maxLen } = LENGTH_RANGES[complexity];
    const allPools = [adjectives, nouns, verbs, adverbs];

    const targetLen = minLen + getSecureRandomInt(maxLen - minLen + 1);

    let finalPassword = "";
    let wordCount = 0;
    const MAX_ATTEMPTS = 50;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const pool = allPools[getSecureRandomInt(allPools.length)];
        let word = getRandom(pool);
        word = mutateWord(word);
        word = word.split('').map(ch =>
            getSecureRandomInt(2) === 1 ? ch.toUpperCase() : ch.toLowerCase()
        ).join('');

        if (finalPassword.length > 0) {
            const sep = getSecureRandomInt(2) === 1
                ? getRandom(symbols)
                : String(getSecureRandomInt(10));
            const candidate = finalPassword + sep + word;
            if (candidate.length > maxLen) break;
            finalPassword = candidate;
        } else {
            if (word.length > maxLen) continue;
            finalPassword = word;
        }
        wordCount++;

        if (finalPassword.length >= targetLen) break;
    }

    while (finalPassword.length < minLen) {
        const mutationChars = settings.excludeSimilar ? mutationCharsNoSimilar : mutationCharsStandard;
        const padChar = mutationChars[getSecureRandomInt(mutationChars.length)];
        finalPassword += padChar;
    }

    if (finalPassword.length > maxLen) {
        finalPassword = finalPassword.slice(0, maxLen);
    }

    document.getElementById('passwordOutput').textContent = finalPassword;
    updateStrengthMeter(finalPassword.length, wordCount);
    hidePassword();
}

function updateStrengthMeter(length, wordCount) {
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');
    const subtext = document.getElementById('entropySubtext');

    const bitsPerWord = Math.log2(250)
        + Math.log2(2 * 70)
        + 5;
    const separatorBits = Math.log2(19 + 10);
    const suffixBits = Math.log2(1000) + Math.log2(19);

    const totalBits = Math.floor(
        (bitsPerWord * wordCount)
        + (separatorBits * (wordCount - 1))
        + suffixBits
    );

    subtext.textContent = `Length: ${length} | ~${totalBits} bits entropy`;

    if (totalBits < 50) {
        bar.style.width = '33%';
        bar.className = 'h-full transition-all duration-700 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
        text.textContent = 'Fair';
        text.className = 'text-[11px] font-bold text-rose-400 uppercase tracking-widest';
    } else if (totalBits < 70) {
        bar.style.width = '66%';
        bar.className = 'h-full transition-all duration-700 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]';
        text.textContent = 'Good';
        text.className = 'text-[11px] font-bold text-amber-400 uppercase tracking-widest';
    } else {
        bar.style.width = '100%';
        bar.className = 'h-full transition-all duration-700 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
        text.textContent = 'Strong';
        text.className = 'text-[11px] font-bold text-emerald-400 uppercase tracking-widest';
    }
}

function showToast(message) {
    const existing = document.getElementById('toastMsg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl shadow-2xl font-medium text-sm flex items-center gap-3';
    toast.innerHTML = `
        <div class="bg-indigo-500 p-1 rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        ${message}
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function copyToClipboard() {
    triggerHaptic();
    const textToCopy = document.getElementById('passwordOutput').textContent;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Password copied to clipboard!');
            addToHistory(textToCopy);
        }).catch(() => fallbackCopy(textToCopy));
    } else {
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text) {
    const hiddenInput = document.getElementById('hiddenCopyInput');
    hiddenInput.value = text;
    hiddenInput.classList.remove('hidden');
    hiddenInput.select();
    hiddenInput.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        showToast('Password copied to clipboard!');
        addToHistory(text);
    } catch (err) {
        showToast('Failed to copy. Please select and copy manually.');
    }
    hiddenInput.classList.add('hidden');
    window.getSelection().removeAllRanges();
}

function triggerHaptic() {
    if (settings.hapticEnabled && navigator.vibrate) {
        navigator.vibrate(10);
    }
}

function toggleTheme() {
    triggerHaptic();
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    if (current === 'light') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    updateSettingsUI();
}

function revealPassword() {
    if (!settings.pinlockEnabled) return;
    triggerHaptic();
    const overlay = document.getElementById('pinlockOverlay');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.getElementById('passwordOutput').classList.remove('pw-hidden');
    isPasswordRevealed = true;

    clearTimeout(revealTimeout);
    revealTimeout = setTimeout(() => {
        hidePassword();
    }, 5000);
}

function hidePassword() {
    if (!settings.pinlockEnabled) return;
    const overlay = document.getElementById('pinlockOverlay');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.getElementById('passwordOutput').classList.add('pw-hidden');
    isPasswordRevealed = false;
    clearTimeout(revealTimeout);
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('passwordHistory') || '[]');
    } catch {
        return [];
    }
}

function addToHistory(password) {
    if (!password || password === 'Loading...') return;
    let history = getHistory();
    history = history.filter(p => p !== password);
    history.unshift(password);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('passwordHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    const history = getHistory();

    if (history.length === 0) {
        list.innerHTML = '<div class="p-4 text-center text-slate-500 text-sm">No passwords saved yet</div>';
        return;
    }

    list.innerHTML = history.map((password, i) => `
        <div class="history-item flex items-center justify-between gap-2" onclick="copyFromHistory(${i})">
            <span class="truncate flex-1" style="color: var(--text-primary);">${escapeHtml(password)}</span>
            <span class="text-xs text-slate-500 flex-shrink-0">${i + 1}</span>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyFromHistory(index) {
    triggerHaptic();
    const history = getHistory();
    if (history[index]) {
        const hiddenInput = document.getElementById('hiddenCopyInput');
        hiddenInput.value = history[index];
        hiddenInput.classList.remove('hidden');
        hiddenInput.select();
        hiddenInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        hiddenInput.classList.add('hidden');
        window.getSelection().removeAllRanges();
        showToast('Password copied!');
    }
    closePanels();
}

function clearHistory() {
    triggerHaptic();
    localStorage.removeItem('passwordHistory');
    renderHistory();
    showToast('History cleared');
}

function openHistory() {
    triggerHaptic();
    renderHistory();
    document.getElementById('historyPanel').classList.add('open');
    document.getElementById('panelBackdrop').classList.add('open');
}

function openSettings() {
    triggerHaptic();
    updateSettingsUI();
    document.getElementById('settingsPanel').classList.add('open');
    document.getElementById('panelBackdrop').classList.add('open');
}

function closePanels() {
    document.getElementById('historyPanel').classList.remove('open');
    document.getElementById('settingsPanel').classList.remove('open');
    document.getElementById('panelBackdrop').classList.remove('open');
}

function updateSettingsUI() {
    const themeToggle = document.getElementById('themeToggleSetting');
    const excludeToggle = document.getElementById('excludeSimilarToggle');
    const hapticToggle = document.getElementById('hapticToggle');
    const pinlockToggle = document.getElementById('pinlockToggle');

    themeToggle.classList.toggle('active', document.documentElement.getAttribute('data-theme') === 'light');
    excludeToggle.classList.toggle('active', settings.excludeSimilar);
    hapticToggle.classList.toggle('active', settings.hapticEnabled);
    pinlockToggle.classList.toggle('active', settings.pinlockEnabled);
}

function toggleExcludeSimilar() {
    triggerHaptic();
    settings.excludeSimilar = !settings.excludeSimilar;
    localStorage.setItem('excludeSimilar', settings.excludeSimilar);
    updateSettingsUI();
    generatePassword();
}

function toggleHaptic() {
    settings.hapticEnabled = !settings.hapticEnabled;
    localStorage.setItem('hapticEnabled', settings.hapticEnabled);
    updateSettingsUI();
    if (settings.hapticEnabled) triggerHaptic();
}

function togglePinlock() {
    triggerHaptic();
    settings.pinlockEnabled = !settings.pinlockEnabled;
    localStorage.setItem('pinlockEnabled', settings.pinlockEnabled);
    updateSettingsUI();
    if (settings.pinlockEnabled) {
        hidePassword();
    } else {
        const overlay = document.getElementById('pinlockOverlay');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        document.getElementById('passwordOutput').classList.remove('pw-hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generatePassword();
});