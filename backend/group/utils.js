const {validateFormat, csvParser} = require('../lib');

//change EMAIL_ADDRESS AND ID_NUMBER constant values, if the csv format header value changes
const EMAIL_ADDRESS = 'Email address',
  ID_NUMBER = 'ID number',
  EMAIL = 'email',
  CWID = 'cwid';

/*@param str, csv with following headers:
 First name,Last name,ID number,Institution,Department,Email address,Last downloaded from this course

 Avoids duplicate rows in return result
 Avoids rows with invalid cwid or email
 @return Array<{email: string, cwid: number}>
*/
function parseUsersFromCsv(str) {
  const rawParse = csvParser.parse(str);

  //to avoid duplicate cwids
  //{[key: number]: {cwid: number, email: string}}
  const map = {};

  for(let r of rawParse) {
    const cwid = parseInt(r[ID_NUMBER]);
    const email = r[EMAIL_ADDRESS];
    const isValid = validateFormat.checkCWID(cwid) && validateFormat.checkStudentEmail(email);
    if (!isValid) continue;
    map[cwid] = {[EMAIL]: email, [CWID]: cwid};
  }

  return Object.values(map);
}

module.exports = {
  parseUsersFromCsv
};