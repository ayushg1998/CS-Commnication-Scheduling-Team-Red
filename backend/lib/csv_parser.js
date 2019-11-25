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

const parseUsersFromCsv = (function() {
  const validateFormat = require('./validate-format');

  //change EMAIL_ADDRESS AND ID_NUMBER constant values, if the csv format header value changes
  const EMAIL_ADDRESS = 'Email address',
    ID_NUMBER = 'ID number',
    FIRST_NAME = 'First name',
    LAST_NAME = 'Last name';

  /*@param str, csv with following headers:
  First name,Last name,ID number,Institution,Department,Email address,Last downloaded from this course

  Avoids duplicate rows in return result
  Avoids rows with invalid cwid or email
  @return Array<{email: string, cwid: number, fname: string, lname: string}>
  */
  return function(str) {
    const rawParse = parse(str);

    //to avoid duplicate cwids
    //{[key: number]: {cwid, email, fname, lname}}
    const map = {};

    for(let r of rawParse) {
      const cwid = parseInt(r[ID_NUMBER]);
      const email = r[EMAIL_ADDRESS];
      const fname = r[FIRST_NAME];
      const lname = r[LAST_NAME];

      const isValid = validateFormat.checkCWID(cwid) && 
        validateFormat.checkStudentEmail(email) &&
        validateFormat.checkFname(fname) &&
        validateFormat.checkLname(lname);

      if (!isValid) continue;

      map[cwid] = {fname, lname, email, cwid};
    }

    return Object.values(map);
  }
})();

module.exports = {
  parse,
  parseUsersFromCsv
}