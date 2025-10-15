// assets/js/components/home.js - TAM DOSYA İÇERİĞİ
import { fetchJettonSupply, fetchPoolData } from '../api.js';

const Home = {
    render: () => {
        // Ana sayfanın HTML'i tamamen yenilendi.
        return `
            <div class="space-y-6">
                <div class="card p-6 rounded-2xl shadow-sm">
                    <div class="flex items-center gap-4 mb-4">
                        <img src="https://storage.dyor.io/jettons/images/1741602289/05822800.jpeg" alt="Lira Kurdi Logo" class="w-12 h-12 rounded-full">
                        <div>
                            <p class="text-xl font-bold">Lira Kurdi</p>
                            <p class="text-sm hint-color">LKURD / TON</p>
                        </div>
                    </div>
                    
                    <div class="flex items-end gap-3">
                        <p id="lkurd-price" class="text-4xl font-bold leading-none"><span class="skeleton w-48 h-10 inline-block"></span></p>
                        <div id="price-change" class="text-lg font-bold leading-none mb-1"><span class="skeleton w-20 h-6 inline-block"></span></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="card p-4 rounded-xl">
                        <p class="text-sm font-medium hint-color">Toplam Arz</p>
                        <strong id="data-total-supply" class="block mt-1 font-mono text-lg"><span class="skeleton w-32 h-6 inline-block"></span></strong>
                    </div>
                    <div class="card p-4 rounded-xl">
                        <p class="text-sm font-medium hint-color">Toplam Likidite</p>
                        <strong id="pool-liquidity" class="block mt-1 font-mono text-lg"><span class="skeleton w-24 h-6 inline-block"></span></strong>
                    </div>
                    <div class="card p-4 rounded-xl">
                        <p class="text-sm font-medium hint-color">24s Hacim</p>
                        <strong id="pool-volume" class="block mt-1 font-mono text-lg"><span class="skeleton w-20 h-6 inline-block"></span></strong>
                    </div>
                </div>
            </div>
        `;
    },
    init: async () => {
        // Gerekli tüm verileri çek ve ekrana bas
        fetchJettonSupply().then(supply => {
            document.getElementById('data-total-supply').textContent = supply.split(' ')[0]; // Sadece sayıyı al
        });

        fetchPoolData().then(data => {
            if (data.success) {
                document.getElementById('lkurd-price').textContent = data.lkurdPrice;
                document.getElementById('pool-liquidity').textContent = data.liquidity;
                document.getElementById('pool-volume').textContent = data.volume;
                
                // Fiyat değişimini işle ve renklendir
                const priceChangeElem = document.getElementById('price-change');
                const change = data.priceChange;
                const sign = change > 0 ? '+' : '';
                priceChangeElem.textContent = `${sign}${change.toFixed(2)}%`;
                priceChangeElem.classList.remove('text-green-600', 'text-red-600');
                priceChangeElem.classList.add(change >= 0 ? 'text-green-600' : 'text-red-600');
            } else {
                // Hata durumunda iskelet animasyonu kalır.
                console.error(data.message);
            }
        });
    }
};

export default Home;