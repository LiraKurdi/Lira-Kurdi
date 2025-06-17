window.isPremiumUser = false;

function checkPremiumStatus() {
    if (!window.Telegram?.WebApp) return;

    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (!initData.user) return;

    const userId = initData.user.id;
    window.Telegram.WebApp.CloudStorage.getItem(`user_${userId}`, (err, data) => {
        if (data) {
            const user = JSON.parse(data);
            window.isPremiumUser = user.isPremium || false;
            document.getElementById('premiumStatus').textContent = window.isPremiumUser ? 'Yes' : 'No';
        } else {
            saveUserData(userId, initData.user.username || 'Guest', '', false);
        }
    });
}

function saveUserData(id, username, wallet, isPremium = false) {
    const user = {
        id,
        username,
        wallet,
        isPremium,
        updated: new Date().toISOString()
    };
    window.Telegram.WebApp.CloudStorage.setItem(`user_${id}`, JSON.stringify(user));
    window.isPremiumUser = isPremium;
    document.getElementById('premiumStatus').textContent = isPremium ? 'Yes' : 'No';
}

function subscribePremium() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    window.Telegram.WebApp.openLink('https://t.me/tribute/app?startapp=suJQ');
    // Abonelik sonrası manuel güncelleme için:
    // saveUserData(userId, username, wallet, true);
}
