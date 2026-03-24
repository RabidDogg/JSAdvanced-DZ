import { Executable } from './executable.js';

/**
 * Класс, представляющий задачу
 * @extends Executable
 */
export class Task extends Executable {
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
