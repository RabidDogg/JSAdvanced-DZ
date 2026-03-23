/**
 * @typedef {Object} Executable
 * @property {Function} run - метод выполнения действия
 */

/**
 * Абстрактный класс для объектов, которые могут быть выполнены
 * @abstract
 */
export class Executable {
	/**
	 * Выполняет действие
	 * @abstract
	 * @throws {Error} если метод не переопределён
	 */
	run() {
		throw new Error('Метод run() должен быть реализован');
	}
}
