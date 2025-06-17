window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
    }, 2000);

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setViewportData({ isExpanded: true });
        window.Telegram.WebApp.MainButton.hide();
        window.Telegram.WebApp.BackButton.hide();
        loadTransactions();
        checkPremiumStatus();
    }

    fetchPrices();
    updateBalance('LKURD');

    document.getElementById('currencySelect').addEventListener('change', (e) => updateBalance(e.target.value));
    document.getElementById('currencySelectProfile').addEventListener('change', (e) => updateBalance(e.target.value));
});

function transitionPage(url) {
    document.getElementById('main-content').classList.add('d-none');
    document.getElementById('transition').classList.remove('d-none');
    setTimeout(() => {
        window.location.href = url;
    }, 1000);
}

function checkPremium(appName) {
    if (appName === 'Hez Dating' && !window.isPremiumUser) {
        window.Telegram.WebApp.showAlert('Premium required for Hez Dating!');
        window.Telegram.WebApp.openLink('https://t.me/tribute/app?startapp=suJQ');
    } else {
        window.Telegram.WebApp.showAlert(`${appName} is coming soon!`);
    }
}

async function fetchPrices() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTRY');
        const data = await response.json();
        window.usdtryPrice = parseFloat(data.price);
    } catch (error) {
        console.error('Binance API Error:', error);
        window.usdtryPrice = null;
    }
}

function updateBalance(currency) {
    const balance = 0.00;
    let displayText = '';
    let logoSrc = 'images/logo.png';
    let symbol = currency;

    switch (currency) {
        case 'LKURD':
            displayText = `${balance.toFixed(2)} LKURD - ₺${balance.toFixed(2)}`;
            break;
        case 'USDT':
            const tryValue = window.usdtryPrice ? (balance * window.usdtryPrice).toFixed(2) : 'N/A';
            displayText = `${balance.toFixed(2)} USDT - ₺${tryValue}`;
            logoSrc = '';
            break;
        case 'TRY':
            displayText = `${balance.toFixed(2)} TRY`;
            logoSrc = '';
            symbol = '₺';
            break;
    }

    document.getElementById('balance').textContent = displayText;
    document.getElementById('currencySymbol').textContent = symbol;
    document.getElementById('currencyLogo').src = logoSrc || '';
    document.getElementById('currencyLogo').style.display = logoSrc ? 'inline' : 'none';
    document.getElementById('balanceProfile').textContent = displayText;
    document.getElementById('currencySymbolProfile').textContent = symbol;
    document.getElementById('currencyLogoProfile').src = logoSrc || '';
    document.getElementById('currencyLogoProfile').style.display = logoSrc ? 'inline' : 'none';

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.CloudStorage.setItem('selectedCurrency', currency);
    }
}

function topUpBalance() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    const amount = parseFloat(document.getElementById('topUpAmount').value);
    if (!amount || amount <= 0) {
        window.Telegram.WebApp.showAlert('Please enter a valid amount.');
        return;
    }
    addTransaction(`Bought ${amount.toFixed(2)} $LKURD`);
    window.Telegram.WebApp.showPopup({
        title: 'Success!',
        message: `Purchased ${amount} $LKURD with Telegram Stars!`,
        buttons: [{ type: 'ok' }]
    });
    document.getElementById('topUpAmount').value = '';
}

function addTransaction(description) {
    window.Telegram.WebApp.CloudStorage.getItem('transactions', (err, data) => {
        const transactions = data ? JSON.parse(data) : [];
        const newTransaction = {
            description,
            date: new Date().toLocaleString()
        };
        transactions.unshift(newTransaction);
        if (transactions.length > 10) transactions.pop();
        window.Telegram.WebApp.CloudStorage.setItem('transactions', JSON.stringify(transactions));
        loadTransactions();
    });
}

function loadTransactions() {
    window.Telegram.WebApp.CloudStorage.getItem('transactions', (err, data) => {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';
        if (!data) {
            transactionList.innerHTML = '<li class="list-group-item">No transactions yet.</li>';
            return;
        }
        const transactions = JSON.parse(data);
        transactions.forEach(tx => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${tx.description} - ${tx.date}`;
            transactionList.appendChild(li);
        });
    });
}

function showPage(pageId) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
    document.querySelectorAll('.page').forEach(page => page.classList.add('d-none'));
    document.getElementById(pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[onclick="showPage('${pageId}')"]`).classList.add('active');
}
