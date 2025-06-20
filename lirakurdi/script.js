window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
    }, 2000);

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setViewportData({ isExpanded: true });
        window.Telegram.WebApp.BackButton.hide();
        loadTransactions();
        checkPremiumStatus();
    }

    initFirebase();
    drawChart();
});

function initFirebase() {
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const userId = document.getElementById('userIdProfile').textContent;
    db.ref('users/' + userId).on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('starsBalance').textContent = data.stars || 0;
            document.getElementById('tonBalance').textContent = data.ton || 0;
            document.getElementById('lkurdBalance').textContent = data.lkurd || 0;
        }
    });
}

function drawChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Stars', 'TON', '$LKURD'],
            datasets: [{
                data: [77, 0.072, 1000000],
                backgroundColor: ['#F3BA2F', '#007aff', '#ff0000']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

async function connectWallet() {
    const connector = new TonConnectSDK.TonConnect({
        manifestUrl: 'https://raw.githubusercontent.com/LiraKurdi/LiraKurdi-Finance/main/tonconnect-manifest.json'
    });
    const wallets = await connector.getWallets();
    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper');
    if (!tonkeeper) {
        window.Telegram.WebApp.showAlert('Tonkeeper not found!');
        return;
    }
    const link = connector.connect({
        bridgeUrl: tonkeeper.bridgeUrl,
        universalLink: tonkeeper.universalLink
    });
    const image = await QRCode.toDataURL(link);
    window.Telegram.WebApp.showPopup({
        title: 'Connect Wallet',
        message: 'Scan the QR code with Tonkeeper.',
        buttons: [{ type: 'ok' }]
    });
    document.getElementById('walletAddress').innerHTML = `<img src="${image}" alt="QR Code" style="width: 200px; margin: 10px auto; display: block;">`;
    connector.onStatusChange(wallet => {
        if (wallet) {
            document.getElementById('walletAddress').textContent = wallet.account.address;
            window.Telegram.WebApp.showAlert(`${wallet.device.appName} wallet connected!`);
        }
    });
}

function addTransaction(description) {
    const db = firebase.database();
    const userId = document.getElementById('userIdProfile').textContent;
    db.ref('transactions/' + userId).push({
        description,
        date: new Date().toLocaleString()
    });
    window.Telegram.WebApp.CloudStorage.getItem('transactions', (err, data) => {
        const transactions = data ? JSON.parse(data) : [];
        const newTransaction = { description, date: new Date().toLocaleString() };
        transactions.unshift(newTransaction);
        if (transactions.length > 10) transactions.pop();
        window.Telegram.WebApp.CloudStorage.setItem('transactions', JSON.stringify(transactions));
        loadTransactions();
    });
}

function loadTransactions() {
    const db = firebase.database();
    const userId = document.getElementById('userIdProfile').textContent;
    db.ref('transactions/' + userId).limitToLast(10).on('value', snapshot => {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';
        const transactions = snapshot.val();
        if (!transactions) {
            transactionList.innerHTML = '<li class="list-group-item">No transactions yet.</li>';
            return;
        }
        Object.values(transactions).reverse().forEach(tx => {
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