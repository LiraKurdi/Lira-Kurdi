window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').classList.add('d-none');
        document.getElementById('login').classList.remove('d-none');
    }, 2000);

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setViewportData({ isExpanded: true });
        window.Telegram.WebApp.BackButton.show().onClick(() => exitGame());
    }
});

const icons = ['cherry', 'lemon', 'seven', 'bar'];
let currentBalance = 0;

function login() {
    const userId = document.getElementById('userIdInput').value.trim();
    if (!userId) {
        window.Telegram.WebApp.showAlert('Please enter a valid ID.');
        return;
    }
    document.getElementById('userIdProfile').textContent = userId;
    checkPremiumStatus();
    if (!window.isPremiumUser) {
        window.Telegram.WebApp.showAlert('Premium required to play!');
        window.Telegram.WebApp.openLink('https://t.me/tribute/app?startapp=suJQ');
        return;
    }
    currentBalance = window.gameBalance;
    document.getElementById('gameBalance').textContent = currentBalance;
    document.getElementById('login').classList.add('d-none');
    document.getElementById('main-content').classList.remove('d-none');
}

function spinSlot() {
    if (currentBalance < 1) {
        window.Telegram.WebApp.showAlert('Not enough Stars!');
        return;
    }
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    currentBalance -= 1;
    document.getElementById('gameBalance').textContent = currentBalance;

    const reels = document.querySelectorAll('.slot-reel');
    reels.forEach(reel => {
        reel.classList.add('spinning');
        const icons = reel.querySelectorAll('.slot-icon');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        setTimeout(() => {
            reel.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const img = document.createElement('img');
                img.src = randomIcon.src;
                img.alt = randomIcon.alt;
                img.className = 'slot-icon';
                reel.appendChild(img);
            }
            reel.classList.remove('spinning');
        }, 1000);
    });

    setTimeout(() => {
        const results = Array.from(reels).map(reel => {
            return reel.querySelector('.slot-icon').alt.toLowerCase();
        });
        checkWin(results);
    }, 1000);
}

function checkWin(results) {
    const isWin = results.every((val, i, arr) => val === arr[0]);
    if (isWin && Math.random() < 0.1) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        const reward = Math.floor(Math.random() * 16) + 5; // 5-20 Stars
        currentBalance += reward;
        document.getElementById('gameBalance').textContent = currentBalance;
        window.Telegram.WebApp.showPopup({
            title: 'You Won!',
            message: `You earned ${reward} Stars!`,
            buttons: [{ type: 'ok' }]
        });
    }
}

function withdrawBalance() {
    if (currentBalance <= 0) {
        window.Telegram.WebApp.showAlert('No Stars to withdraw!');
        return;
    }
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    window.Telegram.WebApp.CloudStorage.getItem('liraKurdiBalance', (err, data) => {
        const liraBalance = data ? parseFloat(data) : 77;
        window.Telegram.WebApp.CloudStorage.setItem('liraKurdiBalance', (liraBalance + currentBalance).toString());
        addTransaction(`Withdrew ${currentBalance} Stars from casino`);
        window.Telegram.WebApp.showPopup({
            title: 'Success!',
            message: `${currentBalance} Stars withdrawn to Lira Kurdi wallet!`,
            buttons: [{ type: 'ok' }]
        });
        currentBalance = 0;
        document.getElementById('gameBalance').textContent = currentBalance;
    });
}

function exitGame() {
    if (currentBalance > 0) {
        window.Telegram.WebApp.showConfirm('Unwithdrawn Stars will go to Lira Kurdi. Exit?', confirmed => {
            if (confirmed) {
                finalizeExit();
            }
        });
    } else {
        finalizeExit();
    }
}

function finalizeExit() {
    if (currentBalance > 0) {
        window.Telegram.WebApp.CloudStorage.getItem('liraKurdiBalance', (err, data) => {
            const liraBalance = data ? parseFloat(data) : 77;
            window.Telegram.WebApp.CloudStorage.setItem('liraKurdiBalance', (liraBalance + currentBalance).toString());
            addTransaction(`Forfeited ${currentBalance} Stars to Lira Kurdi`);
        });
    }
    window.location.href = '../index.html';
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
    });
}
