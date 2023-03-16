const commentsBlock = document.querySelector('.comments-block');
const form = document.forms.form;

commentsBlock.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn_delete')) {
        deleteMessage(e.target.parentElement.parentElement);
    }

    if (e.target.classList.contains('btn_like')) {
        likeMessage(e.target);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
});

form.addEventListener('keydown', (e) => {
    if (form.querySelector('.error')) {
        hideError();
    }

    if (e.key == 'Enter' && !e.shiftKey) {
        e.preventDefault();

        const newEvent = new Event('submit');
        e.target.form.dispatchEvent(newEvent);
    }
});

function submitForm() {
    if (form.date.value == '') {
        form.date.value = new Date().toLocaleDateString();
    }

    if (!isValidForm()) return;

    const userName = form.userName.value;
    const date = formatDate(form.date.value);
    const text = form.text.value;
    const message = createMessageEl(userName, date, text);

    addMessage(message, commentsBlock);
    clearForm();
}

function clearForm() {
    form.userName.value = '';
    form.date.value = '';
    form.text.value = '';
}

function isValidForm() {
    if (!form.userName.value.trim()) {
        showError('Представьтесь, пожалуйста', form.userName);
        return false;
    }

    if (!form.text.value.trim()) {
        showError('Сначала напишите комментарий!', form.text);
        return false;
    }

    if (!isValidDate(form.date.value)) {
        showError('Введите дату в формате ДД.ММ.ГГГГ', form.date);
        return false;
    }

    return true;
}

function isValidDate(str) {
    const reg = /^([0-9]{2})\.([0-9]{2})\.([1-2][0-9]{3})$/;

    if (!reg.test(str)) return false;

    const arr = str.split('.');
    const year = parseInt(arr[2],10);
    const month = parseInt(arr[1],10) - 1;
    const day = parseInt(arr[0],10);

    const date = new Date(year, month, day);

    return date.getFullYear() == year && date.getMonth() == month && date.getDate() == day;
}

function formatDate(str) {
    const now = new Date();
    const time = now.toLocaleString().slice(12, 17);

    const commentDate = new Date(str.split('.').reverse().join('-'));
    let day = commentDate.toLocaleDateString();

    if (now.toLocaleDateString() == commentDate.toLocaleDateString()) {
        day = 'сегодня';
    } 
    
    if (now.getDay() - 1 == commentDate.getDay() 
            && now.getMonth() == commentDate.getMonth()
            && now.getFullYear() == commentDate.getFullYear()) {
        day = 'вчера';
    }

    return `${day} в ${time}`;
}

function createErrorEl(errorText) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error';
    errorEl.textContent = errorText;

    return errorEl;
}

function showError(errorText, inputEl) {
    const errorEl = createErrorEl(errorText);
    
    switch (inputEl) {
        case userName:
            errorEl.style.top = '25px';
            errorEl.style.left = '0';
            break;
    
        case date:
            errorEl.style.top = '25px';
            errorEl.style.left = '190px';
            break;

        case text:
            errorEl.style.top = '120px';
            errorEl.style.left = '0';
            break;
    }

    inputEl.focus();
    form.append(errorEl);
}

function hideError() {
    const errorEl = form.querySelector('.error');
    errorEl.remove();
}

function createMessageEl(name, date, text) {
    const message = document.createElement('div');
    message.className = 'comment';
    message.innerHTML = `
        <div class="comment__content">
            <div class="comment__data">
                <span class="author">${name}</span>
                <span class="time">${date}</span>
            </div>
            <div class="comment__text">${text}</div>
        </div>
        <div class="comment__actions">
            <img class="icon btn_delete" src="./img/icons8-delete.svg" alt="delete">
            <img class="icon btn_like" src="./img/icons8-like.png" alt="like">
        </div>
    `;

    return message;
}

function addMessage(message, elem) {
    elem.append(message);
}

function deleteMessage(elem) {
    elem.remove();
}

function likeMessage(elem) {
    elem.src = '/img/icons8-likered.png';
}

