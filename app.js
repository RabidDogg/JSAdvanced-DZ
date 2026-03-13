'use strict';

// Сделать функцию валидации возраста. На вход передаётся строка даты рождения пользователя вида “2022-01-01”.
// Необходимо вывести true, если ему больше 14 лет и false, если меньше

// Вспомогательная функция для проверки является ли значение датой
function isDate(date) {
	return date instanceof Date && !isNaN(date);
}

function getNumberOfFullYears(date) {
	if (!isDate(date)) {
		throw new TypeError('Переданный аргумент не является датой!');
	}

	const today = new Date();

	// Проверка, что дата не в будущем
	if (date > today) {
		throw new RangeError('Переданная дата находится в будущем!');
	}

	// Вычисляем разницу в годах
	let years = today.getFullYear() - date.getFullYear();

	// Проверяем, прошел ли день рождения в этом году
	const hasBirthdayPassed =
		today.getMonth() > date.getMonth() ||
		(today.getMonth() === date.getMonth() &&
			today.getDate() >= date.getDate());

	return hasBirthdayPassed ? years : years - 1;
}

function ageValidation(date) {
	const age = getNumberOfFullYears(date);
	return age > 14;
}

// Тестирование

function runTests() {
	console.log('=== ТЕСТИРОВАНИЕ ageValidation ===\n');

	const tests = [
		{
			name: 'Больше 14 лет на 1 день)',
			input: (() => {
				const date = new Date();
				date.setFullYear(date.getFullYear() - 14);
				date.setDate(date.getDate() + 1);
				return date;
			})(),
			expected: false,
		},
		{
			name: 'Ровно 15 лет (сегодня день рождения)',
			input: (() => {
				const date = new Date();
				date.setFullYear(date.getFullYear() - 15);
				return date;
			})(),
			expected: true,
		},
		{
			name: 'Меньше 14 лет (не хватает 1 дня)',
			input: (() => {
				const date = new Date();
				date.setFullYear(date.getFullYear() - 14);
				date.setDate(date.getDate() - 1);
				return date;
			})(),
			expected: false,
		},
		{
			name: 'Меньше 14 лет (ребенок)',
			input: new Date(2020, 5, 15),
			expected: false,
		},
		{
			name: 'Больше 14 лет (взрослый)',
			input: new Date(2000, 0, 1),
			expected: true,
		},
		{
			name: 'Граничный случай: високосный год',
			input: new Date(2008, 1, 29), // 29 февраля 2008
			expected: true,
		},
	];

	tests.forEach((test, index) => {
		try {
			const result = ageValidation(test.input);
			const status = result === test.expected ? '✅' : '❌';
			console.log(`${status} Тест ${index + 1}: ${test.name}`);
			console.log(
				`   Результат: ${result}, Ожидалось: ${test.expected}\n`,
			);
		} catch (error) {
			console.log(`❌ Тест ${index + 1}: ${test.name}`);
			console.log(`   ОШИБКА: ${error.message}\n`);
		}
	});

	// Тесты на ошибки
	console.log('=== ТЕСТЫ НА ОШИБКИ ===\n');

	const errorTests = [
		{
			name: 'Будущая дата',
			input: new Date(2030, 0, 1),
			expectedError: 'RangeError',
		},
		{
			name: 'Не дата (строка)',
			input: '2020-01-01',
			expectedError: 'TypeError',
		},
		{
			name: 'Не дата (null)',
			input: null,
			expectedError: 'TypeError',
		},
		{
			name: 'Невалидная дата',
			input: new Date('invalid'),
			expectedError: 'TypeError',
		},
	];

	errorTests.forEach((test, index) => {
		try {
			ageValidation(test.input);
			console.log(
				`❌ Тест ${index + 1}: ${test.name} - Должна быть ошибка, но её нет\n`,
			);
		} catch (error) {
			const errorType = error.constructor.name;
			const status = errorType === test.expectedError ? '✅' : '❌';
			console.log(`${status} Тест ${index + 1}: ${test.name}`);
			console.log(
				`   Получена ошибка: ${errorType}, Ожидалась: ${test.expectedError}\n`,
			);
		}
	});
}

// Запуск тестов
runTests();

// Дополнительные тесты с конкретными датами
console.log('=== ТЕСТЫ С ФИКСИРОВАННЫМИ ДАТАМИ (для 2026 года) ===\n');

const fixedTests = [
	{
		date: '2010-01-01',
		expectedAge: 16,
		expectedValidation: true,
	},
	{
		date: '2010-12-31',
		expectedAge: 15,
		expectedValidation: false,
	},
	{
		date: '2009-03-15',
		expectedAge: 16,
		expectedValidation: true,
	},
];

// Функция для парсинга строки даты (UTC to local)
function parseDate(dateString) {
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
}

fixedTests.forEach((test) => {
	const date = parseDate(test.date);
	const age = getNumberOfFullYears(date);
	const validation = ageValidation(date);

	console.log(`Дата: ${test.date}`);
	console.log(`Возраст: ${age} лет (ожидалось ~${test.expectedAge})`);
	console.log(
		`Проверка >14: ${validation} (ожидалось ${test.expectedValidation})`,
	);
	console.log('---');
});

/* 
=== ТЕСТИРОВАНИЕ ageValidation ===

✅ Тест 1: Больше 14 лет на 1 день)
   Результат: false, Ожидалось: false
✅ Тест 2: Ровно 15 лет (сегодня день рождения)
   Результат: true, Ожидалось: true
✅ Тест 3: Меньше 14 лет (не хватает 1 дня)
   Результат: false, Ожидалось: false
✅ Тест 4: Меньше 14 лет (ребенок)
   Результат: false, Ожидалось: false
✅ Тест 5: Больше 14 лет (взрослый)
   Результат: true, Ожидалось: true
✅ Тест 6: Граничный случай: високосный год
   Результат: true, Ожидалось: true
=== ТЕСТЫ НА ОШИБКИ ===
✅ Тест 1: Будущая дата
   Получена ошибка: RangeError, Ожидалась: RangeError
✅ Тест 2: Не дата (строка)
   Получена ошибка: TypeError, Ожидалась: TypeError
✅ Тест 3: Не дата (null)
   Получена ошибка: TypeError, Ожидалась: TypeError
✅ Тест 4: Невалидная дата
   Получена ошибка: TypeError, Ожидалась: TypeError
 === ТЕСТЫ С ФИКСИРОВАННЫМИ ДАТАМИ (для 2026 года) ===
 Дата: 2010-01-01
 Возраст: 16 лет (ожидалось ~16)
 Проверка >14: true (ожидалось true)
 ---
 Дата: 2010-12-31
 Возраст: 15 лет (ожидалось ~15)
 Проверка >14: true (ожидалось false)
 ---
 Дата: 2009-03-15
 Возраст: 16 лет (ожидалось ~16)
 Проверка >14: true (ожидалось true)
 ---
 
*/
