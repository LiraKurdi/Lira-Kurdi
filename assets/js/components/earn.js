// assets/js/components/earn.js - TAM DOSYA İÇERİĞİ

import { POOL_ADDRESS } from '../config.js';

const Earn = {
    render: () => {
        return `
            <div class="space-y-6">
                <div class="card rounded-2xl shadow-sm overflow-hidden">
                    <div class="earn-card-header p-6 flex items-center gap-4 text-white">
                        <div class="bg-white/20 rounded-xl p-2 flex-shrink-0">
                             <img src="assets/images/stonfi-logo.png" alt="Ston.fi Logo" class="h-8"/>
                        </div>
                        <div>
                            <p class="font-bold text-lg">LKURD / TON Havuzu</p>
                            <p class="text-sm opacity-80">Varlıklarınla pasif gelir elde et</p>
                        </div>
                    </div>
                </div>

                <div class="card p-4 rounded-xl">
                    <h3 class="font-bold text-lg mb-4">Neden Likidite Sağlamalısın?</h3>
                    <div class="advantages-list">
                        <div class="advantage-item">
                            <div class="advantage-icon"><span class="material-symbols-outlined">paid</span></div>
                            <div>
                                <p class="font-semibold">İşlem Ücreti Kazancı</p>
                                <p class="text-sm hint-color mt-1">Havuzdaki her alım-satım işleminden pay alarak LKURD ve TON birikimini artırırsın.</p>
                            </div>
                        </div>
                        <div class="advantage-item">
                            <div class="advantage-icon"><span class="material-symbols-outlined">account_balance</span></div>
                            <div>
                                <p class="font-semibold">Pasif Gelir Fırsatı</p>
                                <p class="text-sm hint-color mt-1">Varlıklarının boşta durması yerine, senin için sürekli çalışan bir gelir modeline dönüştür.</p>
                            </div>
                        </div>
                         <div class="advantage-item">
                            <div class="advantage-icon"><span class="material-symbols-outlined">public</span></div>
                            <div>
                                <p class="font-semibold">Projeyi Destekle</p>
                                <p class="text-sm hint-color mt-1">Yüksek likidite, Lira Kurdi'nin fiyat istikrarını artırır ve ekosistemin büyümesine yardımcı olur.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <a href="https://app.ston.fi/pools/${POOL_ADDRESS}" target="_blank" class="w-full block text-center text-base font-semibold rounded-lg py-3 bg-[var(--primary-color)] text-[var(--primary-text-color)] transition-opacity hover:opacity-90 shadow-lg shadow-[var(--primary-color)]/30">
                   Hemen Likidite Ekle
                </a>
            </div>
        `;
    },
    // VERİ ÇEKME FONKSİYONU TAMAMEN KALDIRILDI.
    init: () => {} 
};

export default Earn;