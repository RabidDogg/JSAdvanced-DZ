/**
Сделайте функцию получения координат пользователя, использую Geolocation API, но преобразовав его в Promise.

 */
'use strict';

function getCurrentPositionAsync() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation API не поддерживается'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => resolve(pos.coords),
			(error) => reject(error),
		);
	});
}

getCurrentPositionAsync()
	.then((coords) => {
		console.log(`Latitude = ${coords.latitude}`);
		console.log(`Longitude = ${coords.longitude}`);
	})
	.catch((error) => {
		console.error('Ошибка получения геолокации:', error.message);
	});
