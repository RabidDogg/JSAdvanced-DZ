'use strict';

/**
 * Создайте класс Car у которого есть марка, модель и пробег (все свойства приватные, задаются в конструкторе). 

 * Сделайте для него возможность менять пробег через get и set.
 * Добавьте метод info, который выводит в консоль марку, модели и пробег.

*/

class Car {
	#brand;
	#model;
	#mileage;

	#errors = {
		brand: 'Марка автомобиля должна быть непустой строкой',
		model: 'Модель автомобиля должна быть непустой строкой',
		mileage: 'Пробег должен быть неотрицательным числом',
		mileageDecrease: 'Пробег не может быть уменьшен (скручен)',
	};

	constructor(brand, model, mileage = 0) {
		this.#validate(brand, model, mileage);

		this.#brand = brand;
		this.#model = model;
		this.#mileage = mileage;
	}

	#validate(brand, model, mileage) {
		const errors = [];

		if (typeof brand !== 'string' || brand.trim() === '') {
			errors.push(this.#errors.brand);
		}

		if (typeof model !== 'string' || model.trim() === '') {
			errors.push(this.#errors.model);
		}

		if (typeof mileage !== 'number' || mileage < 0) {
			errors.push(this.#errors.mileage);
		}

		if (errors.length > 0) {
			throw new Error(errors.join('\n'));
		}
	}

	get mileage() {
		return this.#mileage;
	}

	set mileage(newMileage) {
		if (typeof newMileage !== 'number' || newMileage < 0) {
			throw new Error(this.#errors.mileage);
		}

		// Защита от скручивания пробега
		if (newMileage < this.#mileage) {
			throw new Error(this.#errors.mileageDecrease);
		}

		this.#mileage = newMileage;
	}

	get brand() {
		return this.#brand;
	}

	get model() {
		return this.#model;
	}

	info() {
		console.log(
			`Марка: ${this.#brand}\nМодель: ${this.#model}\nПробег: ${this.#mileage} км`,
		);
	}
}

// Тесты для проверки защиты от скручивания
function testMileageProtection() {
	console.log('=== ТЕСТИРОВАНИЕ ЗАЩИТЫ ОТ СКРУЧИВАНИЯ ===\n');

	try {
		const car = new Car('Toyota', 'Camry', 50000);
		console.log('✅ Создан автомобиль с пробегом 50000');

		// Корректное увеличение
		car.mileage = 55000;
		console.log('✅ Увеличение пробега до 55000 - работает');

		// Попытка скрутить
		try {
			car.mileage = 40000;
			console.log('❌ Скручивание пробега должно быть запрещено');
		} catch (error) {
			console.log('✅ Защита работает: скручивание запрещено');
			console.log(`   Ошибка: "${error.message}"`);
		}

		console.log(`\nИтоговый пробег: ${car.mileage}`); // Должно быть 55000
	} catch (error) {
		console.log('❌ Ошибка:', error.message);
	}
}

testMileageProtection();

/**
app.js:85 === ТЕСТИРОВАНИЕ ЗАЩИТЫ ОТ СКРУЧИВАНИЯ ===
app.js:89 ✅ Создан автомобиль с пробегом 50000
app.js:93 ✅ Увеличение пробега до 55000 - работает
app.js:100 ✅ Защита работает: скручивание запрещено
app.js:101    Ошибка: "Пробег не может быть уменьшен (скручен)"
app.js:104 
Итоговый пробег: 55000
 */
