/**
Задание:
Изучив принцип работы с промисами, ваша задача — улучшить код из предыдущего домашнего задания.
В предыдущем задании вы получали информацию о покемоне, затем получали данные о его первом умении (нулевая обилика) и, наконец, по ссылке из этой информации извлекали описание умения на английском языке.
В отличие от предыдущего подхода, где использовались колбэки, сейчас необходимо реализовать этот же функционал, используя цепочки промисов.
Обратите особое внимание на обработку возможных ошибок, например, если сервер не ответит. Улучшенный подход должен предусматривать корректную обработку исключительных ситуаций.
 */
'use strict';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/ditto';

const methods = {
	GET: 'GET',
};

// function safeParse(jsonString) {
// 	try {
// 		return JSON.parse(jsonString);
// 	} catch (error) {
// 		console.error('Ошибка парсинга JSON:', error);
// 		return null;
// 	}
// }

class FetchHelper {
	static sendRequest(url, method = methods.GET) {
		return fetch(url, {
			method,
		})
			.then((resp) => {
				if (!resp.ok) {
					throw new Error(
						`Ошибка при выполнении запроса: ${resp.status}`,
					);
				}
				return resp.json();
			})
			.catch((error) => {
				console.error(
					`Возникло исключение при выполнении запроса: ${error}`,
				);
				throw error; // Пробрасываем ошибку дальше
			});
	}
}

// Старая реализация
// class RequestHelper {
// 	static sendRequest(method, url, callback) {
// 		const xhr = new XMLHttpRequest();
// 		xhr.open(method, url);

// 		xhr.addEventListener('load', function () {
// 			if (this.status === 200) {
// 				const data = safeParse(this.responseText);
// 				callback(null, data);
// 			} else {
// 				callback(`Ошибка ${this.status}: ${this.statusText}`, null);
// 			}
// 		});

// 		xhr.addEventListener('error', function () {
// 			callback('Сетевая ошибка', null);
// 		});

// 		xhr.send();
// 	}
// }

class AbilityElement {
	constructor(abilityData) {
		this.name = abilityData.ability.name;
		this.url = abilityData.ability.url;
		this.effect_entries = null;
	}

	fetchAbilityInfo() {
		return FetchHelper.sendRequest(this.url).then((data) => {
			this.effect_entries = data.effect_entries || [];
			return this;
		});
	}

	// Старая реализация
	// getAbilityInfo(callback) {
	// 	RequestHelper.sendRequest(methods.GET, this.url, (err, data) => {
	// 		if (err) {
	// 			console.error('Ошибка получения способности:', err);
	// 			callback(err, null);
	// 			return;
	// 		}
	// 		this.effect_entries = data.effect_entries || [];
	// 		callback(null, this);
	// 	});
	// }

	getEffect(language = 'en') {
		if (!this.effect_entries) return null;
		const entry = this.effect_entries.find(
			(entry) => entry.language?.name === language,
		);
		return entry ? entry.effect : null;
	}
}

FetchHelper.sendRequest(baseUrl)
	.then((pokemonData) => {
		const abilities = pokemonData.abilities;
		if (!abilities || abilities.length === 0) {
			throw new Error('Способности не найдены');
		}
		const ability = new AbilityElement(abilities[0]);
		return ability.fetchAbilityInfo();
	})
	.then((ability) => {
		const effect = ability.getEffect();
		console.log('Описание способности:', effect);
	})
	.catch((error) => {
		console.error(`Возникло исключение при выполнении задачи: ${error}`);
	});

// Старая реализация
// RequestHelper.sendRequest(methods.GET, baseUrl, (err, pokemonData) => {
// 	if (err) {
// 		console.error('Ошибка загрузки покемона:', err);
// 		return;
// 	}

// 	if (pokemonData.abilities && pokemonData.abilities.length > 0) {
// 		const ability = new AbilityElement(pokemonData.abilities[0]);

// 		ability.getAbilityInfo((err, abilityWithInfo) => {
// 			if (err) return;

// 			const effect = abilityWithInfo.getEffect('en');
// 			console.log('Описание способности:', effect);
// 		});
// 	}
// });
