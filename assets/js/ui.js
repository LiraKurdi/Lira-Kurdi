import { tg } from './config.js';

const profileModal = document.getElementById('profile-modal');
const profileModalOverlay = document.getElementById('profile-modal-overlay');
const profileGreeting = document.getElementById('profile-greeting');

// Profil penceresini gösterir
export function showProfileModal() {
    const userName = tg.initDataUnsafe.user?.first_name || 'Dostum';
    profileGreeting.textContent = `Selam, ${userName}! 👋`;

    profileModal.classList.remove('hidden');
    profileModalOverlay.classList.remove('hidden');
}

// Profil penceresini gizler
export function hideProfileModal() {
    profileModal.classList.add('hidden');
    profileModalOverlay.classList.add('hidden');
}

// Adresi kısaltan yardımcı fonksiyon
export function truncateAddress(address, start = 4, end = 4) { 
    if (!address) return ''; 
    return `${address.substring(0, start)}...${address.substring(address.length - end)}`; 
}

// Explorer URL'i oluşturan fonksiyon
export function getExplorerUrl(network, address) { 
    switch (network) { 
        case 'Bitcoin': return `https://www.blockchain.com/btc/address/${address}`; 
        case 'Ethereum': return `https://etherscan.io/address/${address}`; 
        case 'Solana': return `https://solscan.io/account/${address}`; 
        case 'Tron': return `https://tronscan.org/#/address/${address}`; 
        default: return '#'; 
    } 
}

// Kopyalama butonları için genel olay dinleyici
export function setupCopyListeners() {
    document.body.addEventListener('click', e => {
        const trigger = e.target.closest('.copy-trigger'); 
        if (!trigger) return;
        
        tg.HapticFeedback.notificationOccurred('success');
        const textToCopy = trigger.dataset.clipboardText || '';
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
        }
    });
}

// Telegram tema değişikliklerini uygula
export function applyTheme() {
    const theme = tg.colorScheme === 'dark' ? 'dark' : 'light';
    document.documentElement.className = theme;
    document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color || (theme === 'dark' ? '#3b82f6' : '#2563eb'));
    document.documentElement.style.setProperty('--primary-text-color', tg.themeParams.button_text_color || '#ffffff');
    return theme;
}