'use strict';

/**
Научиться преобразовывать прототипы персонажей (Орк и Эльф) в классы с использованием синтаксиса ES6 и освоить принципы преопределения методов.

Шаги Реализации:
1. Создание Базового Класса "Персонаж":
	- Параметры класса: Раса, Имя, Язык.
	- Метод: Говорить (можно сделать приватным на ваше усмотрение).
2. Наследование и Расширение Класса "Персонаж":
	- Создание класса "Орк":
		- Новый параметр: Оружие.
		- Новый метод: Удар.
		- Преопределить метод Говорить специфично для Орка.
	- Создание класса "Эльф":
		- Новый параметр: Заклинание.
		- Новый метод: Создать Заклинание.
		- Преопределить метод Говорить специфично для Эльфа.
3. Применение Синтаксиса ES6:
	- Использование классов ES6 для реализации наследования и расширения функциональности базового класса "Персонаж".
*/

'use strict';

/**
 * Утилиты
 */
function isNotStringOrEmpty(str) {
	return typeof str !== 'string' || str.trim() === '';
}

function validateActor(target) {
	if (!(target instanceof Actor)) {
		throw new Error('Недопустимый противник!');
	}
}

/**
 * Базовый класс персонажа
 */
class Actor {
	constructor(race, name, health, language) {
		this.#validate(race, name, health, language);

		this.race = race;
		this.name = name;
		this.language = language;
		this.health = health;
	}

	#validate(race, name, health, language) {
		const errors = [];
		if (isNotStringOrEmpty(race))
			errors.push('Раса должна быть непустой строкой!');
		if (isNotStringOrEmpty(name))
			errors.push('Имя должно быть непустой строкой!');
		if (isNotStringOrEmpty(language))
			errors.push('Язык должен быть непустой строкой!');
		if (typeof health !== 'number' || health <= 0) {
			errors.push('Здоровье должно быть числом больше 0!');
		}

		if (errors.length) throw new Error(errors.join('\n'));
	}

	introduce() {
		this.say(`Меня зовут ${this.name}!`);
	}

	say(text) {
		if (typeof text !== 'string' || text.trim() === '') return;
		console.log(`[${this.language}] ${text}`);
	}

	takeDamage(damage) {
		if (typeof damage !== 'number' || damage < 0) {
			throw new Error('Урон должен быть положительным числом!');
		}

		if (this.health <= 0) {
			throw new Error('Персонаж уже мёртв!');
		}

		this.health = Math.max(0, this.health - damage);

		if (this.health === 0) {
			console.log(`Персонаж "${this.name}" погиб.`);
		}
	}
}

/**
 * Класс оружия
 */
class Weapon {
	static DEFAULT_DAMAGE = 1;
	static DEFAULT_NAME = 'Без оружия';

	constructor(name, damage) {
		this.#validate(name, damage);
		this.name = name;
		this.damage = damage;
	}

	#validate(name, damage) {
		const errors = [];
		if (isNotStringOrEmpty(name))
			errors.push('Название должно быть непустой строкой!');
		if (typeof damage !== 'number' || damage <= 0) {
			errors.push('Урон должен быть больше нуля!');
		}
		if (errors.length) throw new Error(errors.join('\n'));
	}

	attack(enemy) {
		validateActor(enemy);
		enemy.takeDamage(this.damage);
		console.log(
			`Нанесено ${this.damage} урона "${enemy.name}" используя "${this.name}"`,
		);
	}
}

/**
 * Класс заклинания
 */
class Spell extends Weapon {
	static DEFAULT_NAME = 'Ветерок';
	static DEFAULT_DAMAGE = 1;
	static DEFAULT_MANACOST = 10;

	constructor(name, damage, manacost) {
		super(name, damage);
		if (typeof manacost !== 'number' || manacost <= 0) {
			throw new RangeError(
				'Стоимость заклинания должна быть положительным числом',
			);
		}
		this.manacost = manacost;
	}
}

/**
 * Класс орка
 */
class Orc extends Actor {
	constructor(
		name,
		health,
		language,
		weapon = new Weapon(Weapon.DEFAULT_NAME, Weapon.DEFAULT_DAMAGE),
	) {
		super('orc', name, health, language);

		if (!(weapon instanceof Weapon) || weapon instanceof Spell) {
			throw new Error('Недопустимый вид оружия для Орка!');
		}
		this.weapon = weapon;
	}

	say(text) {
		super.say(`Чв'ик! ${text}. Хы-хы-хы. Ик...`);
	}

	attack(enemy) {
		validateActor(enemy);
		this.weapon.attack(enemy);
	}
}

/**
 * Класс эльфа
 */
class Elf extends Actor {
	constructor(
		name,
		health,
		language,
		mana,
		spell = new Spell(
			Spell.DEFAULT_NAME,
			Spell.DEFAULT_DAMAGE,
			Spell.DEFAULT_MANACOST,
		),
	) {
		super('elf', name, health, language);

		if (typeof mana !== 'number' || mana < 0) {
			throw new Error('Количество маны должно быть больше 0');
		}
		if (!(spell instanceof Spell)) {
			throw new Error('Недопустимый вид заклинания для Эльфа!');
		}

		this.mana = mana;
		this.spell = spell;
	}

	say(text) {
		super.say(this.#toElvish(text));
	}

	#toElvish(text) {
		const elvishMap = {
			а: 'аэ',
			б: 'бри',
			в: 'ви',
			г: 'гли',
			д: 'дир',
			е: 'эл',
			ё: 'эло',
			ж: 'жи',
			з: 'зир',
			и: 'иль',
			й: 'иэ',
			к: 'ки',
			л: 'лэ',
			м: 'мин',
			н: 'ни',
			о: 'ом',
			п: 'пи',
			р: 'рэ',
			с: 'си',
			т: 'тир',
			у: 'ур',
			ф: 'фи',
			х: 'хи',
			ц: 'цэ',
			ч: 'чи',
			ш: 'ши',
			щ: 'щи',
			ъ: '',
			ы: 'ири',
			ь: '',
			э: 'эль',
			ю: 'юэ',
			я: 'яна',
			' ': ' ',
			',': ',',
			'.': '.',
			'!': '!',
			'?': '?',
		};
		return text
			.toLowerCase()
			.split('')
			.map((c) => elvishMap[c] || c)
			.join('');
	}

	castSpell(enemy) {
		validateActor(enemy);

		if (this.mana < this.spell.manacost) {
			throw new Error(
				`Недостаточно маны! Требуется ${this.spell.manacost}, есть ${this.mana}`,
			);
		}

		this.mana -= this.spell.manacost;
		console.log(
			`Использовано ${this.spell.manacost} маны на "${this.spell.name}"`,
		);
		this.spell.attack(enemy);
	}
}

function runTests() {
	console.log('=== ТЕСТИРОВАНИЕ КЛАССОВ ===\n');

	// 1. Создание персонажей
	const weapon = new Weapon('Топор', 10);
	const orc = new Orc('Грог', 100, 'общий', weapon);
	console.log('✅ Орк создан');

	const spell = new Spell('Огненный шар', 15, 10);
	const elf = new Elf('Леголас', 80, 'эльфийский', 50, spell);
	console.log('✅ Эльф создан\n');

	// 2. Проверка речи
	console.log('--- Речь ---');
	orc.say('Привет');
	elf.say('Привет');
	console.log();

	// 3. Бой
	console.log('--- Бой ---');
	console.log(`Здоровье орка: ${orc.health}, эльфа: ${elf.health}`);

	console.log('\nЭльф атакует орка:');
	elf.castSpell(orc);
	console.log(`Здоровье орка после атаки: ${orc.health}`);

	console.log('\nОрк атакует эльфа:');
	orc.attack(elf);
	console.log(`Здоровье эльфа после атаки: ${elf.health}\n`);

	// 4. Проверка маны
	console.log(`Остаток маны эльфа: ${elf.mana}`);

	// 5. Проверка смерти
	console.log('\n--- Проверка смерти ---');
	const weakOrc = new Orc('Слабый орк', 1, 'общий');
	const strongSpell = new Spell('Мощный удар', 100, 20);
	const strongElf = new Elf(
		'Сильный эльф',
		100,
		'эльфийский',
		100,
		strongSpell,
	);

	strongElf.castSpell(weakOrc);
	console.log(`Здоровье слабого орка: ${weakOrc.health}`);

	// 6. Проверка ошибок
	console.log('\n--- Проверка ошибок ---');
	try {
		orc.attack({}); // Не персонаж
	} catch (e) {
		console.log('✅ Ошибка перехвачена:', e.message);
	}
}

runTests();

/* Результаты тестов
app.js:269 === ТЕСТИРОВАНИЕ КЛАССОВ ===

app.js:274 ✅ Орк создан
app.js:278 ✅ Эльф создан

app.js:281 --- Речь ---
app.js:72 [общий] Чв'ик! Привет. Хы-хы-хы. Ик...
app.js:72 [эльфийский] пирэильвиэлтир
app.js:287 --- Бой ---
app.js:288 Здоровье орка: 100, эльфа: 80
app.js:290 
Эльф атакует орка:
app.js:261 Использовано 10 маны на "Огненный шар"
app.js:118 Нанесено 15 урона "Грог" используя "Огненный шар"
app.js:292 Здоровье орка после атаки: 85
app.js:294 
Орк атакует эльфа:
app.js:118 Нанесено 10 урона "Леголас" используя "Топор"
app.js:296 Здоровье эльфа после атаки: 70

app.js:299 Остаток маны эльфа: 40
app.js:302 
--- Проверка смерти ---
app.js:261 Использовано 20 маны на "Мощный удар"
app.js:87 Персонаж "Слабый орк" погиб.
app.js:118 Нанесено 100 урона "Слабый орк" используя "Мощный удар"
app.js:314 Здоровье слабого орка: 0
app.js:317 
--- Проверка ошибок ---
app.js:321 ✅ Ошибка перехвачена: Недопустимый противник!

*/

/* Старая реализация
function Actor(race, name, language) {
	this.race = race;
	this.name = name;
	this.language = language;
}

Actor.prototype.introduce = function () {
	console.log(`[${this.language}] Меня зовут ${this.name}`);
};

function Orc(name, weapon) {
	Actor.call(this, 'Орк', name, 'Оркский');
	this.weapon = weapon;
}

Orc.prototype = Object.create(Actor.prototype);
Orc.prototype.constructor = Orc;

Orc.prototype.attack = function () {
	console.log(`Орк ${this.name} атакует с помощью ${this.weapon}!`);
};

function Elf(name, magicType) {
	Actor.call(this, 'Эльф', name, 'Эльфийский');
	this.magicType = magicType;
}

Elf.prototype = Object.create(Actor.prototype);
Elf.prototype.constructor = Elf;

Elf.prototype.cast = function () {
	console.log(
		`Эльф ${this.name} кастует заклинание с типом: ${this.magicType}!`,
	);
};

const orc = new Orc('Гарош', 'топор');
orc.introduce();
orc.attack();

const elf = new Elf("Кель'Тас", 'Магия крови');
elf.introduce();
elf.cast();
*/
