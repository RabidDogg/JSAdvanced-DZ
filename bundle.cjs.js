'use strict';

/**
 * @typedef {import('./executable.js').Executable} Executable
 */

/**
 * Класс, представляющий пользователя, который может выполнять действия
 */
class User {
	/**
	 * Создаёт экземпляр пользователя
	 * @param {Executable} executable - объект, реализующий метод run()
	 * @throws {Error} если переданный объект не имеет метода run()
	 */
	constructor(executable) {
		if (!executable || typeof executable.run !== 'function') {
			throw new Error(
				'Переданный объект должен реализовывать метод run()',
			);
		}

		this.executable = executable;
	}

	/**
	 * Выполняет действие пользователя
	 * @returns {void}
	 */
	do() {
		this.executable.run();
	}
}

/**
 * @typedef {Object} Executable
 * @property {Function} run - метод выполнения действия
 */

/**
 * Абстрактный класс для объектов, которые могут быть выполнены
 * @abstract
 */
class Executable {
	/**
	 * Выполняет действие
	 * @abstract
	 * @throws {Error} если метод не переопределён
	 */
	run() {
		throw new Error('Метод run() должен быть реализован');
	}
}

/**
 * Класс, представляющий задачу
 * @extends Executable
 */
class Task extends Executable {
	/**
	 * Создаёт экземпляр задачи
	 * @param {string} message - сообщение для вывода
	 * @throws {Error} если message не является непустой строкой
	 */
	constructor(message) {
		super();

		if (typeof message !== 'string' || message.trim() === '') {
			throw new Error('Сообщение задачи должно быть непустой строкой');
		}

		this.message = message;
	}

	/**
	 * Выполняет задачу (выводит сообщение в консоль)
	 * @returns {void}
	 */
	run() {
		console.log(this.message);
	}
}

/**
Создайте 3 файла:

user.js – содержит класс User, который в constructor принимает Task и метод do(), который вызывает у Task метод run().
task.js – содержит класс Task с методом run(), который выводит в консоль заданной в constructor сообщение.
index.js - создаёт Task, а затем User с этим Task и вызывает у User метод do().
*/

(function () {
	try {
		const task = new Task('Тестовое задание');
		const user = new User(task);

		user.do();
	} catch (error) {
		console.error('Ошибка:', error.message);
	}
})();
