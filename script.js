// Telegram Web Apps SDK'sını başlat
const tg = window.Telegram.WebApp;
tg.ready();

// Form ve sorular için HTML elementleri
const questionsContainer = document.getElementById('questions-container');
const addQuestionButton = document.getElementById('add-question');
const saveFormButton = document.getElementById('save-form');
const formTitleInput = document.getElementById('form-title');

let questionCount = 0;

// Yeni bir soru ekleme fonksiyonu
function addQuestion() {
    questionCount++;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
        <input type="text" placeholder="Enter question ${questionCount}" class="question-title" required>
        <div class="options">
            <div class="option">
                <input type="text" placeholder="Option 1" class="option-input" required>
            </div>
            <div class="option">
                <input type="text" placeholder="Option 2" class="option-input" required>
            </div>
        </div>
        <button class="telegram-button add-option">Add Option</button>
    `;
    questionsContainer.appendChild(questionDiv);

    // Yeni seçenek ekleme butonu
    questionDiv.querySelector('.add-option').addEventListener('click', () => {
        const options = questionDiv.querySelector('.options');
        const newOption = document.createElement('div');
        newOption.className = 'option';
        newOption.innerHTML = `<input type="text" placeholder="Option ${options.children.length + 1}" class="option-input" required>`;
        options.appendChild(newOption);
    });
}

// Formu kaydetme ve Telegram'da paylaşma
function saveForm() {
    const formTitle = formTitleInput.value;
    if (!formTitle) {
        alert('Please enter a form title');
        return;
    }

    const questions = [];
    const questionDivs = questionsContainer.getElementsByClassName('question');
    for (let questionDiv of questionDivs) {
        const questionTitle = questionDiv.querySelector('.question-title').value;
        const options = Array.from(questionDiv.querySelectorAll('.option-input')).map(input => input.value);
        if (questionTitle && options.every(opt => opt)) {
            questions.push({ questionTitle, options });
        }
    }

    if (questions.length === 0) {
        alert('Please add at least one valid question with options');
        return;
    }

    // Form verilerini localStorage'a kaydet
    const formData = { title: formTitle, questions };
    localStorage.setItem('telegramForm', JSON.stringify(formData));

    // Telegram'da paylaşma bağlantısı oluştur
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=Fill out my form: ${formTitle}`;
    tg.showPopup({
        title: 'Form Saved!',
        message: 'Your form has been saved. Share it now?',
        buttons: [
            { id: 'share', type: 'default', text: 'Share' },
            { id: 'cancel', type: 'cancel', text: 'Cancel' }
        ]
    }, (buttonId) => {
        if (buttonId === 'share') {
            window.open(shareUrl, '_blank');
        }
    });
}

// Olay dinleyicileri
addQuestionButton.addEventListener('click', addQuestion);
saveFormButton.addEventListener('click', saveForm);

// Telegram tema parametrelerini uygula
tg.expand(); // Tam ekran modu
document.body.style.backgroundColor = tg.themeParams.bg_color || '#f0f2f5';
document.querySelectorAll('.telegram-button').forEach(btn => {
    btn.style.backgroundColor = tg.themeParams.button_color || '#0088cc';
});