document.addEventListener('DOMContentLoaded', () => {
    // 1. UYGULAMA KURULUMU
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // 2. DOM ELEMENTLERİ
    const elements = {
        price: document.getElementById('price'),
        marketCap: document.getElementById('marketCap'),
        priceChange: document.getElementById('priceChange'),
        jettonDescription: document.getElementById('jettonDescription'),
        holderCount: document.getElementById('holderCount'),
        totalSupply: document.getElementById('totalSupply'),
        contractAddress: document.getElementById('contractAddress'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabPanes: document.querySelectorAll('.tab-pane'),
        clickableCards: document.querySelectorAll('.card'),
        connectWalletBtn: document.getElementById('connectWalletBtn'),
        toastNotification: document.getElementById('toastNotification'),
    };
    let toastTimeout;

    // 3. VERİ ÇEKME
    const fetchTokenData = async () => {
        const jettonAddress = 'EQDVazmnZdangGkxS8Leytry3xkdYL6LjOIGsy_yGesS5vap';
        const apiUrl = `https://tonapi.io/v2/jettons/${jettonAddress}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            showToast('Veri yüklenemedi.');
        }
    };

    // 4. ARAYÜZ GÜNCELLEME
    const updateUI = (data) => {
        const { market_data, metadata, holders_count, total_supply } = data;

        const formatCurrency = (val) => val ? `$${Math.round(val).toLocaleString('en-US')}` : '---';
        
        elements.price.textContent = market_data?.price ? `$${market_data.price.toFixed(5)}` : '---';
        elements.marketCap.textContent = formatCurrency(market_data?.market_cap_usd);
        
        if (market_data?.price_change_24h) {
            const change = parseFloat(market_data.price_change_24h);
            elements.priceChange.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
            elements.priceChange.className = `value ${change >= 0 ? 'positive' : 'negative'}`;
        } else {
            elements.priceChange.textContent = '---';
        }

        elements.jettonDescription.textContent = metadata?.description || 'Açıklama mevcut değil.';
        elements.holderCount.textContent = holders_count?.toLocaleString('en-US') || '---';
        
        if (total_supply && metadata?.decimals) {
            const supply = (BigInt(total_supply) / BigInt(10 ** metadata.decimals)).toString();
            elements.totalSupply.textContent = `${parseInt(supply).toLocaleString('en-US')} ${metadata.symbol}`;
        } else {
            elements.totalSupply.textContent = '---';
        }

        if (metadata?.address) {
            const address = metadata.address;
            elements.contractAddress.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            elements.contractAddress.href = `https://tonviewer.com/${address}`;
        }
    };

    // 5. OLAY DİNLEYİCİLERİ VE İŞLEVLER
    const setupEventListeners = () => {
        // Sekme Navigasyonu
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                elements.tabPanes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });

        // Tıklanabilir Kartlar
        elements.clickableCards.forEach(card => {
            card.addEventListener('click', () => {
                tg.HapticFeedback.impactOccurred('light');
                const link = card.dataset.link || card.dataset.tgLink;
                if (card.dataset.link) tg.openLink(link);
                if (card.dataset.tgLink) tg.openTelegramLink(link);
            });
        });

        // Cüzdan Bağlantı Butonu
        elements.connectWalletBtn.addEventListener('click', () => {
            tg.HapticFeedback.notificationOccurred('warning');
            showToast('Cüzdan bağlantı özelliği yakında eklenecektir.');
        });
    };

    const showToast = (message, duration = 3000) => {
        if (toastTimeout) clearTimeout(toastTimeout);
        elements.toastNotification.textContent = message;
        elements.toastNotification.classList.add('active');
        toastTimeout = setTimeout(() => {
            elements.toastNotification.classList.remove('active');
        }, duration);
    };

    // 6. UYGULAMAYI BAŞLAT
    const init = () => {
        fetchTokenData();
        setupEventListeners();
    };

    init();
});
