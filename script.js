// Telegram Web Apps SDK'sını başlat
const tg = window.Telegram.WebApp;
tg.ready();

const questionsContainer = document.getElementById('questions-container');
const addQuestionButton = document.getElementById('add-question');
const saveFormButton = document.getElementById('save-form');
const formTitleInput = document.getElementById('form-title');
const questionTypeSelect = document.getElementById('question-type');

let questionCount = 0;

// Yeni soru ekleme fonksiyonu
function addQuestion() {
    questionCount++;
    const questionType = questionTypeSelect.value;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    
    let questionHtml = `<input type="text" placeholder="Question ${questionCount}" class="question-title" required>`;
    
    switch (questionType) {
        case 'multiple-choice':
        case 'dropdown':
            questionHtml += `
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
            break;
        case 'paragraph':
            questionHtml += `<p>Long text input field will be provided for responses.</p>`;
            break;
        case 'date':
            questionHtml += `<p>Date picker will be provided for responses.</p>`;
            break;
        case 'short-answer':
            questionHtml += `<p>Short text input field will be provided for responses.</p>`;
            break;
    }
    
    questionDiv.innerHTML = questionHtml;
    questionsContainer.appendChild(questionDiv);

    // Seçenek ekleme butonu (sadece çoktan seçmeli ve dropdown için)
    if (questionType === 'multiple-choice' || questionType === 'dropdown') {
        questionDiv.querySelector('.add-option').addEventListener('click', () => {
            const options = questionDiv.querySelector('.options');
            const newOption = document.createElement('div');
            newOption.className = 'option';
            newOption.innerHTML = `<input type="text" placeholder="Option ${options.children.length + 1}" class="option-input" required>`;
            options.appendChild(newOption);
        });
    }
}

// Formu kaydetme ve Telegram'da paylaşma
function saveForm() {
    const formTitle = formTitleInput.value;
    if (!formTitle) {
        tg.showAlert('Please enter a form title');
        return;
    }

    const questions = [];
    const questionDivs = questionsContainer.getElementsByClassName('question');
    for (let questionDiv of questionDivs) {
        const questionTitle = questionDiv.querySelector('.question-title').value;
        const questionType = questionTypeSelect.value;
        let options = [];
        if (questionType === 'multiple-choice' || questionType === 'dropdown') {
            options = Array.from(questionDiv.querySelectorAll('.option-input')).map(input => input.value);
        }
        if (questionTitle && (options.length === 0 || options.every(opt => opt))) {
            questions.push({ questionTitle, questionType, options });
        }
    }

    if (questions.length === 0) {
        tg.showAlert('Please add at least one valid question');
        return;
    }

    // Form verilerini localStorage'a kaydet
    const formData = { title: formTitle, questions };
    localStorage.setItem('telegramForm', JSON.stringify(formData));

    // Telegram'da paylaşma bağlantısı
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

// Telegram tema parametreleri
tg.expand();
document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
document.querySelectorAll('.telegram-button').forEach(btn => {
    btn.style.backgroundColor = tg.themeParams.button_color || '#0088cc';
    btn.style.color = tg.themeParams.button_text_color || '#ffffff';
});