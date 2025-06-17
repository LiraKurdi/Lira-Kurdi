if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData.user) {
        document.getElementById('fullName').textContent = `${initData.user.first_name || ''} ${initData.user.last_name || ''}`.trim() || 'Guest';
        document.getElementById('telegramLink').textContent = `@${initData.user.username || 'Guest'}`;
        document.getElementById('telegramLink').href = `https://t.me/${initData.user.username || ''}`;
    }
    window.Telegram.WebApp.MainButton
        .setText('Top Up $LKURD')
        .show()
        .onClick(() => topUpBalance());
    window.Telegram.WebApp.BackButton.show().onClick(() => window.location.href = '../index.html');
}

fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,toncoin,xrp,cardano&vs_currencies=usd")
    .then(response => response.json())
    .then(data => {
        document.getElementById('btc').innerText = `$${data.bitcoin.usd}`;
        document.getElementById('eth').innerText = `$${data.ethereum.usd}`;
        document.getElementById('ton').innerText = `$${data.toncoin.usd}`;
        document.getElementById('xrp').innerText = `$${data.xrp.usd}`;
        document.getElementById('ada').innerText = `$${data.cardano.usd}`;
    })
    .catch(error => {
        console.error('CoinGecko API Error:', error);
        document.querySelectorAll('.balance-item span:nth-child(4) span').forEach(el => el.innerText = 'N/A');
    });

function connectWallet() {
    // Placeholder: TON Wallet bağlantısı
    window.open('https://t.me/wallet', '_blank');
}

function topUpBalance() {
    const amount = parseFloat(document.getElementById('topUpAmount').value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    // Mock Telegram Stars ödeme
    alert(`Purchasing ${amount} $LKURD with Telegram Stars (1 $LKURD = 1 TL)...`);
    const currentBalance = parseFloat(document.getElementById('lkurdBalance').textContent);
    document.getElementById('lkurdBalance').textContent = (currentBalance + amount).toFixed(2);
    document.getElementById('topUpAmount').value = '';
}
