// source: https://stackoverflow.com/a/44173493/7573430
export const convertCsvArrToJSON = (array) => {
  let objArr = [];
  for (let i = 1; i < array.length; i++) {
    objArr[i - 1] = {};
    for (let k = 0; k < array[0].length && k < array[i].length; k++) {
      const key = array[0][k].replace(" ", "");
      objArr[i - 1][key] = array[i][k];
    }
  }

  return objArr;
};

// source: https://poopcode.com/group-array-of-objects-by-key-in-javascript/
// alternatively, can use _lodash here
export const groupBy = (array, key) => {
  return array.reduce((result, currentItem) => {
    (result[currentItem[key]] = result[currentItem[key]] || []).push(
      currentItem
    );
    return result;
  }, {});
};
