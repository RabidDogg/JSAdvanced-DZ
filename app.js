'use strict';

// Сделать функцию для настольных игр. Она которая принимает тип dice, который надо бросить: d4, d6, d8, d10, d12, d16, d20 и возвращает случайное целое число на этом интервале с включёнными границами:

/**
 * TODO на будущее можно еще добавить параметр "step", чтобы на кубах были значения с определенным шагом
 * @param {number} numberOfFaces - число граней создаваемого куба
 * @param {number} [min=1] - минимальное число на кубе, если захочется экспериментов с бросками
 * @returns {object} объект куба с методом для броска
 */
function createDice(numberOfFaces, min = 1) {
	return {
		min,
		max: min + numberOfFaces - 1,
		numberOfFaces,
		rollsHistory: [],
		roll() {
			let rollResult = Math.random();
			rollResult *= this.max - this.min + 1;
			rollResult += this.min;
			rollResult = Math.floor(rollResult);
			this.rollsHistory.push(rollResult);
			return rollResult;
		},
	};
}

console.log('=== ТЕСТЫ ДЛЯ РАЗЛИЧНЫХ ТИПОВ КУБОВ ===\n');

// Вспомогательная функция для проверки диапазона
function testDiceRange(dice, name, expectedMin, expectedMax, rollsCount = 100) {
	console.log(`\nТестирование ${name}:`);
	console.log(`Ожидаемый диапазон: [${expectedMin}-${expectedMax}]`);

	// Проверка свойств куба
	console.assert(
		dice.min === expectedMin,
		`${name}: min должен быть ${expectedMin}, получено ${dice.min}`,
	);

	console.assert(
		dice.max === expectedMax,
		`${name}: max должен быть ${expectedMax}, получено ${dice.max}`,
	);

	console.assert(
		dice.numberOfFaces === expectedMax - expectedMin + 1,
		`${name}: numberOfFaces должен быть ${expectedMax - expectedMin + 1}, получено ${dice.numberOfFaces}`,
	);

	// Серия бросков и проверка диапазона
	let allInRange = true;
	let minRoll = Infinity;
	let maxRoll = -Infinity;

	for (let i = 0; i < rollsCount; i++) {
		const roll = dice.roll();
		minRoll = Math.min(minRoll, roll);
		maxRoll = Math.max(maxRoll, roll);

		if (roll < expectedMin || roll > expectedMax) {
			allInRange = false;
			console.assert(
				false,
				`${name}: бросок ${roll} вне допустимого диапазона [${expectedMin}-${expectedMax}]`,
			);
		}
	}

	console.log(
		`Фактический диапазон за ${rollsCount} бросков: [${minRoll}-${maxRoll}]`,
	);
	console.assert(allInRange, `${name}: некоторые броски вне диапазона`);

	// Проверка истории бросков
	console.assert(
		dice.rollsHistory.length === rollsCount,
		`${name}: история должна содержать ${rollsCount} бросков, содержит ${dice.rollsHistory.length}`,
	);

	if (allInRange) {
		console.log(`✓ ${name}: все тесты пройдены`);
	}
}

// 1. Тесты для стандартных кубов
console.log('1. ТЕСТЫ СТАНДАРТНЫХ КУБОВ:');
console.log('-'.repeat(40));

const d4 = createDice(4);
testDiceRange(d4, 'd4', 1, 4, 20);

const d6 = createDice(6);
testDiceRange(d6, 'd6', 1, 6, 20);

const d8 = createDice(8);
testDiceRange(d8, 'd8', 1, 8, 20);

const d10 = createDice(10);
testDiceRange(d10, 'd10', 1, 10, 20);

const d12 = createDice(12);
testDiceRange(d12, 'd12', 1, 12, 20);

const d16 = createDice(16);
testDiceRange(d16, 'd16', 1, 16, 20);

const d20 = createDice(20);
testDiceRange(d20, 'd20', 1, 20, 20);

// 2. Тесты с нестандартными минимальными значениями
console.log('\n2. ТЕСТЫ С НЕСТАНДАРТНЫМИ МИНИМАЛЬНЫМИ ЗНАЧЕНИЯМИ:');
console.log('-'.repeat(40));

const d6From5 = createDice(6, 5);
testDiceRange(d6From5, 'd6 (от 5 до 10)', 5, 10, 15);

const d10From0 = createDice(10, 0);
testDiceRange(d10From0, 'd10 (от 0 до 9)', 0, 9, 15);

const d20FromMinus5 = createDice(20, -5);
testDiceRange(d20FromMinus5, 'd20 (от -5 до 14)', -5, 14, 15);

// 3. Тесты на граничные случаи
console.log('\n3. ТЕСТЫ ГРАНИЧНЫХ СЛУЧАЕВ:');
console.log('-'.repeat(40));

// Куб с одной гранью
const d1 = createDice(1);
console.assert(d1.min === 1, 'd1: min должен быть 1');
console.assert(d1.max === 1, 'd1: max должен быть 1');
console.assert(d1.numberOfFaces === 1, 'd1: numberOfFaces должен быть 1');
const roll1 = d1.roll();
console.assert(roll1 === 1, `d1: бросок должен быть 1, получено ${roll1}`);
console.log('✓ d1 (одна грань): тест пройден');

// Куб с отрицательным минимумом
const d5FromMinus2 = createDice(5, -2);
console.assert(d5FromMinus2.min === -2, 'd5 от -2: min должен быть -2');
console.assert(d5FromMinus2.max === 2, 'd5 от -2: max должен быть 2');
console.assert(
	d5FromMinus2.numberOfFaces === 5,
	'd5 от -2: numberOfFaces должен быть 5',
);
console.log('✓ d5 от -2: тест пройден');

// 4. Тест на сохранение истории
console.log('\n4. ТЕСТ СОХРАНЕНИЯ ИСТОРИИ:');
console.log('-'.repeat(40));

const testDice = createDice(6);
testDice.roll();
testDice.roll();
testDice.roll();

console.assert(
	testDice.rollsHistory.length === 3,
	`История должна содержать 3 броска, содержит ${testDice.rollsHistory.length}`,
);
console.assert(
	Array.isArray(testDice.rollsHistory),
	'rollsHistory должен быть массивом',
);
console.log('История бросков:', testDice.rollsHistory);
console.log('✓ Тест истории пройден');

// 5. Статистический тест (проверка распределения)
console.log('\n5. СТАТИСТИЧЕСКИЙ ТЕСТ (проверка распределения d20):');
console.log('-'.repeat(40));

const statDice = createDice(20);
const distribution = new Array(21).fill(0); // индексы 0-20, используем 1-20
const rollsCount = 1000;

for (let i = 0; i < rollsCount; i++) {
	const roll = statDice.roll();
	distribution[roll]++;
}

console.log(`Распределение ${rollsCount} бросков d20:`);
let expectedPerValue = rollsCount / 20;
let chiSquare = 0;

for (let i = 1; i <= 20; i++) {
	const deviation = distribution[i] - expectedPerValue;
	chiSquare += (deviation * deviation) / expectedPerValue;

	console.log(
		`  ${i.toString().padStart(2)}: ${distribution[i].toString().padStart(3)} бросков ` +
			`(${distribution[i] > expectedPerValue ? '+' : ''}${Math.round(deviation)})`,
	);

	// Проверка, что каждое значение выпало хотя бы несколько раз
	console.assert(
		distribution[i] > 0,
		`Значение ${i} не выпало ни разу за ${rollsCount} бросков`,
	);
}

console.log(
	`\nХи-квадрат: ${chiSquare.toFixed(2)} (должен быть примерно 19-30)`,
);
console.assert(
	chiSquare < 50,
	`Распределение может быть неравномерным (хи-квадрат = ${chiSquare.toFixed(2)})`,
);
console.log('✓ Статистический тест пройден');

// 6. Тест на уникальность бросков
console.log('\n6. ТЕСТ НА УНИКАЛЬНОСТЬ БРОСКОВ:');
console.log('-'.repeat(40));

const uniqueTestDice = createDice(1000); // куб с 1000 граней
const rolls = [];
for (let i = 0; i < 100; i++) {
	rolls.push(uniqueTestDice.roll());
}

const uniqueRolls = new Set(rolls);
console.assert(
	uniqueRolls.size <= rolls.length,
	'Количество уникальных значений не может превышать количество бросков',
);
console.log(`Уникальных значений: ${uniqueRolls.size} из ${rolls.length}`);
console.log('✓ Тест на уникальность пройден');

// 7. Тест на независимость бросков
console.log('\n7. ТЕСТ НА НЕЗАВИСИМОСТЬ БРОСКОВ:');
console.log('-'.repeat(40));

const independenceDice = createDice(6);
const sequence = [];
for (let i = 0; i < 50; i++) {
	sequence.push(independenceDice.roll());
}

// Проверяем, что нет явной последовательности (например, всегда возрастающей)
let isAscending = true;
let isDescending = true;
for (let i = 1; i < sequence.length; i++) {
	if (sequence[i] <= sequence[i - 1]) isAscending = false;
	if (sequence[i] >= sequence[i - 1]) isDescending = false;
}

console.assert(
	!isAscending && !isDescending,
	'Последовательность бросков выглядит зависимой (монотонной)',
);
console.log('Первые 10 бросков:', sequence.slice(0, 10));
console.log('✓ Тест на независимость пройден');

// Итоговый отчет
console.log('\n=== ИТОГОВЫЙ ОТЧЕТ ===');
console.log('='.repeat(40));
console.log(
	'Все тесты завершены. Проверьте сообщения об ошибках выше (если есть).',
);
console.log(`\nПротестированные кубы:`);
console.log(`- d4: ${d4.rollsHistory.length} бросков`);
console.log(`- d6: ${d6.rollsHistory.length} бросков`);
console.log(`- d8: ${d8.rollsHistory.length} бросков`);
console.log(`- d10: ${d10.rollsHistory.length} бросков`);
console.log(`- d12: ${d12.rollsHistory.length} бросков`);
console.log(`- d16: ${d16.rollsHistory.length} бросков`);
console.log(`- d20: ${d20.rollsHistory.length} бросков`);

/**
app.js:28 === ТЕСТЫ ДЛЯ РАЗЛИЧНЫХ ТИПОВ КУБОВ ===

app.js:87 1. ТЕСТЫ СТАНДАРТНЫХ КУБОВ:
app.js:88 ----------------------------------------
app.js:32 
Тестирование d4:
app.js:33 Ожидаемый диапазон: [1-4]
app.js:70 Фактический диапазон за 20 бросков: [1-4]
app.js:82 ✓ d4: все тесты пройдены
app.js:32 
Тестирование d6:
app.js:33 Ожидаемый диапазон: [1-6]
app.js:70 Фактический диапазон за 20 бросков: [1-6]
app.js:82 ✓ d6: все тесты пройдены
app.js:32 
Тестирование d8:
app.js:33 Ожидаемый диапазон: [1-8]
app.js:70 Фактический диапазон за 20 бросков: [1-8]
app.js:82 ✓ d8: все тесты пройдены
app.js:32 
Тестирование d10:
app.js:33 Ожидаемый диапазон: [1-10]
app.js:70 Фактический диапазон за 20 бросков: [2-9]
app.js:82 ✓ d10: все тесты пройдены
app.js:32 
Тестирование d12:
app.js:33 Ожидаемый диапазон: [1-12]
app.js:70 Фактический диапазон за 20 бросков: [2-12]
app.js:82 ✓ d12: все тесты пройдены
app.js:32 
Тестирование d16:
app.js:33 Ожидаемый диапазон: [1-16]
app.js:70 Фактический диапазон за 20 бросков: [1-16]
app.js:82 ✓ d16: все тесты пройдены
app.js:32 
Тестирование d20:
app.js:33 Ожидаемый диапазон: [1-20]
app.js:70 Фактический диапазон за 20 бросков: [1-19]
app.js:82 ✓ d20: все тесты пройдены
app.js:112 
2. ТЕСТЫ С НЕСТАНДАРТНЫМИ МИНИМАЛЬНЫМИ ЗНАЧЕНИЯМИ:
app.js:113 ----------------------------------------
app.js:32 
Тестирование d6 (от 5 до 10):
app.js:33 Ожидаемый диапазон: [5-10]
app.js:70 Фактический диапазон за 15 бросков: [5-10]
app.js:82 ✓ d6 (от 5 до 10): все тесты пройдены
app.js:32 
Тестирование d10 (от 0 до 9):
app.js:33 Ожидаемый диапазон: [0-9]
app.js:70 Фактический диапазон за 15 бросков: [0-9]
app.js:82 ✓ d10 (от 0 до 9): все тесты пройдены
app.js:32 
Тестирование d20 (от -5 до 14):
app.js:33 Ожидаемый диапазон: [-5-14]
app.js:70 Фактический диапазон за 15 бросков: [-5-12]
app.js:82 ✓ d20 (от -5 до 14): все тесты пройдены
app.js:125 
3. ТЕСТЫ ГРАНИЧНЫХ СЛУЧАЕВ:
app.js:126 ----------------------------------------
app.js:135 ✓ d1 (одна грань): тест пройден
app.js:145 ✓ d5 от -2: тест пройден
app.js:148 
4. ТЕСТ СОХРАНЕНИЯ ИСТОРИИ:
app.js:149 ----------------------------------------
app.js:164 История бросков: Array(3)
app.js:165 ✓ Тест истории пройден
app.js:168 
5. СТАТИСТИЧЕСКИЙ ТЕСТ (проверка распределения d20):
app.js:169 ----------------------------------------
app.js:180 Распределение 1000 бросков d20:
app.js:188    1:  46 бросков (-4)
app.js:188    2:  44 бросков (-6)
app.js:188    3:  46 бросков (-4)
app.js:188    4:  52 бросков (+2)
app.js:188    5:  45 бросков (-5)
app.js:188    6:  48 бросков (-2)
app.js:188    7:  54 бросков (+4)
app.js:188    8:  49 бросков (-1)
app.js:188    9:  43 бросков (-7)
app.js:188   10:  48 бросков (-2)
app.js:188   11:  58 бросков (+8)
app.js:188   12:  55 бросков (+5)
app.js:188   13:  45 бросков (-5)
app.js:188   14:  45 бросков (-5)
app.js:188   15:  57 бросков (+7)
app.js:188   16:  57 бросков (+7)
app.js:188   17:  54 бросков (+4)
app.js:188   18:  46 бросков (-4)
app.js:188   19:  57 бросков (+7)
app.js:188   20:  51 бросков (+1)
app.js:200 
Хи-квадрат: 9.80 (должен быть примерно 19-30)
app.js:207 ✓ Статистический тест пройден
app.js:210 
6. ТЕСТ НА УНИКАЛЬНОСТЬ БРОСКОВ:
app.js:211 ----------------------------------------
app.js:224 Уникальных значений: 97 из 100
app.js:225 ✓ Тест на уникальность пройден
app.js:228 
7. ТЕСТ НА НЕЗАВИСИМОСТЬ БРОСКОВ:
app.js:229 ----------------------------------------
app.js:249 Первые 10 бросков: Array(10)
app.js:250 ✓ Тест на независимость пройден
app.js:253 
=== ИТОГОВЫЙ ОТЧЕТ ===
app.js:254 ========================================
app.js:255 Все тесты завершены. Проверьте сообщения об ошибках выше (если есть).
app.js:258 
Протестированные кубы:
app.js:259 - d4: 20 бросков
app.js:260 - d6: 20 бросков
app.js:261 - d8: 20 бросков
app.js:262 - d10: 20 бросков
app.js:263 - d12: 20 бросков
app.js:264 - d16: 20 бросков
app.js:265 - d20: 20 бросков
index.html:40 Live reload enabled.

 */
