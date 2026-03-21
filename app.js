/**
Создать функцию race(), которая будет принимать массив Promise, и возвращать первый успешно выполненный или отклоненный.

*/
'use strict';

function race(promises) {
	return new Promise((resolve, reject) => {
		promises.forEach((promise) => {
			Promise.resolve(promise).then(resolve, reject);
		});
	});
}

// Тесты
function runTests() {
	console.log('=== ТЕСТИРОВАНИЕ race() ===\n');

	// Тест 1: Первый успешный промис
	const test1 = [
		new Promise((resolve) => setTimeout(() => resolve('fast'), 50)),
		new Promise((resolve) => setTimeout(() => resolve('slow'), 100)),
	];

	race(test1)
		.then((result) => {
			console.log(
				'✅ Тест 1 (первый успешный):',
				result === 'fast' ? 'passed' : 'failed',
				`→ ${result}`,
			);
		})
		.catch(() => console.log('❌ Тест 1 провален'));

	// Тест 2: Первый отклонённый промис
	const test2 = [
		new Promise((_, reject) => setTimeout(() => reject('error fast'), 30)),
		new Promise((resolve) => setTimeout(() => resolve('success'), 100)),
	];

	race(test2).catch((error) => {
		console.log(
			'✅ Тест 2 (первый отклонённый):',
			error === 'error fast' ? 'passed' : 'failed',
			`→ ${error}`,
		);
	});

	// Тест 3: Непромисные значения
	const test3 = [
		42,
		new Promise((resolve) => setTimeout(() => resolve('promise'), 50)),
	];

	race(test3).then((result) => {
		console.log(
			'✅ Тест 3 (непромисные значения):',
			result === 42 ? 'passed' : 'failed',
			`→ ${result}`,
		);
	});

	// Тест 4: Пустой массив
	const test4 = [];

	race(test4)
		.then(() => {
			console.log('❌ Тест 4: промис не должен разрешиться');
		})
		.catch(() => {
			console.log('✅ Тест 4 (пустой массив): промис навсегда в pending');
		});

	// Отложенный вывод для завершения всех тестов
	setTimeout(() => {
		console.log('\n=== ТЕСТЫ ЗАВЕРШЕНЫ ===');
	}, 200);
}

runTests();
