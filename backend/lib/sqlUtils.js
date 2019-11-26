const assert = require('assert');
const moment = require('moment-timezone'); moment.tz.setDefault('utc');
/*
  @param array: Array<>
  @return sql array syntax stringified

  example [1, 2, 3] to '(1, 2, 3)'
*/
function sqlLikeArray(array) {
  assert.ok(Array.isArray(array));
  return '(' + array.join(',') + ')';
}

/*
  @param array: Array<> 
  @return format that sql likes when inserting it

  e.g. [1, 2, 3, 'hello', null, undefined, moment()] to (1,2,3,'hello',null,null,'2019-10-21T02:07:56.752Z')
*/
function sqlValues(array) {
  assert.ok(Array.isArray(array));

  array = array
    .map(r => r instanceof moment? r.toISOString(): r)
    .map(r => typeof r === 'string'? `'${r}'`: r)
    .map(r => (r === null || r === undefined)? 'null': r);
    
  return '(' + array.join(',') + ')';
}

/*
  @param arrOfArr: Array<Array<>> e.g. [[1, 2], [2, 3]]
  @return '(1, 2), (2, 3);'
*/
function sqlManyValues(arrOfArr) {
  assert.ok(Array.isArray(arrOfArr));
  if (arrOfArr.length == 0) return null;
  
  const len = arrOfArr.length;

  return arrOfArr.map((arr, index) =>{
    assert.ok(Array.isArray(arr));

    return index >= len - 1?
    `${sqlValues(arr)};`: `${sqlValues(arr)},`;
  })
  .join(' ');
}

function sqlValue(v) {
  if (v instanceof moment) v = v.toISOString();
  if (typeof v === 'string') return `'${v}'`;
  if (v === null || v === undefined) return 'null';
  return v;
}

module.exports = { sqlLikeArray, sqlValues, sqlValue, sqlManyValues };