// TON SDK'yi başlat
const tonConnect = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

// HTML öğelerini seçiyoruz
const connectBtn = document.getElementById('connect-btn');
const sendBtn = document.getElementById('send-btn');
const walletAddressDisplay = document.getElementById('wallet-address');
const walletBalanceDisplay = document.getElementById('wallet-balance');

let walletAddress = null; // Kullanıcının cüzdan adresi
let wallet = null;        // TON cüzdan nesnesi

// TON Cüzdanına Bağlanma Fonksiyonu
async function connectWallet() {
    try {
        // TON cüzdanı bağlantısını tetikle
        const accounts = await tonConnect.provider.getWallets();
        if (accounts.length > 0) {
            walletAddress = accounts[0].address;
            wallet = new tonConnect.wallet(walletAddress);
            
            // UI Güncelle
            walletAddressDisplay.textContent = walletAddress;
            connectBtn.textContent = 'Connected';
            connectBtn.disabled = true;
            sendBtn.disabled = false;

            // Bakiye Kontrolü
            await getBalance();
        } else {
            alert('No TON Wallet found. Please install a TON Wallet.');
        }
    } catch (error) {
        console.error('Connection Error:', error);
        alert('Failed to connect to the wallet.');
    }
}

// Bakiye Kontrolü Fonksiyonu
async function getBalance() {
    try {
        const balance = await tonConnect.getBalance(walletAddress);
        const formattedBalance = (balance / 1e9).toFixed(4); // TON'dan $LKURD formatına çevir
        walletBalanceDisplay.textContent = `${formattedBalance} $LKURD`;
    } catch (error) {
        console.error('Balance Error:', error);
        walletBalanceDisplay.textContent = 'Error fetching balance';
    }
}

// Ödeme Gönderme Fonksiyonu
async function sendPayment() {
    const recipient = prompt('Enter the recipient wallet address:');
    const amount = prompt('Enter the amount of $LKURD to send:');

    if (!recipient || !amount) {
        alert('Recipient address and amount are required.');
        return;
    }

    try {
        const transfer = await wallet.transfer({
            to: recipient,
            value: TonWeb.utils.toNano(amount), // TON birimine çeviriyoruz
            message: 'Lira Kurdi Payment',
        });

        alert('Payment sent successfully!');
        await getBalance(); // Bakiye güncelle
    } catch (error) {
        console.error('Payment Error:', error);
        alert('Failed to send payment.');
    }
}

// Buton Olaylarını Tanımla
connectBtn.addEventListener('click', connectWallet);
sendBtn.addEventListener('click', sendPayment);
