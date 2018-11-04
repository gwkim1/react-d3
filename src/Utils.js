// Util functions for data manipulation
export function groupBy(data, accessorKey) {
  const dict = {};
  data.forEach((elem) => {
    const key = elem[accessorKey];
    if (key in dict) {
      dict[key].push(elem);
    } else {
      dict[key] = [elem];
    }
  }, dict);

  return dict;
};

export function filterByEquality(data, accessorKey, value) {
  //console.log("data:" , data);
  const newData = [];
  data.forEach((elem) => {
    //console.log(elem[accessorKey], value);
    if (elem[accessorKey] == value) {
      //console.log("pushed");
      newData.push(elem);
    }
  })
  return newData;
}

export function buildStats(data, accessorKey) {
  const sum = data.reduce((prevVal, elem) => {
    return prevVal + Number(elem[accessorKey]);
  }, 0);
  const count = data.length;
  const max = data.reduce((prevVal, elem) => {
    return prevVal < Number(elem[accessorKey]) ?
                     Number(elem[accessorKey]) : prevVal;
  }, Number.MIN_VALUE);
  const min = data.reduce((prevVal, elem) => {
    return prevVal > Number(elem[accessorKey]) ?
                     Number(elem[accessorKey]) : prevVal;
  }, Number.MAX_VALUE);

  return {min, max, sum, count, mean: sum / count};
}
