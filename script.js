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
        .setText('Connect Wallet')
        .show()
        .onClick(() => window.location.href = 'profile/profile.html');
    window.Telegram.WebApp.BackButton.hide();
}
