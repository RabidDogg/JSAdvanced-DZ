/**
Создайте 3 файла:

user.js – содержит класс User, который в constructor принимает Task и метод do(), который вызывает у Task метод run().
task.js – содержит класс Task с методом run(), который выводит в консоль заданной в constructor сообщение.
index.js - создаёт Task, а затем User с этим Task и вызывает у User метод do().
*/
import { User } from './modules/user.js';
import { Task } from './modules/task.js';

(function () {
	try {
		const task = new Task('Тестовое задание');
		const user = new User(task);

		user.do();
	} catch (error) {
		console.error('Ошибка:', error.message);
	}
})();
