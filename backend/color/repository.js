module.exports = function(mysql) {
  async function getColors() {
    const query = `SELECT * from Color`;

    return new Promise(function(resolve, reject){
      mysql.query(query, function(error, rows) {
        if (error) { reject(error); return; }
        resolve(rows);
      });
    });
  }
  
  return { getColors };
}