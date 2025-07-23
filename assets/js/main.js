document.addEventListener('DOMContentLoaded', () => {
    // --- 1. UYGULAMA KURULUMU VE TELEGRAM ENTEGRASYONU ---
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Tema ayarlarını uygula
    const isDarkMode = tg.colorScheme === 'dark';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // --- 2. UYGULAMA DURUMU (STATE) ---
    // Gerçek bir uygulamada bu veriler API'den gelir.
    const appState = {
        user: {
            balance: 0,
            assets: [],
            transactions: []
        },
        market: {
            price: 0,
            change24h: 0
        },
        walletAddress: 'UQB2hUHdOFJHUwZRYsKRBO4kJeufMHbmaBC1WOPIkxRPIOcC'
    };

    // --- 3. DOM ELEMENTLERİNİ SEÇME ---
    const elements = {
        pageTitle: document.getElementById('pageTitle'),
        sections: document.querySelectorAll('.app-section'),
        navButtons: document.querySelectorAll('.nav-btn'),
        // Dashboard
        totalBalanceAmount: document.getElementById('totalBalanceAmount'),
        totalBalanceEquivalent: document.getElementById('totalBalanceEquivalent'),
        transactionsContainer: document.getElementById('transactionsContainer'),
        // Cüzdan
        assetsContainer: document.getElementById('assetsContainer'),
        // Piyasa
        marketPrice: document.getElementById('marketPrice'),
        marketChange: document.getElementById('marketChange'),
        // Modallar
        modals: document.querySelectorAll('.modal'),
        // Yan Menü
        sideMenu: document.getElementById('sideMenu'),
        overlay: document.querySelector('.overlay'),
        // Kullanıcı Bilgileri
        userName: document.getElementById('userName'),
        userHandle: document.getElementById('userHandle'),
        userAvatar: document.getElementById('userAvatar'),
        // QR Kod
        qrCodeWrapper: document.getElementById('qrCodeWrapper'),
        walletAddressSpan: document.getElementById('walletAddress'),
    };

    // --- 4. RENDER FONKSİYONLARI (ARAYÜZÜ GÜNCELLEME) ---

    const renderDashboard = () => {
        const { balance } = appState.user;
        const { price } = appState.market;
        elements.totalBalanceAmount.textContent = `${balance.toFixed(2)} LKURD`;
        elements.totalBalanceEquivalent.textContent = `≈ ${(balance * price).toLocaleString('tr-TR', { style: 'currency', currency: 'USD' })}`;
    };

    const renderTransactions = () => {
        const { transactions } = appState.user;
        elements.transactionsContainer.innerHTML = ''; // Temizle
        if (transactions.length === 0) {
            elements.transactionsContainer.innerHTML = '<p class="hint-text">Henüz işlem yok.</p>';
            return;
        }
        transactions.forEach(tx => {
            const isSent = tx.type === 'send';
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="tx-icon ${isSent ? 'sent' : 'received'}">
                    <i class="fas fa-arrow-${isSent ? 'up' : 'down'}"></i>
                </div>
                <div class="tx-details">
                    <h4>${tx.party}</h4>
                    <p>${tx.date}</p>
                </div>
                <div class="tx-amount ${isSent ? 'sent' : 'received'}">
                    ${isSent ? '-' : '+'}${tx.amount.toFixed(2)} LKURD
                </div>
            `;
            elements.transactionsContainer.appendChild(item);
        });
    };
    
    const renderMarket = () => {
        const { price, change24h } = appState.market;
        elements.marketPrice.textContent = price.toLocaleString('tr-TR', { style: 'currency', currency: 'USD' });
        elements.marketChange.textContent = `${change24h.toFixed(2)}%`;
        elements.marketChange.className = change24h >= 0 ? 'positive' : 'negative';
    };

    // --- 5. VERİ YÜKLEME VE İLK KURULUM ---

    const loadInitialData = () => {
        // Simüle edilmiş API çağrısı
        setTimeout(() => {
            // State'i güncelle
            appState.user = {
                balance: 1245.50,
                transactions: [
                    { type: 'receive', amount: 50.00, party: 'Ahmet Y.', date: '10 dk önce' },
                    { type: 'send', amount: 25.50, party: 'Market', date: 'Dün' },
                    { type: 'receive', amount: 1200.00, party: 'STON.fi', date: '2 gün önce' }
                ]
            };
            appState.market = { price: 0.1234, change24h: 5.25 };
            
            // Arayüzü güncelle
            renderDashboard();
            renderTransactions();
            renderMarket();
        }, 1500); // 1.5 saniye bekleme
    };
    
    const setupUserInfo = () => {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        elements.userName.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        elements.userHandle.textContent = user.username ? `@${user.username}` : 'ID: ' + user.id;
        
        if (user.photo_url) {
            elements.userAvatar.style.backgroundImage = `url(${user.photo_url})`;
        } else {
            const initials = (user.first_name ? user.first_name.charAt(0) : '') + (user.last_name ? user.last_name.charAt(0) : '');
            elements.userAvatar.textContent = initials || 'L';
        }
    };

    // --- 6. OLAY DİNLEYİCİLERİ (EVENT LISTENERS) ---

    const setupEventListeners = () => {
        // Navigasyon
        elements.navButtons.forEach(btn => {
            btn.addEventListener('click', () => navigateTo(btn.dataset.section));
        });

        // Yan Menü
        document.getElementById('menuToggleBtn').addEventListener('click', () => toggleMenu(true));
        document.getElementById('closeMenuBtn').addEventListener('click', () => toggleMenu(false));
        elements.overlay.addEventListener('click', () => {
            toggleMenu(false);
            closeAllModals();
        });
        
        // Modallar
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.modal));
        });
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        // Dış Linkler
        document.querySelectorAll('[data-link]').forEach(el => {
            el.addEventListener('click', () => tg.openLink(el.dataset.link));
        });
        document.querySelectorAll('[data-tg-link]').forEach(el => {
            el.addEventListener('click', () => tg.openTelegramLink(el.dataset.tgLink));
        });
        
        // Adres Kopyalama ve Paylaşma
        document.getElementById('copyAddressBtn').addEventListener('click', copyWalletAddress);
        document.getElementById('shareAddressBtn').addEventListener('click', shareWalletAddress);
        
        // Kapatma butonu
        document.getElementById('logoutBtn').addEventListener('click', () => tg.close());
    };

    // --- 7. YARDIMCI FONKSİYONLAR ---

    const navigateTo = (sectionId) => {
        elements.sections.forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');

        elements.navButtons.forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');
        
        elements.pageTitle.textContent = document.querySelector(`.nav-btn[data-section="${sectionId}"] span`).textContent;
    };

    const toggleMenu = (show) => {
        elements.sideMenu.classList.toggle('show', show);
        elements.overlay.classList.toggle('show', show);
    };

    const openModal = (modalId) => {
        closeAllModals();
        document.getElementById(modalId)?.classList.add('show');
        elements.overlay.classList.add('show');
        if (modalId === 'receiveModal') {
            generateQRCode();
            elements.walletAddressSpan.textContent = appState.walletAddress;
        }
    };

    const closeAllModals = () => {
        elements.modals.forEach(m => m.classList.remove('show'));
        elements.overlay.classList.remove('show');
    };
    
    const generateQRCode = () => {
        elements.qrCodeWrapper.innerHTML = ''; // Temizle
        const qrImg = document.createElement('img');
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ton://transfer/${appState.walletAddress}`;
        elements.qrCodeWrapper.appendChild(qrImg);
    };
    
    const copyWalletAddress = () => {
        tg.writeText(appState.walletAddress, () => {
            tg.HapticFeedback.notificationOccurred('success');
            tg.showAlert('Cüzdan adresi panoya kopyalandı!');
        });
    };
    
    const shareWalletAddress = () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(appState.walletAddress)}&text=${encodeURIComponent('Lira Kurdi cüzdan adresim:')}`;
        tg.openTelegramLink(url);
    };

    // --- UYGULAMAYI BAŞLAT ---
    const init = () => {
        setupUserInfo();
        setupEventListeners();
        loadInitialData();
    };

    init();
});
