if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData.user) {
        document.getElementById('username').textContent = initData.user.username || initData.user.first_name;
    }
}

function connectWallet() {
    // Placeholder: TON Wallet bağlantısı
    alert('Connecting to @Wallet... (Placeholder)');
    document.getElementById('balance').textContent = '100 $LKURD'; // Mock data
}