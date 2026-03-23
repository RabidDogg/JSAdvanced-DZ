/**
 * @typedef {import('./executable.js').Executable} Executable
 */

/**
 * Класс, представляющий пользователя, который может выполнять действия
 */
export class User {
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
