const premiumUsers = [
    // Manuel güncellenecek liste
    // Örnek: { id: "123456789", username: "https://t.me/UserName", isPremium: true }
    { id: "123456789", username: "https://t.me/LiraKurdiTest", isPremium: true },
    { id: "987654321", username: "https://t.me/AnotherUser", isPremium: false }
];

window.isPremiumUser = false;

function checkPremiumStatus() {
    // ID çekimi kaldırıldı, manuel kontrol
    const userId = document.getElementById('userIdProfile').textContent;
    const user = premiumUsers.find(u => u.id === userId);
    window.isPremiumUser = user ? user.isPremium : false;
    document.getElementById('premiumStatus').textContent = window.isPremiumUser ? 'Yes' : 'No';
}

function subscribePremium() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    window.Telegram.WebApp.openLink('https://t.me/tribute/app?startapp=suJQ');
    // Manuel güncelleme için premiumUsers listesine ekle
}
