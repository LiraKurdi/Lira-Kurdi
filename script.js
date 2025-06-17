window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
    }, 2000);

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        const initData = window.Telegram.WebApp.initDataUnsafe;
        if (initData.user) {
            document.getElementById('fullName').textContent = `${initData.user.first_name || ''} ${initData.user.last_name || ''}`.trim() || 'Guest';
            document.getElementById('telegramLink').textContent = `@${initData.user.username || 'Guest'}`;
            document.getElementById('telegramLink').href = `https://t.me/${initData.user.username || ''}`;
            document.getElementById('userId').textContent = initData.user.id || 'N/A';
            document.getElementById('language').textContent = initData.user.language_code || 'N/A';
            document.getElementById('premium').textContent = initData.user.is_premium ? 'Yes' : 'No';
            document.getElementById('allowsPm').textContent = initData.user.allows_write_to_pm ? 'Yes' : 'No';
            if (initData.user.photo_url) {
                document.getElementById('profilePhoto').src = initData.user.photo_url;
                document.getElementById('profilePhoto').classList.remove('d-none');
            }
        }
        window.Telegram.WebApp.MainButton
            .setText('View Profile')
            .show()
            .onClick(() => showPage('profile'));
        window.Telegram.WebApp.BackButton.hide();
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
            document.querySelectorAll('.balance-item span:nth-child(3) span').forEach(el => el.innerText = 'N/A');
        });

    updateLkurdBalance(100); // Başlangıç bakiyesi
});

function updateLkurdBalance(amount) {
    const formatted = amount.toFixed(2);
    document.getElementById('lkurdBalance').textContent = `${formatted} LKURD - ₺${formatted}`;
}

function connectWallet() {
    window.open('https://t.me/wallet', '_blank');
}

function topUpBalance() {
    const amount = parseFloat(document.getElementById('topUpAmount').value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    alert(`Purchasing ${amount} $LKURD with Telegram Stars (1 $LKURD = 1 TL)...`);
    const currentBalance = parseFloat(document.getElementById('lkurdBalance').textContent.split(' ')[0]);
    updateLkurdBalance(currentBalance + amount);
    document.getElementById('topUpAmount').value = '';
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('d-none'));
    document.getElementById(pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[onclick="showPage('${pageId}')"]`).classList.add('active');
}
