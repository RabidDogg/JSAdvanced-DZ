/**
 Сделайте запрос на https://pokeapi.co/api/v2/pokemon/ditto
 
 После получения, получите информацию о первой его ablility по ссылке, которая приходит при первом запросе. Там найдите описание на английском и выведите в консоль:
 */
'use strict';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/ditto';

const methods = {
	GET: 'GET',
};

function safeParse(jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error('Ошибка парсинга JSON:', error);
		return null;
	}
}

class RequestHelper {
	static sendRequest(method, url, callback) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);

		xhr.addEventListener('load', function () {
			if (this.status === 200) {
				const data = safeParse(this.responseText);
				callback(null, data);
			} else {
				callback(`Ошибка ${this.status}: ${this.statusText}`, null);
			}
		});

		xhr.addEventListener('error', function () {
			callback('Сетевая ошибка', null);
		});

		xhr.send();
	}
}

class AbilityElement {
	constructor(abilityData) {
		this.name = abilityData.ability.name;
		this.url = abilityData.ability.url;
		this.effect_entries = null;
	}

	getAbilityInfo(callback) {
		RequestHelper.sendRequest(methods.GET, this.url, (err, data) => {
			if (err) {
				console.error('Ошибка получения способности:', err);
				callback(err, null);
				return;
			}
			this.effect_entries = data.effect_entries || [];
			callback(null, this);
		});
	}

	getEffect(language = 'en') {
		if (!this.effect_entries) return null;
		const entry = this.effect_entries.find(
			(entry) => entry.language?.name === language,
		);
		return entry ? entry.effect : null;
	}
}

// Использование
RequestHelper.sendRequest(methods.GET, baseUrl, (err, pokemonData) => {
	if (err) {
		console.error('Ошибка загрузки покемона:', err);
		return;
	}

	if (pokemonData.abilities && pokemonData.abilities.length > 0) {
		const ability = new AbilityElement(pokemonData.abilities[0]);

		ability.getAbilityInfo((err, abilityWithInfo) => {
			if (err) return;

			const effect = abilityWithInfo.getEffect('en');
			console.log('Описание способности:', effect);
		});
	}
});
