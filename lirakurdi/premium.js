const premiumUsers = [
    { id: "123456789", username: "https://t.me/LiraKurdiTest", isPremium: true, stars: 100, ton: 0.01, lkurd: 1000 },
    { id: "987654321", username: "https://t.me/AnotherUser", isPremium: false, stars: 0, ton: 0, lkurd: 0 }
];

window.isPremiumUser = false;

function checkPremiumStatus() {
    const userId = document.getElementById('userIdProfile').textContent;
    const user = premiumUsers.find(u => u.id === userId);
    window.isPremiumUser = user ? user.isPremium : false;
    document.getElementById('premiumStatus').textContent = window.isPremiumUser ? 'Yes' : 'No';
    if (user && window.firebase?.database) {
        const db = firebase.database();
        db.ref('users/' + userId).set({
            username: user.username,
            isPremium: user.isPremium,
            stars: user.stars,
            ton: user.ton,
            lkurd: user.lkurd
        });
    }
}

function subscribePremium() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    window.Telegram.WebApp.openLink('https://t.me/tribute/app?startapp=suJQ');
}