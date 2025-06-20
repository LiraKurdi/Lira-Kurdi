// Telegram Web Apps SDK'sını başlat
const tg = window.Telegram.WebApp;
tg.ready();

const questionsContainer = document.getElementById('questions-container');
const addQuestionButton = document.getElementById('add-question');
const removeQuestionButton = document.getElementById('remove-question');
const saveFormButton = document.getElementById('save-form');
const formTitleInput = document.getElementById('form-title');
const formDescriptionInput = document.getElementById('form-description');
const questionTypeSelect = document.getElementById('question-type');
const formTitleDisplay = document.getElementById('form-title-display');
const myFormsSection = document.getElementById('my-forms');
const formsList = document.getElementById('forms-list');

let questionCount = 0;
let savedForms = JSON.parse(localStorage.getItem('telegramForms')) || [];

function updateFormTitleDisplay() {
    formTitleDisplay.textContent = formTitleInput.value || 'Untitled Form';
}

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
        case 'multiple-choice-grid':
            questionHtml += `
                <div class="grid-container" style="--columns: 2;">
                    <div class="grid-header">Rows</div>
                    <div class="grid-header">Columns</div>
                    <div class="grid-row"><input type="text" class="form-control" placeholder="Row 1"></div>
                    <div class="grid-row"><input type="text" class="form-control" placeholder="Strongly Agree"></div>
                    <div class="grid-row"><input type="text" class="form-control" placeholder="Row 2"></div>
                    <div class="grid-row"><input type="text" class="form-control" placeholder="Agree"></div>
                    <button class="btn btn-secondary btn-sm add-row mt-2">Add Row</button>
                    <button class="btn btn-secondary btn-sm add-column mt-2">Add Column</button>
                </div>
            `;
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

    // Izgara için satır ve sütun ekleme
    if (questionType === 'multiple-choice-grid') {
        const addRowButton = questionDiv.querySelector('.add-row');
        const addColumnButton = questionDiv.querySelector('.add-column');
        addRowButton.addEventListener('click', () => {
            const grid = questionDiv.querySelector('.grid-container');
            const rowCount = grid.querySelectorAll('.grid-row').length / 2; // Satır sayısı
            const newRow = document.createElement('div');
            newRow.className = 'grid-row';
            newRow.innerHTML = `<input type="text" class="form-control" placeholder="Row ${rowCount + 1}">`;
            grid.insertBefore(newRow, addRowButton.parentNode);
            updateGridColumns(grid);
        });
        addColumnButton.addEventListener('click', () => {
            const grid = questionDiv.querySelector('.grid-container');
            const columnCount = parseInt(getComputedStyle(grid).getPropertyValue('--columns')) || 2;
            grid.style.setProperty('--columns', columnCount + 1);
            updateGridColumns(grid);
        });
    }

    removeQuestionButton.disabled = false;
}

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

function updateGridColumns(grid) {
    const columns = grid.querySelectorAll('.grid-row:not(:first-child)');
    columns.forEach((col, index) => {
        if (index >= 2) { // İlk iki satır hariç
            const input = col.querySelector('input');
            if (!input) {
                col.innerHTML = `<input type="text" class="form-control" placeholder="Option ${index - 1}">`;
            }
        }
    });
}

function saveForm() {
    const formTitle = formTitleInput.value || 'Untitled Form';
    const formDescription = formDescriptionInput.value || '';
    if (!formTitle && !formDescription) {
        tg.showAlert('Please enter a form title or description');
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
        } else if (questionType === 'multiple-choice-grid') {
            const rows = Array.from(questionDiv.querySelectorAll('.grid-row input')).map(input => input.value);
            options = { rows: rows.slice(0, -1), columns: rows.slice(1) }; // İlk satır sütunlar, diğerleri seçenekler
        }
        if (questionTitle || (options.length > 0 && options.every(opt => opt))) {
            questions.push({ questionTitle, questionType, options });
        }
    }

    if (questions.length === 0) {
        tg.showAlert('Please add at least one valid question');
        return;
    }

    const formData = { 
        title: formTitle, 
        description: formDescription, 
        questions, 
        timestamp: new Date().toISOString(), // 20 Haziran 2025, 16:55 +03
        ownerId: tg.initDataUnsafe?.user?.id || 'anonymous' // Form sahibi kimliği
    };
    savedForms.push(formData);
    localStorage.setItem('telegramForms', JSON.stringify(savedForms));
    updateMyForms();

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
            // Yanıtları almak için bot entegrasyonu (ileride eklenecek)
            // Örnek: tg.sendData(JSON.stringify(formData));
        }
    });
}

function updateMyForms() {
    formsList.innerHTML = '';
    savedForms.forEach((form, index) => {
        const item = document.createElement('a');
        item.className = 'list-group-item list-group-item-action';
        item.textContent = `${form.title} (${new Date(form.timestamp).toLocaleDateString()})`;
        item.addEventListener('click', () => {
            formTitleInput.value = form.title;
            formDescriptionInput.value = form.description;
            questionsContainer.innerHTML = '';
            form.questions.forEach(q => {
                questionTypeSelect.value = q.questionType;
                addQuestion();
                const lastQuestion = questionsContainer.lastElementChild;
                lastQuestion.querySelector('.question-title').value = q.questionTitle;
                if (q.questionType === 'multiple-choice' || q.questionType === 'dropdown') {
                    q.options.forEach((opt, i) => {
                        if (i > 1) {
                            lastQuestion.querySelector('.add-option').click();
                        }
                        lastQuestion.querySelectorAll('.option-input')[i].value = opt;
                    });
                } else if (q.questionType === 'multiple-choice-grid') {
                    q.options.rows.forEach((row, i) => {
                        if (i > 0) lastQuestion.querySelector('.add-row').click();
                        lastQuestion.querySelectorAll('.grid-row input')[i].value = row;
                    });
                    q.options.columns.forEach((col, i) => {
                        if (i > 0) lastQuestion.querySelector('.add-column').click();
                        lastQuestion.querySelectorAll('.grid-row input')[i + 2].value = col;
                    });
                }
            });
            myFormsSection.style.display = 'none';
        });
        formsList.appendChild(item);
    });
    myFormsSection.style.display = 'block';
}

// Olay dinleyicileri
addQuestionButton.addEventListener('click', addQuestion);
removeQuestionButton.addEventListener('click', removeQuestion);
saveFormButton.addEventListener('click', saveForm);
formTitleInput.addEventListener('input', updateFormTitleDisplay);
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.getAttribute('href') === '#my-forms') {
            updateMyForms();
        } else {
            myFormsSection.style.display = 'none';
        }
    });
});

// Telegram tema parametreleri
tg.expand();
document.body.style.backgroundColor = tg.themeParams.bg_color || '#e0e0f7';
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.style.backgroundColor = tg.themeParams.button_color || '#673ab7';
    btn.style.borderColor = tg.themeParams.button_color || '#673ab7';
});
updateFormTitleDisplay();