// Telegram Web Apps SDK'sını başlat
const tg = window.Telegram.WebApp;
tg.ready();

const questionsContainer = document.getElementById('questions-container');
const addQuestionButton = document.getElementById('add-question');
const removeQuestionButton = document.getElementById('remove-question');
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
    questionDiv.dataset.index = questionCount;

    let questionHtml = `<input type="text" class="form-control mb-2 question-title" placeholder="Question ${questionCount}" required>`;

    switch (questionType) {
        case 'multiple-choice':
        case 'dropdown':
            questionHtml += `
                <div class="options">
                    <div class="option">
                        <input type="text" class="form-control option-input" placeholder="Option 1" required>
                    </div>
                    <div class="option">
                        <input type="text" class="form-control option-input" placeholder="Option 2" required>
                    </div>
                </div>
                <button class="btn btn-secondary btn-sm add-option mt-2">Add Option</button>
            `;
            break;
        case 'paragraph':
            questionHtml += `<textarea class="form-control mt-2" rows="3" placeholder="Long text response"></textarea>`;
            break;
        case 'date':
            questionHtml += `<input type="date" class="form-control mt-2">`;
            break;
        case 'short-answer':
            questionHtml += `<input type="text" class="form-control mt-2" placeholder="Short answer">`;
            break;
    }

    questionDiv.innerHTML = questionHtml;
    questionsContainer.appendChild(questionDiv);

    // Seçenek ekleme butonu
    if (questionType === 'multiple-choice' || questionType === 'dropdown') {
        questionDiv.querySelector('.add-option').addEventListener('click', () => {
            const options = questionDiv.querySelector('.options');
            const newOption = document.createElement('div');
            newOption.className = 'option';
            newOption.innerHTML = `<input type="text" class="form-control option-input" placeholder="Option ${options.children.length + 1}" required>`;
            options.appendChild(newOption);
        });
    }

    removeQuestionButton.disabled = false;
}

// Soru çıkarma fonksiyonu
function removeQuestion() {
    if (questionCount > 0) {
        const questions = questionsContainer.getElementsByClassName('question');
        if (questions.length > 0) {
            questionsContainer.removeChild(questions[questions.length - 1]);
            questionCount--;
            if (questionCount === 0) {
                removeQuestionButton.disabled = true;
            }
        }
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
        const questionTitle = questionDiv.querySelector('.question-title')?.value || '';
        const questionType = questionTypeSelect.value;
        let options = [];
        if (questionType === 'multiple-choice' || questionType === 'dropdown') {
            options = Array.from(questionDiv.querySelectorAll('.option-input')).map(input => input.value);
        }
        if (questionTitle || (options.length > 0 && options.every(opt => opt))) {
            questions.push({ questionTitle, questionType, options });
        }
    }

    if (questions.length === 0) {
        tg.showAlert('Please add at least one valid question');
        return;
    }

    const formData = { title: formTitle, questions };
    localStorage.setItem('telegramForm', JSON.stringify(formData));

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
removeQuestionButton.addEventListener('click', removeQuestion);
saveFormButton.addEventListener('click', saveForm);

// Telegram tema parametreleri
tg.expand();
document.body.style.backgroundColor = tg.themeParams.bg_color || '#f8f9fa';
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.style.backgroundColor = tg.themeParams.button_color || '#0088cc';
    btn.style.borderColor = tg.themeParams.button_color || '#0088cc';
});