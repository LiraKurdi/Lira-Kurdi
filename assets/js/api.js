// assets/js/api.js - TAM DOSYA İÇERİĞİ

import { JETTON_ADDRESS } from './config.js';

export async function fetchJettonSupply() {
    try {
        const res = await fetch(`https://tonapi.io/v2/jettons/${JETTON_ADDRESS}`);
        if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
        const data = await res.json();
        const supply = (BigInt(data.total_supply) / BigInt(10 ** data.metadata.decimals)).toString();
        return `${parseInt(supply).toLocaleString('en-US')} ${data.metadata.symbol}`;
    } catch (error) {
        console.error("Toplam arz çekilemedi:", error);
        return 'Veri alınamadı';
    }
}

export async function fetchPoolData() {
    try {
        // API'ye ulaşmak için bir zaman aşımı ekliyoruz (8 saniye)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`https://tonapi.io/v2/jettons/${JETTON_ADDRESS}/pools`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId); // Başarılı olursa zaman aşımını temizle

        if (!res.ok) throw new Error(`API Sunucusu Yanıt Vermiyor (Hata: ${res.status})`);
        
        const d = await res.json();
        if (!d.pools || d.pools.length === 0) throw new Error('API yanıtında havuz verisi bulunamadı.');

        // Adrese göre en doğru havuzu bul
        const pools = d.pools.filter(p => 
            p.token0.metadata?.address === JETTON_ADDRESS || p.token1.metadata?.address === JETTON_ADDRESS
        );
        
        if (pools.length === 0) throw new Error('Bu jeton için aktif bir LKURD/TON havuzu bulunamadı.');

        pools.sort((a, b) => parseFloat(b.total_liquidity_usd) - parseFloat(a.total_liquidity_usd));
        const data = pools[0];
        
        const formatCurrency = v => parseFloat(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const formatPrice = v => '$' + parseFloat(v).toPrecision(6);
        
        const isLKURDToken0 = data.token0.metadata.address === JETTON_ADDRESS;
        const priceChangeRaw = parseFloat(isLKURDToken0 ? data.token0_price_change_24h : data.token1_price_change_24h);

        return {
            success: true,
            liquidity: formatCurrency(data.total_liquidity_usd),
            volume: formatCurrency(data.volume_24h_usd),
            lkurdPrice: formatPrice(isLKURDToken0 ? data.token0_price_usd : data.token1_price_usd),
            lkurdPriceRaw: parseFloat(isLKURDToken0 ? data.token0_price_usd : data.token1_price_usd),
            tonPrice: formatPrice(isLKURDToken0 ? data.token1_price_usd : data.token0_price_usd),
            priceChange: priceChangeRaw
        };
    } catch (error) {
        console.error("Havuz verileri çekilemedi:", error);
        // Hata mesajını daha anlaşılır hale getiriyoruz
        return { 
            success: false, 
            message: error.name === 'AbortError' ? 'Veri sunucusu zaman aşımına uğradı.' : (error.message || "Bilinmeyen bir hata oluştu.")
        };
    }
}