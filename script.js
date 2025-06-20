<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Forms</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <header class="bg-primary text-white p-3 mb-4 text-center">
        <img src="https://telegram.org/img/t_logo.png" alt="Telegram Logo" class="telegram-logo me-2">
        <h1 class="d-inline-block">Forms</h1>
    </header>
    <main class="container">
        <section id="form-builder">
            <h2 class="mb-3">Create a New Form</h2>
            <input type="text" id="form-title" class="form-control mb-3" placeholder="Enter form title" required>
            <div id="questions-container"></div>
            <div class="mb-3">
                <select id="question-type" class="form-select">
                    <option value="multiple-choice"><i class="bi bi-list-ul"></i> Multiple Choice</option>
                    <option value="dropdown"><i class="bi bi-caret-down-fill"></i> Dropdown</option>
                    <option value="paragraph"><i class="bi bi-textarea-t"></i> Paragraph</option>
                    <option value="date"><i class="bi bi-calendar-date"></i> Date</option>
                    <option value="short-answer"><i class="bi bi-text-indent-left"></i> Short Answer</option>
                </select>
            </div>
            <div class="d-flex gap-2 mb-3">
                <button id="add-question" class="btn btn-primary">Add Question</button>
                <button id="remove-question" class="btn btn-outline-danger" disabled>Remove Question</button>
            </div>
            <button id="save-form" class="btn btn-primary w-100">Save & Share Form</button>
        </section>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>