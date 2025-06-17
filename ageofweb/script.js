const canvas = document.getElementById('worldMap');
const ctx = canvas.getContext('2d');
const pixelSize = 4;
const gridWidth = 300;
const gridHeight = 150;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

const gameData = {
    pixels: Array(gridWidth * gridHeight).fill().map((_, id) => ({ id, owner: null, color: '#ffffff', isOcean: true, continent: null, country: null, features: {}, flag: null })),
    lastUpdate: "2025-06-18"
};

function defineContinentsAndCountries() {
    for (let y = 10; y < 60; y++) for (let x = 20; x < 90; x++) {
        if (y < 20 && x > 80) continue;
        if (y > 50 && x < 30) continue;
        if (x > 85 && y > 40) continue;
        setPixel(x, y, false, "North America", null);
    }
    for (let y = 60; y < 120; y++) for (let x = 50; x < 100; x++) {
        if (y > 100 && (x < 60 || x > 90)) continue;
        if (x < 55 && y < 70) continue;
        setPixel(x, y, false, "South America", null);
    }
    for (let y = 10; y < 50; y++) for (let x = 110; x < 150; x++) {
        if (y > 40 && x > 140) continue;
        if (x < 115 && y > 30) continue;
        setPixel(x, y, false, "Europe", null);
    }
    for (let y = 50; y < 110; y++) for (let x = 100; x < 160; x++) {
        if (y > 90 && (x < 110 || x > 150)) continue;
        if (x > 145 && y > 80) continue;
        setPixel(x, y, false, "Africa", null);
    }
    for (let y = 10; y < 90; y++) for (let x = 160; x < 280; x++) {
        if (y > 70 && x > 260) continue;
        if (x > 270 && y < 30) continue;
        setPixel(x, y, false, "Asia", null);
    }
    for (let y = 110; y < 140; y++) for (let x = 200; x < 240; x++) {
        if (x < 205 && y < 115) continue;
        setPixel(x, y, false, "Australia", null);
    }
    for (let y = 140; y < 150; y++) for (let x = 50; x < 250; x++) setPixel(x, y, false, "Antarctica", null);

    const countries = [
        { name: "Turkey", continent: "Europe", positions: [[130,30],[131,30],[130,31],[131,31],[132,30],[132,31],[133,30],[133,31],[134,30],[134,31]], features: { health: 1, education: 1 }, flag: "../images/turkiye.svg" },
        { name: "Israel", continent: "Asia", positions: [[145,50],[146,50],[145,51],[146,51],[147,50],[147,51],[148,50],[148,51],[149,50],[149,51]], features: { health: 2, defense: 2 }, flag: "../images/israel.svg" },
        { name: "Iran", continent: "Asia", positions: [[170,45],[171,45],[170,46],[171,46],[172,45],[172,46],[173,45],[173,46],[174,45],[174,46]], features: { health: 1, army: 2 }, flag: "../images/iran.svg" },
        { name: "Yemen", continent: "Asia", positions: [[145,60],[146,60],[145,61],[146,61],[147,60],[147,61],[148,60],[148,61],[149,60],[149,61]], features: { health: 1, economy: 1 }, flag: null },
        { name: "Palestine", continent: "Asia", positions: [[145,52],[146,52],[145,53],[146,53],[147,52],[147,53],[148,52],[148,53],[149,52],[149,53]], features: { health: 1, politicalPower: 1 }, flag: null },
        { name: "Kurdistan", continent: "Asia", positions: [[155,45],[156,45],[155,46],[156,46],[157,45],[157,46],[158,45],[158,46],[159,45],[159,46]], features: { health: 100, education: 55, economy: 30 }, flag: "../images/kurdistan.svg" },
        { name: "Syria (Assad)", continent: "Asia", positions: [[145,45],[146,45],[145,46],[146,46],[147,45],[147,46],[148,45],[148,46],[149,45],[149,46]], features: { army: 2, defense: 1 }, flag: null },
        { name: "Syria (Colani)", continent: "Asia", positions: [[147,47],[148,47],[147,48],[148,48],[149,47],[149,48],[150,47],[150,48],[151,47],[151,48]], features: { army: 1, economy: 1 }, flag: null },
        { name: "Syria (Kurdistan)", continent: "Asia", positions: [[150,47],[151,47],[150,48],[151,48],[152,47],[152,48],[153,47],[153,48],[154,47],[154,48]], features: { health: 100, education: 55, economy: 30 }, flag: "../images/kurdistan.svg" },
        { name: "Russia", continent: "Europe", positions: [[180,20],[181,20],[180,21],[181,21],[182,20],[182,21],[183,20],[183,21],[184,20],[184,21]], features: { army: 3, technology: 2 }, flag: "../images/russia.svg" },
        { name: "China", continent: "Asia", positions: [[240,50],[241,50],[240,51],[241,51],[242,50],[242,51],[243,50],[243,51],[244,50],[244,51]], features: { economy: 3, technology: 2 }, flag: null },
        { name: "Indonesia", continent: "Asia", positions: [[260,80],[261,80],[260,81],[261,81],[262,80],[262,81],[263,80],[263,81],[264,80],[264,81]], features: { economy: 2, education: 1 }, flag: null },
        { name: "Taiwan", continent: "Asia", positions: [[250,60],[251,60],[250,61],[251,61],[252,60],[252,61],[253,60],[253,61],[254,60],[254,61]], features: { technology: 2, economy: 2 }, flag: null },
        { name: "Ukraine", continent: "Europe", positions: [[160,30],[161,30],[160,31],[161,31],[162,30],[162,31],[163,30],[163,31],[164,30],[164,31]], features: { defense: 2, politicalPower: 1 }, flag: null },
        { name: "Georgia", continent: "Europe", positions: [[145,35],[146,35],[145,36],[146,36],[147,35],[147,36],[148,35],[148,36],[149,35],[149,36]], features: { health: 1, education: 1 }, flag: null },
        { name: "Azerbaijan", continent: "Europe", positions: [[150,35],[151,35],[150,36],[151,36],[152,35],[152,36],[153,35],[153,36],[154,35],[154,36]], features: { army: 1, economy: 1 }, flag: null }
    ];
    countries.forEach(({ name, continent, positions, features, flag }) => {
        positions.forEach(([x, y]) => {
            gameData.pixels[y * gridWidth + x] = {
                id: y * gridWidth + x,
                owner: "@LiraKurdiSupport",
                color: name.includes("Kurdistan") ? "#ff4500" : "#00ff00",
                isOcean: false,
                continent,
                country: name,
                features,
                flag
            };
        });
    });
    gameData.pixels[30 * gridWidth + 131] = {
        id: 30 * gridWidth + 131,
        owner: "@Player1",
        color: "#ff0000",
        isOcean: false,
        continent: "Europe",
        country: "Turkey",
        features: { health: 1, education: 1 },
        flag: "../images/turkiye.svg"
    };
}
function setPixel(x, y, isOcean, continent, country) {
    gameData.pixels[y * gridWidth + x] = {
        id: y * gridWidth + x,
        owner: null,
        color: '#ffffff',
        isOcean,
        continent,
        country,
        features: {},
        flag: null
    };
}
let pixels = gameData.pixels;

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
    }, 2000);
});

if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    const theme = window.Telegram.WebApp.themeParams;
    if (theme.bg_color) document.body.style.background = theme.bg_color;
    window.Telegram.WebApp.MainButton
        .setText('Buy via @LiraKurdiSupport')
        .show()
        .onClick(() => buyPixel());
    window.Telegram.WebApp.BackButton.show().onClick(() => window.location.href = '../index.html');
}

function initMap() {
    resizeCanvas();
    defineContinentsAndCountries();
    drawMap();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70;
    drawMap();
}

function drawMap() {
    requestAnimationFrame(() => {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        const imageCache = {};
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const pixel = pixels[y * gridWidth + x];
                ctx.shadowColor = pixel.owner ? (pixel.country.includes("Kurdistan") ? 'rgba(255, 69, 0, 0.8)' : 'rgba(212, 175, 55, 0.5)') : 'transparent';
                ctx.shadowBlur = pixel.owner ? (pixel.country.includes("Kurdistan") ? 8 : 5) : 0;
                if (pixel.isOcean) {
                    ctx.fillStyle = '#1e90ff';
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
                } else if (pixel.flag) {
                    if (!imageCache[pixel.flag]) {
                        imageCache[pixel.flag] = new Image();
                        imageCache[pixel.flag].src = pixel.flag;
                    }
                    if (imageCache[pixel.flag].complete) {
                        ctx.drawImage(imageCache[pixel.flag], x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
                    } else {
                        ctx.fillStyle = pixel.color;
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
                    }
                } else {
                    ctx.fillStyle = pixel.owner ? pixel.color : '#ffffff';
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
                }
                ctx.shadowColor = 'transparent';
            }
        }
        ctx.restore();
    });
}

canvas.addEventListener('click', (e) => {
    if (document.getElementById('home').classList.contains('d-none')) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offsetX) / (pixelSize * scale));
    const y = Math.floor((e.clientY - rect.top - offsetY) / (pixelSize * scale));
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
        const pixel = pixels[y * gridWidth + x];
        if (pixel.isOcean) {
            alert('Oceans cannot be purchased!');
        } else {
            document.getElementById('pixelId').textContent = `Pixel #${pixel.id}`;
            document.getElementById('pixelOwner').innerHTML = pixel.owner ? `<a href="https://t.me/@${pixel.owner.slice(1)}" target="_blank">@${pixel.owner}</a>` : 'Unowned';
            document.getElementById('pixelContinent').textContent = pixel.continent || 'Unknown';
            document.getElementById('pixelCountry').textContent = pixel.country || 'Unknown';
            document.getElementById('pixelFlag').src = pixel.flag || '';
            const featuresList = document.getElementById('countryFeatures');
            featuresList.innerHTML = '';
            for (const [key, value] of Object.entries(pixel.features || {})) {
                const li = document.createElement('li');
                li.textContent = `${key}: ${value}`;
                featuresList.appendChild(li);
            }
            new bootstrap.Modal(document.getElementById('pixelModal')).show();
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);
            ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
            ctx.restore();
            setTimeout(drawMap, 500);
        }
    }
});

function copyPixelId() {
    const pixelId = document.getElementById('pixelId').textContent.replace('Pixel #', '');
    navigator.clipboard.writeText(pixelId);
    alert('Pixel ID copied!');
}

function zoomIn() {
    scale = Math.min(scale + 0.2, 5);
    drawMap();
}
function zoomOut() {
    scale = Math.max(scale - 0.2, 1);
    drawMap();
}
canvas.addEventListener('wheel', (e) => {
    if (document.getElementById('home').classList.contains('d-none')) return;
    e.preventDefault();
    const zoomSpeed = 0.1;
    const oldScale = scale;
    scale += e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
    scale = Math.min(Math.max(1, scale), 5);
    offsetX = (offsetX - e.clientX) * (scale / oldScale) + e.clientX;
    offsetY = (offsetY - e.clientY) * (scale / oldScale) + e.clientY;
    drawMap();
});

canvas.addEventListener('mousedown', (e) => {
    if (document.getElementById('home').classList.contains('d-none')) return;
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        drawMap();
    }
});
canvas.addEventListener('mouseup', () => isDragging = false);
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', (e) => {
    if (document.getElementById('home').classList.contains('d-none')) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX - offsetX;
    touchStartY = touch.clientY - offsetY;
});
canvas.addEventListener('touchmove', (e) => {
    if (document.getElementById('home').classList.contains('d-none')) return;
    e.preventDefault();
    const touch = e.touches[0];
    offsetX = touch.clientX - touchStartX;
    offsetY = touch.clientY - touchStartY;
    drawMap();
});

function buyPixel() {
    window.open('https://t.me/LiraKurdiSupport', '_blank');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('d-none'));
    document.getElementById(pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[onclick="showPage('${pageId}')"]`).classList.add('active');
    drawMap();
}

initMap();