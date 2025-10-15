// assets/js/components/profile.js - YENİ DOSYA

import { navigateTo } from '../router.js';

// Tema değiştirici fonksiyon
function applyTheme(theme) {
    document.documentElement.className = theme;
    // Telegram'a temanın bizim tarafımızdan değiştirildiğini bildirebiliriz (isteğe bağlı)
    // window.Telegram?.WebApp.setHeaderColor(theme === 'dark' ? '#000000' : '#ffffff');
}

const Profile = {
    render: () => {
        // Mevcut temanın dark olup olmadığını kontrol et
        const isDarkMode = document.documentElement.classList.contains('dark');
        return `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="font-bold text-2xl">Ayarlar</h2>
                    <button id="back-to-home" class="flex items-center gap-2 text-sm font-semibold text-[var(--primary-color)]">
                        <span class="material-symbols-outlined">arrow_back_ios</span>
                        Geri
                    </button>
                </div>

                <div class="card p-4 rounded-xl">
                    <p class="text-sm font-semibold mb-3 hint-color">Görünüm</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined">dark_mode</span>
                            <span class="font-medium">Koyu Mod</span>
                        </div>
                        <label class="theme-switch">
                            <input type="checkbox" id="theme-toggle-checkbox" ${isDarkMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="card p-4 rounded-xl">
                    <p class="text-sm font-semibold mb-3 hint-color">Diğer</p>
                    <div class="flex items-center justify-between">
                         <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined">translate</span>
                            <span class="font-medium">Dil</span>
                        </div>
                        <span class="text-sm hint-color">Türkçe</span>
                    </div>
                </div>
            </div>
        `;
    },
    init: () => {
        // Geri butonuna tıklama olayı
        document.getElementById('back-to-home').addEventListener('click', () => {
            navigateTo('home');
        });

        // Tema değiştiriciye tıklama olayı
        const themeToggle = document.getElementById('theme-toggle-checkbox');
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        });
    }
};

export default Profile;