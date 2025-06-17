window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
    }, 2000);

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setViewportData({ isExpanded: true }); // Tam ekran
        const initData = window.Telegram.WebApp.initDataUnsafe;
        if (initData.user) {
            document.getElementById('userName').textContent = initData.user.username || 'Guest';
            document.getElementById('userId').textContent = initData.user.id || 'N/A';
            document.getElementById('fullName').textContent = `${initData.user.first_name || ''} ${initData.user.last_name || ''}`.trim() || 'Guest';
            document.getElementById('telegramLink').textContent = `@${initData.user.username || 'Guest'}`;
            document.getElementById('telegramLink').href = `https://t.me/${initData.user.username || ''}`;
            document.getElementById('userIdProfile').textContent = initData.user.id || 'N/A';
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
        initFarming();
        loadTransactions();
    }

    initChart();
    fetchPrices();
    updateLkurdBalance(100); // Başlangıç bakiyesi
});

// Binance API
async function fetchPrices() {
    try {
        const symbols = ['USDTRY'];
        const prices = {};
        for (const symbol of symbols) {
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
            const data = await response.json();
            prices[symbol] = parseFloat(data.price);
        }
        document.getElementById('usdtBalance').innerText = `0.00 USDT - ₺${(0 * prices.USDTRY).toFixed(2)}`;
        document.getElementById('usdtBalanceProfile').innerText = `0.00 USDT - ₺${(0 * prices.USDTRY).toFixed(2)}`;
    } catch (error) {
        console.error('Binance API Error:', error);
        document.getElementById('usdtBalance').innerText = '0.00 USDT - ₺N/A';
        document.getElementById('usdtBalanceProfile').innerText = '0.00 USDT - ₺N/A';
    }
}

function updateLkurdBalance(amount) {
    const formatted = amount.toFixed(2);
    document.getElementById('lkurdBalance').textContent = `${formatted} LKURD - ₺${formatted}`;
    document.getElementById('lkurdBalanceProfile').textContent = `${formatted} LKURD - ₺${formatted}`;
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.CloudStorage.setItem('lkurdBalance', formatted);
    }
}

function connectWallet() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    window.open('https://t.me/wallet', '_blank');
}

function topUpBalance() {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    const amount = parseFloat(document.getElementById('topUpAmount').value);
    if (!amount || amount <= 0) {
        window.Telegram.WebApp.showAlert('Please enter a valid amount.');
        return;
    }
    const currentBalance = parseFloat(document.getElementById('lkurdBalance').textContent.split(' ')[0]);
    updateLkurdBalance(currentBalance + amount);
    addTransaction(`Bought ${amount.toFixed(2)} $LKURD`);
    window.Telegram.WebApp.showPopup({
        title: 'Success!',
        message: `Purchased ${amount} $LKURD with Telegram Stars!`,
        buttons: [{ type: 'ok' }]
    });
    document.getElementById('topUpAmount').value = '';
}

function initFarming() {
    const FARMING_INTERVAL = 15 * 60 * 60 * 1000; // 15 saat
    const REWARD = 8;

    window.Telegram.WebApp.CloudStorage.getItem('lastClaim', (err, lastClaim) => {
        const now = Date.now();
        const lastClaimTime = lastClaim ? parseInt(lastClaim) : 0;
        const timeSinceLastClaim = now - lastClaimTime;
        const claimButton = document.getElementById('claimButton');
        const nextClaimSpan = document.getElementById('nextClaim');

        function updateTimer() {
            const timeLeft = FARMING_INTERVAL - (Date.now() - lastClaimTime);
            if (timeLeft <= 0) {
                claimButton.disabled = false;
                nextClaimSpan.textContent = 'Now!';
                claimButton.onclick = () => claimReward();
            } else {
                claimButton.disabled = true;
                const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                nextClaimSpan.textContent = `${hours}h ${minutes}m`;
            }
        }

        function claimReward() {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            const currentBalance = parseFloat(document.getElementById('lkurdBalance').textContent.split(' ')[0]);
            updateLkurdBalance(currentBalance + REWARD);
            addTransaction(`Claimed ${REWARD} $LKURD from farming`);
            window.Telegram.WebApp.CloudStorage.setItem('lastClaim', Date.now().toString());
            lastClaimTime = Date.now();
            window.Telegram.WebApp.showPopup({
                title: 'Reward Claimed!',
                message: `You earned ${REWARD} $LKURD!`,
                buttons: [{ type: 'ok' }]
            });
            updateTimer();
        }

        updateTimer();
        setInterval(updateTimer, 60000);
    });
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

function initChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Content Creators (30%)', 'Platform (40%)', 'Community (30%)'],
            datasets: [{
                data: [30, 40, 30],
                backgroundColor: ['#ff0000', '#007aff', '#ffcc00']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#000',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function showPage(pageId) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
    document.querySelectorAll('.page').forEach(page => page.classList.add('d-none'));
    document.getElementById(pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[onclick="showPage('${pageId}')"]`).classList.add('active');
}
