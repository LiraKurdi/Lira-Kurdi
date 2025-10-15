// assets/js/components/wallet.js - TAM DOSYA İÇERİĞİ

import { PROJECT_WALLETS } from '../config.js';
import { truncateAddress, getExplorerUrl } from '../ui.js';

// Seçilen cüzdanın arayüzünü güncelleyen yardımcı fonksiyon
const updateWalletView = (wallet) => {
    // Gerekli HTML elementlerini seç
    const selectedLogo = document.getElementById('selected-wallet-logo');
    const selectedName = document.getElementById('selected-wallet-name');
    const balanceCrypto = document.getElementById('wallet-balance-crypto');
    const addressPanel = document.getElementById('wallet-address-panel');
    const actionButtonsContainer = document.getElementById('action-buttons-container');
    const comingSoonText = document.getElementById('coming-soon-text');

    // 1. Seçili cüzdan butonunu güncelle
    selectedLogo.src = wallet.logo;
    selectedName.textContent = wallet.network;

    // 2. Seçilen cüzdanın türüne göre arayüzü değiştir
    if (wallet.symbol === 'STAR') {
        // EĞER SEÇİLEN STARS İSE:
        balanceCrypto.innerHTML = `<span class="material-symbols-outlined text-yellow-400 text-base align-middle">star</span> 0`;
        // Butonları "Ödül/Geçmiş" olarak değiştir
        actionButtonsContainer.innerHTML = `
            <button class="action-button opacity-50 cursor-not-allowed w-full py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center gap-1">
                <span class="material-symbols-outlined">military_tech</span>
                <span class="text-sm font-semibold">Ödül Talep Et</span>
            </button>
            <button class="action-button opacity-50 cursor-not-allowed w-full py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center gap-1">
                <span class="material-symbols-outlined">history</span>
                <span class="text-sm font-semibold">İşlem Geçmişi</span>
            </button>
        `;
        // Alttaki adres panelini gizle
        addressPanel.classList.add('hidden');
        comingSoonText.textContent = "Stars özelliği çok yakında!";

    } else {
        // EĞER SEÇİLEN BTC, ETH GİBİ BİR CÜZDAN İSE:
        balanceCrypto.textContent = `0.0000 ${wallet.symbol}`;
        // Butonları "Gönder/Al" olarak değiştir
        actionButtonsContainer.innerHTML = `
            <button class="action-button opacity-50 cursor-not-allowed w-full py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center gap-1">
                <span class="material-symbols-outlined">arrow_upward</span>
                <span class="text-sm font-semibold">Gönder</span>
            </button>
            <button class="action-button opacity-50 cursor-not-allowed w-full py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center gap-1">
                <span class="material-symbols-outlined">arrow_downward</span>
                <span class="text-sm font-semibold">Al</span>
            </button>
        `;
        // Alttaki adres panelini göster ve bilgileri doldur
        addressPanel.classList.remove('hidden');
        document.getElementById('wallet-address').textContent = truncateAddress(wallet.address);
        document.getElementById('wallet-copy-button').dataset.clipboardText = wallet.address;
        document.getElementById('wallet-explorer-link').href = getExplorerUrl(wallet.network, wallet.address);
        comingSoonText.textContent = "Cüzdan özelliği çok yakında!";
    }

    // Butonlara yeniden "yakında" uyarısı ekle
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', () => alert('Bu özellik çok yakında hizmetinize sunulacaktır.'));
    });
};

const Wallet = {
    render: () => {
        // Sevdiğin eski tasarımın HTML yapısı
        return `
            <div class="space-y-4">
                <div class="relative">
                    <button id="wallet-selector-button" class="card w-full p-3 rounded-xl flex items-center justify-between text-left">
                        <div class="flex items-center gap-4">
                            <img id="selected-wallet-logo" src="" alt="logo" class="w-10 h-10"/>
                            <div>
                                <p id="selected-wallet-name" class="font-semibold text-base"></p>
                                <p class="text-sm hint-color">Cüzdanı / Ağı Değiştir</p>
                            </div>
                        </div>
                        <span class="material-symbols-outlined hint-color">expand_more</span>
                    </button>
                    <div id="wallet-dropdown-list" class="dropdown-menu card p-2 rounded-xl shadow-lg hidden"></div>
                </div>

                <div class="card p-6 rounded-2xl text-center space-y-6">
                    <div>
                        <p class="text-sm hint-color">Toplam Bakiye</p>
                        <p id="wallet-balance-usd" class="text-3xl font-bold mt-1">$0.00</p>
                        <p id="wallet-balance-crypto" class="font-mono text-sm hint-color"></p>
                    </div>
                    <div id="action-buttons-container" class="grid grid-cols-2 gap-4"></div>
                     <p id="coming-soon-text" class="text-xs hint-color font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-full py-1 px-3 inline-block">
                        <span class="material-symbols-outlined text-xs align-middle mr-1">construction</span>
                        Cüzdan özelliği çok yakında!
                     </p>
                </div>
                
                <div id="wallet-address-panel" class="card p-4 rounded-xl flex items-center justify-between gap-2">
                    <div class="min-w-0">
                        <p class="text-sm hint-color">Cüzdan Adresi</p>
                        <p id="wallet-address" class="font-mono text-sm break-all"></p>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <button id="wallet-copy-button" data-clipboard-text="" class="copy-trigger icon-btn"><span class="material-symbols-outlined">content_copy</span></button>
                        <a id="wallet-explorer-link" href="#" target="_blank" class="icon-btn"><span class="material-symbols-outlined">open_in_new</span></a>
                    </div>
                </div>
            </div>
        `;
    },
    init: () => {
        const selectorButton = document.getElementById('wallet-selector-button');
        const dropdownList = document.getElementById('wallet-dropdown-list');

        dropdownList.innerHTML = PROJECT_WALLETS.map(wallet => `
            <button data-wallet-symbol="${wallet.symbol}" class="wallet-option w-full flex items-center gap-3 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-left">
                <img src="${wallet.logo}" class="w-8 h-8"/>
                <span class="text-sm font-medium">${wallet.network}</span>
            </button>
        `).join('');

        // Başlangıçta Stars cüzdanını göster
        updateWalletView(PROJECT_WALLETS[0]);

        selectorButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownList.classList.toggle('hidden');
        });
        
        dropdownList.querySelectorAll('.wallet-option').forEach(button => {
            button.addEventListener('click', () => {
                const selectedWallet = PROJECT_WALLETS.find(w => w.symbol === button.dataset.walletSymbol);
                updateWalletView(selectedWallet);
                dropdownList.classList.add('hidden');
            });
        });

        document.addEventListener('click', (e) => {
            if (!selectorButton.contains(e.target)) {
                dropdownList.classList.add('hidden');
            }
        });
    }
};

export default Wallet;