/**
Сделать 5 кнопок с текстом “Нажми меня” и div, где отображается число нажатий (по умолчанию 0).

При нажатии кнопки, текст на ней меняется на “Нажата!”. У всех остальных – “Нажми меня”
С нажатием любой кнопки счётчик увеличивается на 1.


*/
'use strict';

/**
 * Создаёт кнопку и добавляет её в родительский элемент
 * @param {HTMLElement} parent - родительский элемент, в который добавляется кнопка
 * @returns {HTMLButtonElement} Созданная кнопка
 */
function createButton(parent) {
	if (!(parent instanceof HTMLElement)) {
		throw new Error(
			'Родительский элемент должен быть экземпляром HTMLElement',
		);
	}

	const btn = document.createElement('button');
	btn.textContent = 'Нажми меня';
	parent.appendChild(btn);

	return btn;
}

/**
 * Устанавливает состояние нажатой кнопки и сбрасывает предыдущую
 * @param {HTMLButtonElement} currentBtn - текущая нажатая кнопка
 * @param {HTMLButtonElement|null} prevButton - предыдущая нажатая кнопка
 */
function setPressedButton(currentBtn, prevButton) {
	if (!(currentBtn instanceof HTMLElement)) {
		throw new Error('currentBtn должен быть HTML элементом');
	}

	if (prevButton && !(prevButton instanceof HTMLElement)) {
		throw new Error(
			'prevButton должен быть HTML элементом, если он передан',
		);
	}

	if (prevButton === currentBtn) {
		return;
	}

	if (prevButton) {
		prevButton.classList.remove('pressed');
		prevButton.textContent = 'Нажми меня';
	}

	currentBtn.classList.add('pressed');
	currentBtn.textContent = 'Нажата!';
}

/**
 * Обновляет значение счётчика на странице
 * @param {HTMLElement} counterElement - элемент счётчика
 * @returns {number} Новое значение счётчика
 */
function updateCounter(counterElement) {
	const currentCount = parseInt(counterElement.dataset.count || '0', 10);
	const newCount = currentCount + 1;

	counterElement.dataset.count = newCount;
	counterElement.textContent = `Число нажатий на кнопки: ${newCount}`;

	return newCount;
}

/**
 * Обработчик клика на контейнере с кнопками
 * @param {MouseEvent} event - событие клика
 */
function clickHandler(event) {
	const currentBtn = event.target.closest('button');
	if (!currentBtn) return;

	const container = currentBtn.closest('app');
	if (!container) return;

	const counter = container.querySelector('.counter');
	const prevButton = container.querySelector('.pressed');

	setPressedButton(currentBtn, prevButton);
	updateCounter(counter);
}

/**
 * Инициализация приложения: создание кнопок и установка обработчиков
 */
async function initApp() {
	const app = document.querySelector('app');
	if (!app) {
		console.error('Контейнер app не найден');
		return;
	}

	// Создаём 5 кнопок
	for (let i = 0; i < 5; i++) {
		createButton(app);
	}

	app.addEventListener('click', clickHandler);
}

// Запуск приложения после полной загрузки DOM
window.addEventListener('load', initApp);
