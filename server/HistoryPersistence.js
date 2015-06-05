'use strict';

module.exports = function (sqlite) {

  var historyP = [];

  return {
    /**
     * [persist description]
     * @param  {String} filePath
     * @param  {Datetime} timestamp
     * @param  {String} content
     * @param  {Function} f(err)
     */
    persist: function (filePath, timestamp, content, f) {
      // SQLite request in order to add the diff to the database
      var stmt = db.prepare("INSERT INTO historyDiff (filePath, timestamp, content) VALUES (?, ?, ?)");
      stmt.run(filePath, timestamp, content);
      stmt.finalize();
    },

    /**
     * @param  {Number} offset
     * @param  {Number} count  (MAX: 10)
     * @param  {Function} f(err, Array[Object]);
     * e.g.
     *  [{
     *    filePath: '',
     *    timestamp: 120930293,
     *    content: ''
     *  }, ...]
     */
    getHistory: function (limit, offset, f) {
      /* Requete SQLite */
      limit = (limit > 10 || limit < 0) ? 10 : limit;
      var stmt = db.prepare("SELECT * FROM historyDiff LIMIT ? OFFSET ?");
      stmt.run(limit, offset);
      historyP = stmt.finalize();
      return historyP;
    }
    
  };

};
