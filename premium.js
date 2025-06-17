const premiumUsers = [
    // Manuel güncellenecek liste
    { id: "123456789", username: "https://t.me/LiraKurdiTest", isPremium: true, gameBalance: 100 }, // Örnek Stars bakiyesi
    { id: "987654321", username: "https://t.me/AnotherUser", isPremium: false, gameBalance: 0 }
];

window.isPremiumUser = false;

function checkPremiumStatus() {
    const userId = document.getElementById('userIdProfile').textContent;
    const user = premiumUsers.find(u => u.id === userId);
    window.isPremiumUser = user ? user.isPremium : false;
    window.gameBalance = user ? user.gameBalance : 0;
    document.getElementById('premiumStatus').textContent = window.isPremiumUser ? 'Yes' : 'No';
}

function subscribePremium() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    window.Telegram.WebApp.openLink('https://t.me/tribute/app?startapp=suJQ');
}
