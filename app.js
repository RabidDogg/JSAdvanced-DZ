'use strict';

/**
Спроектируйте класс Billing со свойством amount и методом calculateTotal для расчёта счёта. Сделайте разный calculateTotal для разных типов:
 - fixBilling - где нужно вернуть amount как результат
 - hourBilling - который считает amount * число часов
 - itemBilling где считается amount * число элементов

Соблюдайте принцип открытости / закрытости!
*/

'use strict';

// Базовый класс (закрыт для модификации)
class Billing {
	constructor(amount) {
		this.amount = amount;
	}

	calculateTotal() {
		return this.amount;
	}
}

// Фиксированный счет (использует базовую реализацию)
class FixedBilling extends Billing {}

// Почасовой счет
class HourBilling extends Billing {
	constructor(amount, hours) {
		super(amount);
		this.hours = hours;
	}

	calculateTotal() {
		return this.amount * this.hours;
	}
}

// Счет по элементам
class ItemBilling extends Billing {
	constructor(amount, items) {
		super(amount);
		this.items = items;
	}

	calculateTotal() {
		return this.amount * this.items;
	}
}

// Использование
const fixed = new FixedBilling(1000);
const hourly = new HourBilling(50, 160);
const item = new ItemBilling(200, 5);

console.log('Фиксированный:', fixed.calculateTotal()); // 1000
console.log('Почасовой:', hourly.calculateTotal()); // 8000
console.log('Поэлементный:', item.calculateTotal()); // 1000
