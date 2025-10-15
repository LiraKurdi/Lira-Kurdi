// assets/js/router.js - TAM DOSYA İÇERİĞİ
import Home from './components/home.js';
import Apps from './components/apps.js';
import Trade from './components/trade.js';
import Earn from './components/earn.js';
import Wallet from './components/wallet.js';
import Profile from './components/profile.js'; // Yeni sayfayı import et

const routes = { 'home': Home, 'apps': Apps, 'trade': Trade, 'earn': Earn, 'wallet': Wallet, 'profile': Profile }; // Yeni sayfayı ekle
const appContent = document.getElementById('app-content');
const navButtons = document.querySelectorAll('.nav-button');
const navActiveIndicator = document.getElementById('nav-active-indicator');

export function navigateTo(routeName) {
    const view = routes[routeName] || routes['home'];
    appContent.innerHTML = view.render();
    if (view.init) view.init();
    
    let activeButton = null;
    navButtons.forEach(button => {
        // Ayarlar sayfasındaysak hiçbirini aktif yapma
        const isActive = button.dataset.route === routeName && routeName !== 'profile';
        button.classList.toggle('active', isActive);
        if (isActive) {
            activeButton = button;
        }
    });

    if (activeButton) {
        // Eğer bir buton aktifse göstergeyi hareket ettir
        const width = activeButton.offsetWidth;
        const left = activeButton.offsetLeft;
        navActiveIndicator.style.width = `${width}px`;
        navActiveIndicator.style.transform = `translateX(${left}px)`;
        navActiveIndicator.style.opacity = '0.1'; // Göstergeyi görünür yap
    } else {
        // Değilse (Ayarlar sayfasındaysak) göstergeyi gizle
        navActiveIndicator.style.opacity = '0';
    }
    
    window.scrollTo(0, 0);
}