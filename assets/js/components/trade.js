// assets/js/components/trade.js - TAM DOSYA İÇERİĞİ

import { JETTON_ADDRESS } from '../config.js';

const Trade = {
    render: () => {
        // GeckoTerminal grafiğini buraya taşıdık.
        return `
            <div class="space-y-4">
                <h2 class="font-bold text-xl px-2">LKURD/TON Grafiği</h2>
                <div class="card rounded-2xl shadow-sm overflow-hidden">
                    <iframe id="price-chart-iframe" class="w-full h-[65vh]" frameborder="0"></iframe>
                </div>
            </div>
        `;
    },
    init: () => {
        // Sayfa yüklendiğinde iframe'in kaynağını ayarla.
        const chartFrame = document.getElementById('price-chart-iframe');
        // Mevcut temayı (dark/light) alıp grafiğe yansıtıyoruz.
        const theme = document.documentElement.className || 'light';
        if (chartFrame) {
            chartFrame.src = `https://www.geckoterminal.com/ton/tokens/${JETTON_ADDRESS}?embed=1&theme=${theme}&info=0&lang=tr`;
        }
    }
};

export default Trade;