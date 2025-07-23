document.addEventListener('DOMContentLoaded', () => {
    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    
    // Expand the WebApp to full view
    tg.expand();
    
    // Set theme parameters
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#707579');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#3390ec');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#3390ec');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f4f4f5');
    
    // Get user data
    const user = tg.initDataUnsafe.user;
    if (user) {
        document.getElementById('userName').textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        document.getElementById('userPhone').textContent = user.username ? `@${user.username}` : 'Telegram Kullanıcısı';
        
        // Set user avatar
        const userAvatar = document.getElementById('userAvatar');
        if (user.photo_url) {
            userAvatar.style.backgroundImage = `url(${user.photo_url})`;
            userAvatar.style.backgroundSize = 'cover';
        } else {
            const initials = (user.first_name ? user.first_name.charAt(0) : '') + (user.last_name ? user.last_name.charAt(0) : '');
            userAvatar.textContent = initials || 'TU';
        }
    }
    
    // DOM Elements
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.createElement('div');
    overlay.className = 'tg-overlay';
    document.body.appendChild(overlay);
    
    // Navigation buttons
    const navButtons = document.querySelectorAll('.tg-nav-btn');
    const sections = document.querySelectorAll('.tg-section');
    
    // Modal elements
    const sendModal = document.getElementById('sendModal');
    const closeSendModal = document.getElementById('closeSendModal');
    const sendBtn = document.getElementById('sendBtn');
    const walletSendBtn = document.getElementById('walletSendBtn');
    
    const receiveModal = document.getElementById('receiveModal');
    const closeReceiveModal = document.getElementById('closeReceiveModal');
    const receiveBtn = document.getElementById('receiveBtn');
    const walletReceiveBtn = document.getElementById('walletReceiveBtn');
    
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    
    // Menu toggle
    menuBtn.addEventListener('click', () => {
        sideMenu.classList.add('show');
        overlay.classList.add('show');
    });
    
    closeMenuBtn.addEventListener('click', () => {
        sideMenu.classList.remove('show');
        overlay.classList.remove('show');
    });
    
    overlay.addEventListener('click', () => {
        sideMenu.classList.remove('show');
        document.querySelectorAll('.tg-modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
        overlay.classList.remove('show');
    });
    
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${sectionId}Section`).classList.add('active');
        });
    });
    
    // Menu items navigation
    document.querySelectorAll('.tg-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            
            // Close menu
            sideMenu.classList.remove('show');
            overlay.classList.remove('show');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.tg-nav-btn[data-section="${sectionId}"]`).classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${sectionId}Section`).classList.add('active');
        });
    });
    
    // Send money modal
    sendBtn.addEventListener('click', () => {
        sendModal.classList.add('show');
        overlay.classList.add('show');
    });
    
    walletSendBtn.addEventListener('click', () => {
        sendModal.classList.add('show');
        overlay.classList.add('show');
    });
    
    closeSendModal.addEventListener('click', () => {
        sendModal.classList.remove('show');
        overlay.classList.remove('show');
    });
    
    // Receive money modal
    receiveBtn.addEventListener('click', () => {
        receiveModal.classList.add('show');
        overlay.classList.add('show');
    });
    
    walletReceiveBtn.addEventListener('click', () => {
        receiveModal.classList.add('show');
        overlay.classList.add('show');
    });
    
    closeReceiveModal.addEventListener('click', () => {
        receiveModal.classList.remove('show');
        overlay.classList.remove('show');
    });
    
    // Copy wallet address
    copyAddressBtn.addEventListener('click', () => {
        const address = document.getElementById('walletAddress').textContent;
        navigator.clipboard.writeText(address).then(() => {
            tg.showAlert('Cüzdan adresi kopyalandı!');
        });
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        tg.showConfirm('Çıkış yapmak istediğinize emin misiniz?', (confirmed) => {
            if (confirmed) {
                tg.close();
            }
        });
    });
    
    // Confirm send button
    document.getElementById('confirmSendBtn').addEventListener('click', () => {
        const recipient = document.getElementById('recipientInput').value;
        const amount = document.getElementById('sendAmount').value;
        const note = document.getElementById('sendNote').value;
        
        if (!recipient || !amount) {
            tg.showAlert('Lütfen alıcı ve miktar bilgilerini giriniz.');
            return;
        }
        
        // Here you would typically send the transaction
        // For demo purposes, we'll just show a success message
        tg.showAlert(`Başarılı! ${amount} LKURD gönderildi.`);
        
        // Close modal and reset form
        sendModal.classList.remove('show');
        overlay.classList.remove('show');
        document.getElementById('recipientInput').value = '';
        document.getElementById('sendAmount').value = '';
        document.getElementById('sendNote').value = '';
    });
    
    // Simulate loading user balance
    setTimeout(() => {
        document.getElementById('userBalance').innerHTML = `
            <span>1,245.50 LKURD</span>
            <small>≈ $124.55</small>
        `;
        
        document.getElementById('walletBalance').textContent = '1,245.50 LKURD';
        document.getElementById('walletBalance').nextElementSibling.textContent = '≈ $124.55';
        
        // Simulate transactions
        const transactions = [
            { type: 'receive', amount: '50.00', from: 'Ahmet Y.', date: '10 dk önce' },
            { type: 'send', amount: '25.50', to: 'Market', date: 'Dün' },
            { type: 'receive', amount: '1200.00', from: 'STON.fi', date: '2 gün önce' }
        ];
        
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '<h3>Son İşlemler</h3>';
        
        transactions.forEach(tx => {
            const txElement = document.createElement('div');
            txElement.className = 'tg-transaction';
            txElement.innerHTML = `
                <div class="tg-tx-icon">
                    <i class="fas fa-${tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
                </div>
                <div class="tg-tx-details">
                    <h4>${tx.type === 'receive' ? tx.from : tx.to}</h4>
                    <p>${tx.date}</p>
                </div>
                <div class="tg-tx-amount ${tx.type}">
                    ${tx.type === 'receive' ? '+' : '-'}${tx.amount} LKURD
                </div>
            `;
            transactionsList.appendChild(txElement);
        });
        
        // Simulate market data
        document.getElementById('marketPrice').textContent = '$0.10';
        document.getElementById('marketChange').textContent = '+5.25%';
    }, 1000);
    
    // Add some CSS for transactions
    const style = document.createElement('style');
    style.textContent = `
        .tg-transaction {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .tg-transaction:last-child {
            border-bottom: none;
        }
        
        .tg-tx-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: rgba(16, 185, 129, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        }
        
        .tg-tx-icon i {
            color: #10b981;
        }
        
        .tg-tx-details {
            flex: 1;
        }
        
        .tg-tx-details h4 {
            font-size: 14px;
            margin-bottom: 2px;
        }
        
        .tg-tx-details p {
            font-size: 12px;
            color: var(--tg-theme-hint-color);
        }
        
        .tg-tx-amount {
            font-weight: 600;
        }
        
        .tg-tx-amount.receive {
            color: #10b981;
        }
        
        .tg-tx-amount.send {
            color: var(--tg-theme-text-color);
        }
    `;
    document.head.appendChild(style);
    
    // Back button handling
    tg.BackButton.onClick(() => {
        if (sideMenu.classList.contains('show')) {
            sideMenu.classList.remove('show');
            overlay.classList.remove('show');
        } else if (document.querySelector('.tg-modal.show')) {
            document.querySelector('.tg-modal.show').classList.remove('show');
            overlay.classList.remove('show');
        } else {
            tg.close();
        }
    });
    
    // Show back button when needed
    const showBackButton = () => {
        if (sideMenu.classList.contains('show') || document.querySelector('.tg-modal.show')) {
            tg.BackButton.show();
        } else {
            tg.BackButton.hide();
        }
    };
    
    // Observe changes to show/hide back button
    const observer = new MutationObserver(showBackButton);
    observer.observe(sideMenu, { attributes: true });
    document.querySelectorAll('.tg-modal').forEach(modal => {
        observer.observe(modal, { attributes: true });
    });
    
    // Initialize with hidden back button
    tg.BackButton.hide();
});