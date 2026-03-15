'use strict';

// Constants
/** @constant {Object} */
const MS = { SECOND: 1000, MINUTE: 60, HOUR: 60, DAY: 24 };

/** @constant {number} */
const INTERVAL_DELAY = MS.SECOND;

/**
 * @typedef {Object} PageElements
 * @property {HTMLElement} timers - Контейнер для таймеров
 * @property {HTMLElement} now - Элемент для отображения текущего времени
 * @property {HTMLElement} beforeNewYear - Элемент для отображения времени до Нового года
 */

/** @type {PageElements} */
const page = {};

/** @constant {Object.<string, string>} */
const styles = {
	timers: 'timers',
	now: 'now',
	beforeNewYear: 'before-new-year',
};

/** @constant {Object} */
const dateOptions = {
	now: {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	},
};

// Utils

/**
 * Создает HTML элемент с заданными параметрами
 * @param {Object} params - Параметры создания элемента
 * @param {string} [params.tag='div'] - HTML тег создаваемого элемента
 * @param {string[]} [params.styles=[]] - Массив CSS классов
 * @param {HTMLElement} params.parent - Родительский элемент
 * @param {string} [params.pageKey] - Ключ для сохранения элемента в объекте page
 * @param {string} [params.text=''] - Текстовое содержимое элемента
 * @returns {HTMLElement} Созданный элемент
 * @throws {Error} Если parent не является HTMLElement
 */
function createElement({
	tag = 'div',
	styles = [],
	parent,
	pageKey,
	text = '',
}) {
	if (!(parent instanceof HTMLElement)) {
		throw new Error('Parent must be HTMLElement');
	}

	const element = document.createElement(tag);
	element.classList.add(...styles);
	if (text) element.textContent = text;
	if (pageKey) page[pageKey] = element;
	parent.appendChild(element);
	return element;
}

/**
 * Форматирует дату согласно локали пользователя
 * @param {Date} date - Дата для форматирования
 * @param {Intl.DateTimeFormatOptions} options - Опции форматирования
 * @returns {string} Отформатированная дата
 * @throws {Error} Если date не является валидным объектом Date
 */
function getFormatedDate(date, options) {
	if (!(date instanceof Date) || isNaN(date)) {
		throw new Error('Invalid date object');
	}
	return Intl.DateTimeFormat(navigator.language, options).format(date);
}

/**
 * Возвращает дату следующего года (1 января 00:00:00)
 * @param {Date} now - Текущая дата
 * @returns {Date} Дата следующего года
 * @throws {Error} Если now не является валидным объектом Date
 */
function getNextYear(now) {
	if (!(now instanceof Date) || isNaN(now)) {
		throw new Error('Invalid date object');
	}
	return new Date(now.getFullYear() + 1, 0, 1);
}

/**
 * Вычисляет разницу между текущей датой и следующим годом
 * @param {Date} now - Текущая дата
 * @param {Date} nextYear - Дата следующего года
 * @returns {string} Строка с количеством месяцев, дней, часов, минут и секунд до Нового года
 * @throws {Error} Если аргументы не являются валидными объектами Date
 */
function getDiffString(now, nextYear) {
	if (
		!(now instanceof Date) ||
		!(nextYear instanceof Date) ||
		isNaN(now) ||
		isNaN(nextYear)
	) {
		throw new Error('Invalid date objects');
	}

	let months =
		nextYear.getMonth() -
		now.getMonth() +
		(nextYear.getFullYear() - now.getFullYear()) * 12;

	let days = nextYear.getDate() - now.getDate();

	if (days < 0) {
		months--;
		const lastMonth = new Date(
			nextYear.getFullYear(),
			nextYear.getMonth(),
			0,
		);
		days = lastMonth.getDate() - now.getDate() + nextYear.getDate();
	}

	const hours = 23 - now.getHours();
	const minutes = 59 - now.getMinutes();
	const seconds = 59 - now.getSeconds();

	return `${months} месяцев, ${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд`;
}

/**
 * Обновляет отображение текущего времени и времени до Нового года
 * @returns {void}
 */
function updateAll() {
	const now = new Date();
	const nextYear = getNextYear(now);

	if (page.now) {
		page.now.textContent = `Сейчас: ${getFormatedDate(now, dateOptions.now)}`;
	}

	if (page.beforeNewYear) {
		const diffString = getDiffString(now, nextYear);
		page.beforeNewYear.textContent = `До Нового Года осталось: ${diffString}`;
	}
}

/**
 * Создает DOM структуру приложения
 * @returns {void}
 */
function render() {
	page.timers = document.querySelector('.timers');
	if (!page.timers) return;

	page.timers.innerHTML = '';

	createElement({
		tag: 'span',
		styles: [styles.now],
		parent: page.timers,
		pageKey: 'now',
	});

	createElement({
		tag: 'span',
		styles: [styles.beforeNewYear],
		parent: page.timers,
		pageKey: 'beforeNewYear',
	});
}

// Init
document.addEventListener('DOMContentLoaded', () => {
	render();
	updateAll(); // сразу показать, без задержки

	/** @type {number} */
	const intervalId = setInterval(updateAll, INTERVAL_DELAY);

	window.addEventListener('beforeunload', () => {
		clearInterval(intervalId);
	});
});
