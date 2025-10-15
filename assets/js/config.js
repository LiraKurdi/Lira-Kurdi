// assets/js/config.js - TAM DOSYA İÇERİĞİ

// Telegram Web App nesnesi (fallback ile birlikte)
export const tg = window.Telegram?.WebApp || { 
    ready: () => {}, 
    expand: () => {}, 
    onEvent: () => {}, 
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', 
    initDataUnsafe: { user: { first_name: 'Dostum', language_code: 'tr' } }, 
    themeParams: {},
    HapticFeedback: { notificationOccurred: () => {}, impactOccurred: () => {} } 
};

// Proje Sabitleri
export const JETTON_ADDRESS = 'EQDVazmnZdangGkxS8Leytry3xkdYL6LjOIGsy_yGesS5vap';
export const OWNER_ADDRESS = 'UQB2hUHdOFJHUwZRYsKRBO4kJeufMHbmaBC1WOPIkxRPIOcC';
export const POOL_ADDRESS = 'EQCe-fdxr1WiYHurdI-uOQKSyFOUbL9XAs6VT9pYYP6i3Gww';

// Proje Cüzdan Adresleri ("Stars" en başta)
export const PROJECT_WALLETS = [
    { 
        network: 'Stars', 
        symbol: 'STAR', 
        address: 'Dahili Bakiye', // Bunun bir adresi yok
        // Logo için bir PNG yerine doğrudan SVG kodu kullanıyoruz, böylece yeni dosya gerekmez.
        logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FBBF24'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E`
    },
    { network: 'Bitcoin', symbol: 'BTC', address: '127w5aoZtVD7M3LRrxJkC6zNjk2UF6QxKu', logo: 'assets/images/btc-logo.png' }, 
    { network: 'Ethereum', symbol: 'ETH', address: '0x5b29C538c29A88190F4AEEd479A6D91179dea808', logo: 'assets/images/eth-logo.png' }, 
    { network: 'Solana', symbol: 'SOL', address: '8Qt3hC52dZBtVyq8eK2Ncn1D2DrKgCjLZC8piRs6gGoA', logo: 'assets/images/sol-logo.png' }, 
    { network: 'Tron', symbol: 'TRX', address: 'TBQks6yLwX94YY2MdsVr6Y2gSrPeegFZBW', logo: 'assets/images/tron-logo.png' }
];

// Uygulama Listesi (Kategorilere Ayrılmış)
export const PROJECT_APPS = [
    {
        name: 'aaGameTONBot',
        logo: 'assets/images/apps/aa-logo.png',
        description: 'TON Ağı üzerinde oyunlar oynayın.',
        category: 'Oyun',
        url: 'https://t.me/aaGameTONBot'
    },
    {
        name: 'Kurdistan24 Türkçe',
        logo: 'assets/images/apps/k24-logo.png',
        description: 'En güncel haberleri takip edin.',
        category: 'Haber',
        url: 'https://t.me/K24Turkce'
    },
    {
        name: 'KMovie Archive',
        logo: 'assets/images/apps/kmovie-logo.png',
        description: 'Popüler filmler ve diziler arşivi.',
        category: 'Dijital İçerik',
        url: 'https://t.me/KMovie_Archive'
    }
];

// Sosyal Medya ve İletişim Linkleri
export const COMMUNITY_LINKS = [
    { key: "community_telegram", icon: "fa-telegram", url: "https://t.me/LiraKurdiChat" }, 
    { key: "community_twitter", icon: "fa-twitter", url: "https://x.com/LiraKurdi" }, 
    { key: "community_instagram", icon: "fa-instagram", url: "https://www.instagram.com/lirakurdi/" }, 
    { key: "community_youtube", icon: "fa-youtube", url: "https://www.youtube.com/@LiraKurdi" }, 
    { key: "community_github", icon: "fa-github", url: "https://github.com/LiraKurdi/Lira-Kurdi" }, 
    { key: "community_email", icon: "fa-envelope", url: "mailto:kurdishlira@gmail.com" }
];

// Dil ve Çeviri Verileri
export const LANGUAGE_DATA = { 
    tr: { name: "Türkçe" }, 
    en: { name: "English" }, 
    ku: { name: "Kurdî" } 
};
export const TRANSLATIONS = {
    tr: { community_telegram: "Telegram", community_twitter: "X (Twitter)", community_instagram: "Instagram", community_youtube: "YouTube", community_github: "GitHub", community_email: "E-Posta" },
    en: { community_telegram: "Telegram", community_twitter: "X (Twitter)", community_instagram: "Instagram", community_youtube: "YouTube", community_github: "GitHub", community_email: "E-Mail" },
    ku: { community_telegram: "Telegram", community_twitter: "X (Twitter)", community_instagram: "Instagram", community_youtube: "YouTube", community_github: "GitHub", community_email: "E-name" }
};