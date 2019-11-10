const UNDEFINED = 'undefined';

/*
  @param str, string
  assuming columns of first rows are headers, which will be used as keys for the columns of remaining row,
  if remaining rows have column count greater than first row, then excess columns are ignored
  if remaining rows have column count smaller than first row, then null is used as value pair
  @return Array<Object>
*/
function parse(str) {
  const lines = str.split('\n');
  if (lines.length <= 1) return [];

  const headerRow = lines[0].split(',');
  const columnCount = headerRow.length;

  if (columnCount <= 0) return [];

  const result = [];
  //check duplicate in header row
  if (new Set(headerRow).size < columnCount)
    throw new Error('duplicate vaues in header row');  

  for(let i = 1; i < lines.length; i++) {
    const colValues = lines[i].split(',');    
    const row = {};

    for(let j = 0; j < columnCount; j++) {
      const colName = headerRow[j];
      let colValue = colValues[j];
      if (typeof colValue === UNDEFINED) colValue = null;
      row[colName] = colValue;
    }
    result.push(row);
  }

  return result;
}

module.exports = {
  parse
}