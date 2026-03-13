'use strict';

// Сделать функцию валидации возраста. На вход передаётся строка даты рождения пользователя вида “2022-01-01”.
// Необходимо вывести true, если ему больше 14 лет и false, если меньше

// Вспомогательная функция для проверки является ли значение датой
function isDate(date) {
	return date instanceof Date && !isNaN(date);
}

function isValidDateFormat(dateString) {
	if (
		typeof dateString !== 'string' ||
		!/^\d{4}-\d{2}-\d{2}$/.test(dateString)
	) {
		return false;
	}
	return true;
}

// Функция для парсинга строки даты (UTC to local)
function parseDate(dateString) {
	if (!isValidDateFormat(dateString)) {
		throw Error('Передана навалидная строка даты');
	}
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
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

function ageValidation(dateString) {
	const date = parseDate(dateString);
	const age = getNumberOfFullYears(date);
	return age > 14;
}

// Тестирование

// Функция для форматирования даты в YYYY-MM-DD
function formatDateToYYYYMMDD(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function runAllTests() {
	console.log('ЗАПУСК ТЕСТОВ ДЛЯ ageValidation');
	console.log('='.repeat(60) + '\n');

	testAgeValidation();
	testRelativeDates();
	testBoundaryCases();

	console.log('='.repeat(60));
	console.log('ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ');
}

// Тесты для ageValidation (для 2026 года)
function testAgeValidation() {
	console.log('=== ТЕСТИРОВАНИЕ ageValidation (для 2026 года) ===\n');

	// Фиксируем "сегодня" как 13 марта 2026 года для всех тестов
	const testToday = new Date(2026, 2, 13); // 2 = март (0-индексация)

	console.log(`Текущая тестовая дата: ${formatDateToYYYYMMDD(testToday)}\n`);

	const tests = [
		// ТЕПЕРЬ ПРАВИЛЬНО: 14.x лет = НЕ больше 14
		{
			name: '14 лет и 2.5 месяца (родился 1 января 2012)',
			input: '2012-01-01',
			expected: false, // 14 лет 2.5 месяца = НЕ больше 14
			note: '14 лет 2 месяца = ещё не 15 лет',
		},
		{
			name: 'Ровно 14 лет (родился 13 марта 2012)',
			input: '2012-03-13',
			expected: false,
			note: '14 лет 0 дней = не больше 14',
		},
		{
			name: '14 лет + 1 день (родился 12 марта 2012)',
			input: '2012-03-12',
			expected: false, // ИСПРАВЛЕНО: 14 лет 1 день = НЕ больше 14
			note: '14 лет 1 день = всё ещё не больше 14',
		},
		{
			name: '14 лет + 364 дня (родился 14 марта 2012)',
			input: '2012-03-14',
			expected: false, // 13 лет 364 дня = меньше 14
			note: '13 лет 364 дня = меньше 14',
		},
		{
			name: '14 лет + 11 месяцев (родился 13 апреля 2011)',
			input: '2011-04-13',
			expected: false, // 14 лет 11 месяцев = НЕ больше 14
			note: '14 лет 11 месяцев = ещё не 15',
		},

		// ТОЛЬКО КОГДА ИСПОЛНИЛОСЬ 15 ЛЕТ - TRUE
		{
			name: 'Ровно 15 лет (родился 13 марта 2011)',
			input: '2011-03-13',
			expected: true, // 15 лет 0 дней = больше 14
			note: '15 лет 0 дней',
		},
		{
			name: '15 лет + 1 день (родился 12 марта 2011)',
			input: '2011-03-12',
			expected: true, // 15 лет 1 день = больше 14
			note: '15 лет 1 день',
		},
		{
			name: '16 лет (родился 13 марта 2010)',
			input: '2010-03-13',
			expected: true,
			note: '16 лет',
		},
		{
			name: '20 лет (родился 13 марта 2006)',
			input: '2006-03-13',
			expected: true,
			note: '20 лет',
		},

		// Меньше 14
		{
			name: '13 лет (родился 13 марта 2013)',
			input: '2013-03-13',
			expected: false,
			note: '13 лет',
		},
		{
			name: '13 лет 11 месяцев (родился 13 апреля 2012)',
			input: '2012-04-13',
			expected: false,
			note: '13 лет 11 месяцев',
		},
		{
			name: '5 лет (родился 13 марта 2021)',
			input: '2021-03-13',
			expected: false,
			note: '5 лет',
		},
	];

	let passed = 0;
	let failed = 0;

	tests.forEach((test, index) => {
		try {
			const result = ageValidation(test.input);
			const status = result === test.expected ? '✅' : '❌';

			// Вычисляем точный возраст для информации
			const birthDate = parseDate(test.input);
			const age = getNumberOfFullYears(birthDate);

			if (result === test.expected) {
				passed++;
			} else {
				failed++;
			}

			console.log(`${status} Тест ${index + 1}: ${test.name}`);
			console.log(`   Дата рождения: ${test.input}`);
			console.log(`   Возраст: ${age} лет`);
			console.log(`   Результат: ${result}, Ожидалось: ${test.expected}`);
			console.log(`   Примечание: ${test.note}`);
			console.log('');
		} catch (error) {
			failed++;
			console.log(`❌ Тест ${index + 1}: ${test.name}`);
			console.log(`   ОШИБКА: ${error.message}`);
			console.log(`   Вход: ${test.input}`);
			console.log('');
		}
	});

	console.log(
		`\n=== РЕЗУЛЬТАТ: Пройдено: ${passed}, Провалено: ${failed} ===\n`,
	);
}

// Тесты с относительными датами
function testRelativeDates() {
	console.log('=== ТЕСТЫ С ОТНОСИТЕЛЬНЫМИ ДАТАМИ ===\n');

	const testToday = new Date(2026, 2, 13); // 13 марта 2026

	const relativeTests = [
		{
			name: '14 лет и 6 месяцев назад (13 сентября 2011)',
			years: 14,
			months: 6,
			expected: false, // 14.5 лет = НЕ больше 14
		},
		{
			name: '14 лет и 11 месяцев назад (13 апреля 2011)',
			years: 14,
			months: 11,
			expected: false, // 14 лет 11 месяцев = НЕ больше 14
		},
		{
			name: 'Ровно 15 лет назад (13 марта 2011)',
			years: 15,
			months: 0,
			expected: true, // 15 лет = больше 14
		},
		{
			name: 'Ровно 14 лет назад (13 марта 2012)',
			years: 14,
			months: 0,
			expected: false, // 14 лет = НЕ больше 14
		},
	];

	relativeTests.forEach((test, index) => {
		// Создаем дату рождения
		const birthDate = new Date(testToday);
		birthDate.setFullYear(testToday.getFullYear() - test.years);
		birthDate.setMonth(testToday.getMonth() - (test.months || 0));

		const dateString = formatDateToYYYYMMDD(birthDate);

		try {
			const result = ageValidation(dateString);
			const age = getNumberOfFullYears(birthDate);
			const status = result === test.expected ? '✅' : '❌';

			console.log(`${status} Тест ${index + 1}: ${test.name}`);
			console.log(`   Дата рождения: ${dateString}`);
			console.log(`   Возраст: ${age} лет`);
			console.log(`   Результат: ${result}, Ожидалось: ${test.expected}`);
			console.log('');
		} catch (error) {
			console.log(`❌ Тест ${index + 1}: ${test.name}`);
			console.log(`   ОШИБКА: ${error.message}`);
			console.log('');
		}
	});
}

// Тесты на граничные значения
function testBoundaryCases() {
	console.log('=== ТЕСТЫ НА ГРАНИЧНЫЕ ЗНАЧЕНИЯ ===\n');

	// Для 13 марта 2026
	const boundaryTests = [
		{
			name: '14 лет минус 1 день (родился 14 марта 2012)',
			input: '2012-03-14',
			expectedAge: 13,
			expectedResult: false,
		},
		{
			name: 'Ровно 14 лет (родился 13 марта 2012)',
			input: '2012-03-13',
			expectedAge: 14,
			expectedResult: false, // 14 лет 0 дней = НЕ больше 14
		},
		{
			name: '14 лет плюс 1 день (родился 12 марта 2012)',
			input: '2012-03-12',
			expectedAge: 14,
			expectedResult: false, // ИСПРАВЛЕНО: 14 лет 1 день = НЕ больше 14
		},
		{
			name: '14 лет плюс 364 дня (родился 14 марта 2011)',
			input: '2011-03-14',
			expectedAge: 14,
			expectedResult: false, // 14 лет 364 дня = НЕ больше 14
		},
		{
			name: 'Ровно 15 лет (родился 13 марта 2011)',
			input: '2011-03-13',
			expectedAge: 15,
			expectedResult: true, // 15 лет = больше 14
		},
	];

	boundaryTests.forEach((test) => {
		try {
			const birthDate = parseDate(test.input);
			const age = getNumberOfFullYears(birthDate);
			const result = ageValidation(test.input);

			console.log(`Тест: ${test.name}`);
			console.log(`Дата рождения: ${test.input}`);
			console.log(`Возраст: ${age} лет (ожидалось ${test.expectedAge})`);
			console.log(
				`ageValidation: ${result} (ожидалось ${test.expectedResult})`,
			);
			console.log(
				`Статус: ${age === test.expectedAge ? '✅' : '❌'} ${result === test.expectedResult ? '✅' : '❌'}`,
			);
			console.log('');
		} catch (error) {
			console.log(`❌ Ошибка: ${error.message}\n`);
		}
	});
}

// Запуск
runAllTests();

/**
 * ЗАПУСК ТЕСТОВ ДЛЯ ageValidation
============================================================

 === ТЕСТИРОВАНИЕ ageValidation (для 2026 года) ===

Текущая тестовая дата: 2026-03-13
✅ Тест 1: 14 лет и 2.5 месяца (родился 1 января 2012)
   Дата рождения: 2012-01-01
   Возраст: 14 лет
   Результат: false, Ожидалось: false
   Примечание: 14 лет 2 месяца = ещё не 15 лет

✅ Тест 2: Ровно 14 лет (родился 13 марта 2012)
   Дата рождения: 2012-03-13
   Возраст: 14 лет
   Результат: false, Ожидалось: false
   Примечание: 14 лет 0 дней = не больше 14

✅ Тест 3: 14 лет + 1 день (родился 12 марта 2012)
   Дата рождения: 2012-03-12
   Возраст: 14 лет
   Результат: false, Ожидалось: false
   Примечание: 14 лет 1 день = всё ещё не больше 14

✅ Тест 4: 14 лет + 364 дня (родился 14 марта 2012)
   Дата рождения: 2012-03-14
   Возраст: 13 лет
   Результат: false, Ожидалось: false
   Примечание: 13 лет 364 дня = меньше 14

✅ Тест 5: 14 лет + 11 месяцев (родился 13 апреля 2011)
   Дата рождения: 2011-04-13
   Возраст: 14 лет
   Результат: false, Ожидалось: false
   Примечание: 14 лет 11 месяцев = ещё не 15

✅ Тест 6: Ровно 15 лет (родился 13 марта 2011)
   Дата рождения: 2011-03-13
   Возраст: 15 лет
   Результат: true, Ожидалось: true
   Примечание: 15 лет 0 дней

✅ Тест 7: 15 лет + 1 день (родился 12 марта 2011)
   Дата рождения: 2011-03-12
   Возраст: 15 лет
   Результат: true, Ожидалось: true
   Примечание: 15 лет 1 день

✅ Тест 8: 16 лет (родился 13 марта 2010)
   Дата рождения: 2010-03-13
   Возраст: 16 лет
   Результат: true, Ожидалось: true
   Примечание: 16 лет

✅ Тест 9: 20 лет (родился 13 марта 2006)
   Дата рождения: 2006-03-13
   Возраст: 20 лет
   Результат: true, Ожидалось: true
   Примечание: 20 лет

✅ Тест 10: 13 лет (родился 13 марта 2013)
   Дата рождения: 2013-03-13
   Возраст: 13 лет
   Результат: false, Ожидалось: false
   Примечание: 13 лет

✅ Тест 11: 13 лет 11 месяцев (родился 13 апреля 2012)
   Дата рождения: 2012-04-13
   Возраст: 13 лет
   Результат: false, Ожидалось: false
   Примечание: 13 лет 11 месяцев

✅ Тест 12: 5 лет (родился 13 марта 2021)
   Дата рождения: 2021-03-13
   Возраст: 5 лет
   Результат: false, Ожидалось: false
   Примечание: 5 лет


=== РЕЗУЛЬТАТ: Пройдено: 12, Провалено: 0 ===

 === ТЕСТЫ С ОТНОСИТЕЛЬНЫМИ ДАТАМИ ===
 ✅ Тест 1: 14 лет и 6 месяцев назад (13 сентября 2011)
    Дата рождения: 2011-09-13
    Возраст: 14 лет
    Результат: false, Ожидалось: false
 
 ✅ Тест 2: 14 лет и 11 месяцев назад (13 апреля 2011)
    Дата рождения: 2011-04-13
    Возраст: 14 лет
    Результат: false, Ожидалось: false
 
 ✅ Тест 3: Ровно 15 лет назад (13 марта 2011)
    Дата рождения: 2011-03-13
    Возраст: 15 лет
    Результат: true, Ожидалось: true
 
 ✅ Тест 4: Ровно 14 лет назад (13 марта 2012)
    Дата рождения: 2012-03-13
    Возраст: 14 лет
    Результат: false, Ожидалось: false
 
 === ТЕСТЫ НА ГРАНИЧНЫЕ ЗНАЧЕНИЯ ===
 Тест: 14 лет минус 1 день (родился 14 марта 2012)
 Дата рождения: 2012-03-14
 Возраст: 13 лет (ожидалось 13)
 ageValidation: false (ожидалось false)
 Статус: ✅ ✅
 
 Тест: Ровно 14 лет (родился 13 марта 2012)
 Дата рождения: 2012-03-13
 Возраст: 14 лет (ожидалось 14)
 ageValidation: false (ожидалось false)
 Статус: ✅ ✅
 
 Тест: 14 лет плюс 1 день (родился 12 марта 2012)
 Дата рождения: 2012-03-12
 Возраст: 14 лет (ожидалось 14)
 ageValidation: false (ожидалось false)
 Статус: ✅ ✅
 
 Тест: 14 лет плюс 364 дня (родился 14 марта 2011)
 Дата рождения: 2011-03-14
 Возраст: 14 лет (ожидалось 14)
 ageValidation: false (ожидалось false)
 Статус: ✅ ✅
 
 Тест: Ровно 15 лет (родился 13 марта 2011)
 Дата рождения: 2011-03-13
 Возраст: 15 лет (ожидалось 15)
 ageValidation: true (ожидалось true)
 Статус: ✅ ✅
 
============================================================
ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ
 */
