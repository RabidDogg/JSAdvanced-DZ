'use strict';

/**
 * Создать базовый класс Персонажа с параметрами: раса, имя, язык и метод - говорить (выводит язык и имя в консоль).

 * Создать класс Орка, который наследуется от Персонажа, у которого есть оружие и который имеет метод - удара.

 * Создать класс Эльфа, который наследуется от Персонажа, у которого есть типа заклинаний и метод – создать заклинание.

 * Использовать прототипное наследование. Все методы просто выводят что-то в консоль.

*/

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

/**
 * app.js:21 [Оркский] Меня зовут Гарош
 * app.js:33 Орк Гарош атакует с помощью топор!
 * app.js:21 [Эльфийский] Меня зовут Кель'Тас
 * app.js:45 Эльф Кель'Тас кастует заклинание с типом: Магия крови!
 */
