'use strict';

/**
 *
 * @param {number[]} seen - список идентификаторов, которые уже встречались в коллекции
 * @param {Object} obj - объект, который проверяется на уникальность
 * @returns null или уникальный obj
 */
function getUniqueOrNull(seen, obj) {
  const found = seen.find((item) => item.id === obj.id);
  if (!found) {
    seen.push(obj);
    return obj;
  }
  return null;
}

const initialArrayOfObject = [
  { id: 1, name: 'Вася' },
  { id: 2, name: 'Петя' },
  { id: 1, name: 'Вася' },
];

const seen = [];

const uniqueArray = initialArrayOfObject
  .map((obj) => {
    return getUniqueOrNull(seen, obj);
  })
  .filter((obj) => obj !== null);

const setObject = new Set(uniqueArray);

console.log(setObject);
console.log(`Уникальных записей: ${setObject.size}`);
