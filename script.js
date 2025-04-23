// Отримання елементів з HTML
let question_field = document.querySelector('.question');
let answer_buttons = document.querySelectorAll('.answer');
let start_btn = document.querySelector('.start-btn');

let start_page = document.querySelector('.start-page');
let difficulty_page = document.querySelector(".difficulty-page");
let difficulty_btn = document.querySelectorAll(".difficulty");
let main_page = document.querySelector('.main-page');
let result_field = document.querySelector('.result');

// Змінні для гри
let signs = ['+', '-', '*', '/'];
let isCookies = false;
let max_points;

// Отримання cookies
let cookies = document.cookie.split(';');
for (let i = 0; i < cookies.length; i += 1) {
    let name_value = cookies[i].split('=');
    if (name_value[0].includes('max-points')) {
        isCookies = true;
        max_points = name_value[1];
        result_field.innerHTML = `Ваш попередній результат: ${max_points}`;
        console.log("gAYS");
    }
}

// Функція перемішування масиву
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) { // Цикл повторюється до тих пір, поки залишаються елементи для перемішування
        randomIndex = Math.floor(Math.random() * currentIndex); // Вибираємо елемент, що залишився.
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [ // Міняємо місцями з поточним елементом.
            array[randomIndex], array[currentIndex]];
    }
    return array; // Повертаємо перемішаний масив
}

// Функція для генерації випадкового цілого числа в діапазоні
function randint(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Функція для отримання випадкового знака операції
function getRandomSign() {
    let i = randint(0, 3);
    return signs[i];
}

// Клас для створення та відображення питань
class Question {
    constructor() {
        let a = randint(1, 40);
        let b = randint(1, 40);
        let sign = getRandomSign();
        this.question = `${a} ${sign} ${b}`;
        if (sign == '+') {
            this.correct = a + b;
        } else if (sign == '-') {
            this.correct = a - b;
        } else if (sign == '*') {
            this.correct = a * b;
        } else if (sign == '/') {
            let answer = a / b * 100;
            this.correct = Math.round(answer) / 100;
        }

        this.answers = [
            this.correct,
            randint(this.correct - 14, this.correct - 7),
            randint(this.correct + 1, this.correct + 7),
            randint(this.correct - 15, this.correct - 7),
            randint(this.correct - 7, this.correct - 1),
        ];
        shuffle(this.answers);
    }
    display() {
        question_field.innerHTML = this.question;
        for (let i = 0; i < this.answers.length; i += 1) {
            answer_buttons[i].innerHTML = this.answers[i];
        }
    }
}

// Змінні для зберігання стану гри
let quiz_time = 5;
let current_question = new Question();
let points = 0;
let total_question_count = 0;

// Функція для відображення результатів гри
function displayResult() {
    start_page.style.display = 'flex';
    main_page.style.display = 'none';
    let accuracy = Math.round(points * 100 / total_question_count);
    result_field.innerHTML = `Ви дали ${points} правильних відровідей з ${total_question_count}.<br>
    Точність: ${accuracy}%`;
    if (max_points && +max_points < points) {
        document.cookie = `max-points=${points};max-age=${60 * 60 * 24 * 30}`;
    }
    points = 0;
    total_question_count = 0;
}

// Функція для відображення сторінки вибору складності
function displayDifficulty() {
    start_page.style.display = 'none';
    main_page.style.display = 'none';
    difficulty_page.style.display = "flex";
}

// Функція для встановлення складності гри
function setDifficulty(time) {
    start_page.style.display = 'flex';
    main_page.style.display = 'none';
    difficulty_page.style.display = "none";
    quiz_time = time;
}

// Додавання обробників подій для кнопок вибору складності
difficulty_btn[0].addEventListener("click", function () {
    setDifficulty(15);
});
difficulty_btn[1].addEventListener("click", function () {
    setDifficulty(20);
});
difficulty_btn[2].addEventListener("click", function () {
    setDifficulty(25);
});

// Обробник події для кнопки старту гри
start_btn.addEventListener("click", function () {
    start_page.style.display = 'none';
    main_page.style.display = 'flex';
    current_question = new Question();
    current_question.display();
    setTimeout(displayResult, quiz_time * 1000);
});

// Обробники подій для кнопок відповідей
for (let i = 0; i < answer_buttons.length; i += 1) {
    answer_buttons[i].addEventListener("click", function () {
        total_question_count += 1;
        if (answer_buttons[i].innerHTML == current_question.correct) {
            points += 1;
            console.log(points);
            answer_buttons[i].style.background = '#D5F0D9';
        } else {
            answer_buttons[i].style.background = '#F25757';
        }
        anime({
            targets: answer_buttons[i],
            background: '#ffffff',
            delay: 100,
            border: "#ffffff",
            outline: "#ffffff",
            duration: 500,
            easing: 'linear',
        }).finished.then(function () {
            answer_buttons[i].style.border = "2px solid #ff882f";
            answer_buttons[i].style.outlineColor = "#ffbb76";
            answer_buttons[i].style.outline = "1px solid #ff882f";
            answer_buttons[i].style.outlineOffset = "0px";
            current_question = new Question();
            current_question.display();
        });
    });
}
