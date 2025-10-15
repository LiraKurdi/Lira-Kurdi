// assets/js/main.js - TAM DOSYA İÇERİĞİ
import { tg } from './config.js';
import { navigateTo } from './router.js';
import { setupCopyListeners } from './ui.js';

// Tema ayarlarını Telegram'dan ve localStorage'dan alıp uygulama
function initializeTheme() {
    const theme = tg.colorScheme === 'dark' ? 'dark' : 'light';
    document.documentElement.className = theme;
    document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color || (theme === 'dark' ? '#3b82f6' : '#2563eb'));
    document.documentElement.style.setProperty('--primary-text-color', tg.themeParams.button_text_color || '#ffffff');
    return theme;
}

document.addEventListener('DOMContentLoaded', () => {
    tg.ready();
    tg.expand();
    initializeTheme();
    tg.onEvent('themeChanged', initializeTheme);
    setupCopyListeners();

    // Alt navigasyon butonları
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            navigateTo(button.dataset.route);
        });
    });

    // Profil butonuna tıklandığında artık Ayarlar sayfasına yönlendiriyor
    document.getElementById('profile-button').addEventListener('click', () => {
        navigateTo('profile');
    });

    // Uygulamayı Başlat
    navigateTo('home'); 
});