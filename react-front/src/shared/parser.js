const REG_WARHAWKS = /@warhawks\.ulm\.edu/;

/*
  NOTE: very crude, works for our csv though
  @param str: string, comma seperated csv styled string,
  @return Array<string>, array of warhawk emails
*/
export function parseWarhawkEmailsFromCsv(str) {
  return str.split('\n')
    .reduce((acc, line) => {
      const emails = line
        .split(',')
        .filter(s => REG_WARHAWKS.test(s));

      emails.forEach(e => acc.push(e));      
      return acc;
    }, [])
}