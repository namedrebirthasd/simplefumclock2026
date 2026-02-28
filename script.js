// ===============================
// 予定データ（A が編集する部分）
// ===============================
const todaySchedule = {
    title: "本日の予定",
    items: [
        "買い物に行く",
        "洗濯する",
        "アニメを見る"
    ]
};

const tomorrowSchedule = {
    title: "明日の予定",
    items: [
        "仕事の準備",
        "昼寝する",
        "ゲームする"
    ]
};



// ===============================
// 「本当の高さ」を渡すコードを追加　※ A のアプリを“完全フィット”にするパッチ（CSS＋JS）
// ===============================

function fixVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
fixVH();
window.addEventListener('resize', fixVH);


// ===============================
// 曜日ごとの予定データ（A が編集する部分）
// ===============================

const weeklySchedule = {
    SUNDAY: {
        title: "予定なしの日かも",
        items: [
            "",
            ""
        ]
    },
    MONDAY: {
        title: "たまにヘルパーが訪問する日かも",
        items: [
            "12:40頃に来るかも？",
            ""
        ]
    },
    TUESDAY: {
        title: "たのしいデイたなべの日",
        items: [
            "09:00頃に送迎車が来る",
            "15:00頃に終わる予定"
        ]
    },
    WEDNESDAY: {
        title: "予定なしの日かも",
        items: []
    },
    THURSDAY: {
        title: "予定なしの日かも",
        items: []
    },
    FRIDAY: {
        title: "たのしいデイたなべの日",
        items: [
            "09:00頃に送迎車が来る",
            "15:00頃に終わる予定"
        ]
    },
    SATURDAY: {
        title: "たのしいデイたなべの日",
        items: [
            "09:00頃に送迎車が来る",
            "15:00頃に終わる予定"
        ]
    }
};



// ===============================
// 日付と時刻の表示
// ===============================
function updateClock() {
    const now = new Date();

    // 日付
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const w = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];
    document.getElementById("date").textContent = `${y}年${m}月${d}日 (${w})`;

    // 時刻（AM/PM）
    let hour = now.getHours();
    const min = String(now.getMinutes()).padStart(2, "0");
    const ampm = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    document.getElementById("time").textContent = `${ampm} ・ ${hour12} : ${min}`;

    // 本日の予定の表示制御（0〜17時は表示、17〜24時は薄く表示）
    const todayBox = document.getElementById("today");
    // 明日の予定の表示制御（0〜17時は薄く表示、17〜24時は表示）
    const tomorrowBox = document.getElementById("tomorrow");

    if (hour < 17) {
        // 朝〜夕方
        todayBox.style.opacity = 1;
        tomorrowBox.style.opacity = 0.3;
    } else {
        // 夜
        todayBox.style.opacity = 0.3;
        tomorrowBox.style.opacity = 1;
    }


}

setInterval(() => {
    updateClock();
    renderSchedules();
}, 1000);

updateClock();
renderSchedules(); // ← これを追加した（ver1.6 2026/03/01）



// ===============================
// セーフ設計   
// ===============================
function safe(id) {
    return document.getElementById(id);
}


// ===============================
// 背景色調整スライダー
// ===============================
const bgFilter = document.getElementById("bg-filter");
// const bgRange = document.getElementById("bgRange");
// 背景フィルター
const bgRange = safe("bgRange");
if (bgRange) {
    bgRange.addEventListener("input", () => {
        const value = bgRange.value / 100;
        bgFilter.style.backgroundColor = `rgba(255,255,255,${value})`;
    });
}


// ===============================
// JSON を HTML に流し込む
// ===============================
function renderSchedules() {
    console.log("renderSchedules 実行された");
    const todayBox = document.getElementById("today");
    const tomorrowBox = document.getElementById("tomorrow");

    const now = new Date();
    const todayIndex = now.getDay(); // 0=日曜
    const tomorrowIndex = (todayIndex + 1) % 7;

    const weekKeys = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    const todayData = weeklySchedule[weekKeys[todayIndex]];
    const tomorrowData = weeklySchedule[weekKeys[tomorrowIndex]];

    todayBox.innerHTML = `
        <h2>本日は ${todayData.title}</h2>
        <ul>${todayData.items.map(i => `<li>${i}</li>`).join("")}</ul>
    `;

    tomorrowBox.innerHTML = `
        <h2>明日は ${tomorrowData.title}</h2>
        <ul>${tomorrowData.items.map(i => `<li>${i}</li>`).join("")}</ul>
    `;
}


const seClick = document.getElementById("seClick");
const seSwipe = document.getElementById("seSwipe");
const seVolume = safe("seVolume");

// 起動時に読み込み
// const seVolume = document.getElementById("seVolume");
// SE 音量
const savedSE = localStorage.getItem("seVolume");
if (savedSE !== null && seVolume) {
    seVolume.value = savedSE;
    const vol = savedSE / 100;
    seClick.volume = vol;
    seSwipe.volume = vol;
}

// スライダー変更時に保存
if (seVolume) {
    seVolume.addEventListener("input", () => {
        const vol = seVolume.value / 100;
        seClick.volume = vol;
        seSwipe.volume = vol;
        localStorage.setItem("seVolume", seVolume.value);
    });
}





// ===============================
// 背景画像更新用
// ===============================
const backgrounds = [
    // "images/bg1.png",
    // "images/bg2.png",
    // "images/bg3.png"
];

let index = 1;

while (true) {
    const img = new Image();
    const num = String(index).padStart(3, "0"); // 001, 002, 003...
    img.src = `images/bg_${num}.png`;

    // 読み込み成功
    img.onload = () => { };

    // 読み込み失敗 → ループ終了
    img.onerror = () => { };

    // 画像が存在するかどうかを同期的に判定するための工夫
    try {
        // 同期的に存在チェック
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", img.src, false);
        xhr.send();

        if (xhr.status >= 200 && xhr.status < 300) {
            backgrounds.push(img.src);
            index++;
        } else {
            console.log(`背景画像の読み込み完了：${backgrounds.length} 枚`);
            break;
        }
    } catch {
        console.log(`背景画像の読み込み完了：${backgrounds.length} 枚`);
        break;
    }
}



let randomMode = false;
let bgIndex = 0;

function toggleRandomMode() {
    randomMode = !randomMode;
    document.getElementById("modeBtn").textContent =
        randomMode ? "ランダムモード" : "順番モード";
}

function changeBackground() {
    if (randomMode) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * backgrounds.length);
        } while (newIndex === bgIndex);
        bgIndex = newIndex;
    } else {
        bgIndex = (bgIndex + 1) % backgrounds.length;
    }

    document.body.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
}


// ===============================
// 背景画像前面表示用
// ===============================
let viewerTimer = null;

function showViewer() {
    playSwipe(); // ← ここで鳴らす

    const viewer = document.getElementById("viewer");
    viewer.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    viewer.style.display = "block";

    if (viewerTimer) clearTimeout(viewerTimer);

    viewerTimer = setTimeout(() => {
        hideViewer();
    }, 60000); // 1分
}

function hideViewer() {
    playSwipe();
    const viewer = document.getElementById("viewer");
    viewer.style.display = "none";

    if (viewerTimer) clearTimeout(viewerTimer);
}

function playClick() {
    const se = document.getElementById("seClick");
    se.currentTime = 0;
    se.play();
}

function playSwipe() {
    const se = document.getElementById("seSwipe");
    se.currentTime = 0;
    se.play();
}





// -------------------------------
// カットイン式予定プログラム（2026/03/01時点動作不良）
// -------------------------------
// カットイン ON/OFF
let showDailyPopup = true;

// カットイン周期（ミリ秒）
let cutinInterval = 60000; // 1分
//test
cutinInterval = 10000;

// カットイン表示処理
function showCutin() {
    if (!showDailyPopup) return;

    const cutin = document.getElementById("schedule-cutin");
    const html = getPopupScheduleText(); // 今日/明日を自動判定してHTML生成

    console.log('カットイン表示（不具合で実行できていません）');
    // 中身を生成
    cutin.innerHTML = `
        <div class="cutin-inner">
            <div class="cutin-text">
                ${html}
            </div>
        </div>
    `;

    const textEl = cutin.querySelector(".cutin-text");

    // フェードイン開始（背景）
    cutin.classList.remove("cutin-hidden");
    cutin.classList.add("cutin-visible");

    // 0.5秒遅れて文字フェードイン
    setTimeout(() => {
        textEl.classList.add("cutin-text-visible");
    }, 500);

    // 3秒後に文字フェードアウト
    setTimeout(() => {
        textEl.classList.remove("cutin-text-visible");
    }, 3000 + 500);

    // 文字が薄くなってから背景フェードアウト
    setTimeout(() => {
        cutin.classList.remove("cutin-visible");
        cutin.classList.add("cutin-hidden");
    }, 3000 + 2000);
}

// 周期的にカットインを出す
setInterval(() => {
    showCutin();
}, cutinInterval);



// -------------------------------
// 今日/明日の予定を生成する関数
// -------------------------------
function getPopupScheduleText() {
    const now = new Date();
    const hour = now.getHours();

    const todayIndex = now.getDay();
    const tomorrowIndex = (todayIndex + 1) % 7;

    const weekKeys = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

    const isToday = hour < 17;
    const targetData = isToday
        ? weeklySchedule[weekKeys[todayIndex]]
        : weeklySchedule[weekKeys[tomorrowIndex]];

    const titleText = isToday ? "今日の予定" : "明日の予定";

    const hasItems = targetData.items.some(i => i.trim() !== "");

    const itemsHtml = hasItems
        ? targetData.items.map(i => `<li>${i}</li>`).join("")
        : `<li>（特にありません）</li>`;

    return `
        <h2>${titleText}</h2>
        <h3>${targetData.title}</h3>
        <ul>${itemsHtml}</ul>
    `;
}





// ===============================
// BGM・SE再生機能ver1.4
// ===============================
// ===============================
// BGM 自動スキャン
// ===============================
const bgmList = [];
let bgmIndex = 0;
let bgmLoop = false;
let bgmRandom = false;
let bgmTimer = null;

let bgm = new Audio();

// 曲名辞書（任意）
/* 要編集部分 */
const bgmNames = {
    "bgm_001.mp3": "昼と夜の境界",
    "bgm_002.mp3": "コーヒー・ルンバ　西田佐知子",
    "bgm_003.mp3": "サン・トワ・マミー 越路吹雪",
    "bgm_004.mp3": "オー・シャンゼリゼ 越路吹雪",
    "bgm_005.mp3": "上を向いて歩こう 坂本 九",
    "bgm_006.mp3": "長渕剛／順子 （1980年）",
    "bgm_007.mp3": "",
};

function getBgmTitle(file) {
    const name = file.split("/").pop();
    return bgmNames[name] || name;
}

(function scanBgm() {
    let idx = 1;
    while (true) {
        const num = String(idx).padStart(3, "0");
        const file = `sounds/bgm_${num}.mp3`;

        try {
            const xhr = new XMLHttpRequest();
            xhr.open("HEAD", file, false);
            xhr.send();

            if (xhr.status >= 200 && xhr.status < 300) {
                bgmList.push(file);
                idx++;
            } else {
                break;
            }
        } catch {
            break;
        }
    }
})();



// ===============================
//  BGM プレイヤー本体
// ===============================
function updateBgmNowLabel() {
    const label = document.getElementById("bgmNow");
    if (!label) return;

    if (bgm.paused || !bgm.src) {
        label.textContent = "再生中：なし";
        return;
    }

    label.textContent = "再生中：" + getBgmTitle(bgmList[bgmIndex]);
}

function playBgm(index) {
    if (bgmList.length === 0) return;
    if (typeof index === "number") bgmIndex = index;

    bgm.src = bgmList[bgmIndex];
    bgm.loop = bgmLoop;
    bgm.play();
    updateBgmNowLabel();
}

function stopBgm() {
    bgm.pause();
}

function nextBgm() {
    if (bgmList.length === 0) return;

    if (bgmRandom) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * bgmList.length);
        } while (newIndex === bgmIndex && bgmList.length > 1);
        bgmIndex = newIndex;
    } else {
        bgmIndex = (bgmIndex + 1) % bgmList.length;
    }
    playBgm(bgmIndex);
}

function toggleBgmLoop() {
    bgmLoop = !bgmLoop;
    bgm.loop = bgmLoop;
    const btn = document.getElementById("bgmLoopBtn");
    if (btn) btn.textContent = bgmLoop ? "ループON" : "ループOFF";
}

function toggleBgmRandom() {
    bgmRandom = !bgmRandom;
    const btn = document.getElementById("bgmRandomBtn");
    if (btn) btn.textContent = bgmRandom ? "ランダムON" : "ランダムOFF";
}

function setBgmTimer(minutes) {
    if (bgmTimer) clearTimeout(bgmTimer);
    if (!minutes) return;
    bgmTimer = setTimeout(() => {
        stopBgm();
    }, minutes * 60000);
}




// ===============================
//  BGM プログレスバー
// ===============================
bgm.addEventListener("loadedmetadata", () => {
    updateSeekBar();
});

bgm.addEventListener("timeupdate", () => {
    updateSeekBar();
});

function updateSeekBar() {
    const seek = document.getElementById("bgmSeek");
    const timeLabel = document.getElementById("bgmTime");
    if (!seek || !timeLabel) return;

    const cur = bgm.currentTime;
    const dur = bgm.duration || 0;

    seek.value = dur ? (cur / dur) * 100 : 0;

    const format = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    timeLabel.textContent = `${format(cur)} / ${format(dur)}`;
}

// シーク操作
document.addEventListener("input", (e) => {
    if (e.target.id === "bgmSeek") {
        const dur = bgm.duration;
        if (dur) {
            bgm.currentTime = (e.target.value / 100) * dur;
        }
    }
});




// ===============================
//  BGM ボリューム（永続化も入れるなら）
// ===============================
let bgmVolumeSlider = null;

function initBgmVolume() {
    bgmVolumeSlider = document.getElementById("bgmVolume");
    if (!bgmVolumeSlider) return;

    const saved = localStorage.getItem("bgmVolume");
    if (saved !== null) {
        bgmVolumeSlider.value = saved;
        bgm.volume = saved / 100;
    } else {
        bgmVolumeSlider.value = 100;
        bgm.volume = 1;
    }

    bgmVolumeSlider.addEventListener("input", () => {
        const v = bgmVolumeSlider.value / 100;
        bgm.volume = v;
        localStorage.setItem("bgmVolume", bgmVolumeSlider.value);
    });
}





// ===============================
// メニュー：音タブ
// ===============================
function renderSoundMenu() {
    const content = document.getElementById("menuContent");
    content.innerHTML = "";

    // BGM プレイヤー部
    const player = document.createElement("div");
    player.innerHTML = `
    <div class="sound-section-title">BGM プレイヤー</div>
    <div id="bgmNow" style="font-size:3.5vmin; margin-bottom:5px;">再生中：なし</div>
    <div style="margin-bottom:5px;">
        <input type="range" id="bgmSeek" min="0" max="100" value="0" style="width:90%;">
        <div id="bgmTime" style="font-size:3vmin;">0:00 / 0:00</div>
    </div>
    <div class="sound-button-row">
        <button onclick="playBgm()">再生</button>
        <button onclick="stopBgm()">停止</button>
        <button onclick="nextBgm()">次へ</button>
    </div>
    <div class="sound-button-row">
        <button id="bgmLoopBtn" onclick="toggleBgmLoop()">ループOFF</button>
        <button id="bgmRandomBtn" onclick="toggleBgmRandom()">ランダムOFF</button>
    </div>
    <div style="margin-top:5px;">
        タイマー：
        <button onclick="setBgmTimer(30)">30分</button>
        <button onclick="setBgmTimer(60)">1時間</button>
        <button onclick="setBgmTimer(120)">2時間</button>
        <button onclick="setBgmTimer(0)">解除</button>
    </div>
    <div style="margin-top:5px;">
        BGM音量：<input type="range" id="bgmVolume" min="0" max="100" value="100">
    </div>
    `;
    content.appendChild(player);

    // BGM リスト
    const listTitle = document.createElement("div");
    listTitle.className = "sound-section-title";
    listTitle.textContent = "BGM リスト";
    content.appendChild(listTitle);

    if (bgmList.length === 0) {
        const none = document.createElement("div");
        none.textContent = "BGM ファイルがありません。";
        content.appendChild(none);
    } else {
        bgmList.forEach((file, i) => {
            const row = document.createElement("div");
            row.className = "sound-list-item";
            row.textContent = getBgmTitle(file);
            row.addEventListener("click", () => {
                playClick();
                playBgm(i);
            });
            content.appendChild(row);
        });
    }

    // SE リスト（おまけ）
    const seTitle = document.createElement("div");
    seTitle.className = "sound-section-title";
    seTitle.textContent = "SE リスト";
    content.appendChild(seTitle);

    const seList = [
        { title: "クリック音", id: "seClick" },
        { title: "スワイプ音", id: "seSwipe" }
    ];

    seList.forEach(se => {
        const row = document.createElement("div");
        row.className = "sound-list-item";
        row.textContent = se.title;
        row.addEventListener("click", () => {
            const el = document.getElementById(se.id);
            if (!el) return;
            el.currentTime = 0;
            el.play();
        });
        content.appendChild(row);
    });

    updateBgmNowLabel();
    initBgmVolume();
    playClick();
}





// ===============================
// メニュー開閉
// ===============================
const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");

let menuOpen = false;

menuButton.addEventListener("click", () => {
    menuOpen = !menuOpen;
    menuPanel.style.left = menuOpen ? "0" : "-50%";
});

// 外側タップで閉じる（安全）
document.addEventListener("click", (e) => {
    if (menuOpen && !menuPanel.contains(e.target) && e.target !== menuButton) {
        menuOpen = false;
        menuPanel.style.left = "-50%";

        // ★ 追加：編集中の input を全部リセット
        renderScheduleEditor();
    }
});



// ===============================
// メニュー：予定一覧の表示
// ===============================
function renderScheduleEditor() {
    const content = document.getElementById("menuContent");
    content.innerHTML = ""; // 初期化

    const weekKeys = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const weekNames = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"];

    
    // ① カレンダーを先に描画
    renderCalendar(content);





    weekKeys.forEach((key, i) => {
        const data = weeklySchedule[key];

        const block = document.createElement("div");
        block.innerHTML = `
            <h3 style="font-size:5vmin; margin:10px 0;">${weekNames[i]}：${data.title}</h3>
        `;

        data.items.forEach((item, idx) => {
            const row = document.createElement("div");
            row.className = "editable";
            row.textContent = item || "(空)";

            row.addEventListener("click", () => {
                const input = document.createElement("input");
                input.value = item;
                row.innerHTML = "";
                row.appendChild(input);
                input.focus();

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        data.items[idx] = input.value;
                        renderScheduleEditor(); // 再描画
                        renderSchedules();      // 本日・明日にも反映
                    }
                });
            });

            block.appendChild(row);
        });

        content.appendChild(block);
    });
    playClick();
}





// ===============================
// カレンダー描画の JS（予定タブ統合版）
// ===============================
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

function renderCalendar(parent) {
    const container = document.createElement("div");
    container.className = "calendar-container";

    const header = document.createElement("div");
    header.style.fontSize = "4vmin";
    header.style.textAlign = "center";
    header.style.marginBottom = "8px";
    header.innerHTML = `
        <button onclick="changeMonth(-1)">＜</button>
        ${calYear}年 ${calMonth + 1}月
        <button onclick="changeMonth(1)">＞</button>
    `;
    container.appendChild(header);

    const week = ["日","月","火","水","木","金","土"];
    const weekRow = document.createElement("div");
    weekRow.className = "calendar-grid";
    week.forEach(w => {
        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        cell.style.fontWeight = "bold";
        cell.textContent = w;
        weekRow.appendChild(cell);
    });
    container.appendChild(weekRow);

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const days = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-cell";
        grid.appendChild(empty);
    }

    for (let d = 1; d <= days; d++) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        cell.textContent = d;

        const isToday =
            today.getFullYear() === calYear &&
            today.getMonth() === calMonth &&
            today.getDate() === d;

        if (isToday) cell.classList.add("calendar-today");

        grid.appendChild(cell);
    }

    container.appendChild(grid);
    parent.appendChild(container);
}

function changeMonth(offset) {
    calMonth += offset;
    if (calMonth < 0) {
        calMonth = 11;
        calYear--;
    } else if (calMonth > 11) {
        calMonth = 0;
        calYear++;
    }
    renderScheduleEditor();
}


// ===============================
// メニュー：ギャラリー一覧
// ===============================
function renderGallery() {
    const content = document.getElementById("menuContent");
    content.innerHTML = "";

    backgrounds.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "gallery-thumb";

        img.addEventListener("click", () => {
            bgIndex = i;
            document.body.style.backgroundImage = `url(${src})`;
            playClick();
        });

        content.appendChild(img);
    });
    playClick();
}


// メニューに追加
document.querySelector('[data-tab="schedule"]').addEventListener("click", () => {
    renderScheduleEditor();
});


document.querySelector('[data-tab="gallery"]').addEventListener("click", () => {
    renderGallery();
});


document.querySelector('[data-tab="sound"]').addEventListener("click", () => {
    renderSoundMenu();
});





// ===============================
// フルスクリーン切替
// ===============================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
    playClick();
}




renderSchedules();




window.addEventListener("load", () => {
    changeBackground();  // ← 起動時に1枚セット
});