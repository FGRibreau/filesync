'use strict';

angular.module('FileSync').controller('HistoryPersistenceCtrl', ['HistoryPersistence',
  function (HistoryPersistence) {
  	var limit = 10;
  	var offset = 0;

    this.historyP = HistoryPersistence.getHistory(limit, offset, function (err) {
      console.log(err);
    });

    this.persist = function (filename, timestamp, content) {
      HistoryPersistence.persist(filename, timestamp, content, function (err){
        console.log(err);
      });
    };
  }
]);
