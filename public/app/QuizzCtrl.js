'use strict';
angular.module('FileSync').controller('QuizzCtrl',  function (SocketIOService, $scope) {
	  this.titre = "Titre Quizz";
    this.answers = new Array();
  	this.possibleAnswers = new Array();
    this.players = new Array();
    this.logs = new Array();

  	this.answer = '';
    this.question = "Il n'y a pas de question pour le moment !";
    this.possibleAnswer = '';
    this.trueAnswer = '';
    this.log = '';

  	SocketIOService.amIAdmin(function(isAdmin){
  	})

    SocketIOService.getPlayers(function(players){
      for(var i = 0; i < players.length ; i++){
        var numPlayer = i+1;
        var infosPlayer = new Array();
        infosPlayer.push("Player"+numPlayer);
        infosPlayer.push(players[i]);
        this.players.push(infosPlayer);      }
      $scope.$apply();
    }.bind(this));

  	SocketIOService.onAnswerSent(function(answer, player){
      var infosAnswer = new Array();
      infosAnswer.push(player);
      infosAnswer.push(answer);
      this.answers.push(infosAnswer);
      var playerName = '';
      for(var currentPlayer in this.players){
        if(this.players[currentPlayer][1] == player){
          playerName = this.players[currentPlayer][0];
        }
      }
      this.logs.push(playerName+" a répondu !");
      $scope.$apply();
  	}.bind(this));

    SocketIOService.onQuestionAdded(function(question){
      this.question = question;
      $scope.$apply();
    }.bind(this));

    SocketIOService.onPossibleAnswerAdded(function(possibleAnswer){
      var possibleAnswerInfos = new Array();
      possibleAnswerInfos.push(this.possibleAnswers.length);
      possibleAnswerInfos.push(possibleAnswer);
      possibleAnswerInfos.push(false);
      this.possibleAnswers.push(possibleAnswerInfos);
      $scope.$apply(); 
    }.bind(this));

    SocketIOService.onTrueAnswerAdded(function(trueAnswer){
      this.trueAnswer = trueAnswer;
      $scope.$apply(); 
    }.bind(this));

    SocketIOService.onQuestionEnded(function(message){
      for(var i = 0; i < this.answers.length; i++){
        var answer = this.answers[i];
        var playerName = '';
        for(var currentPlayer in this.players){
          if(this.players[currentPlayer][1] == answer[0]){
            playerName = this.players[currentPlayer][0];
          }
        }
        if(answer[1] == this.trueAnswer){
          this.logs.push(playerName+" a correctement répondu à la question !")
        }
        else{
          this.logs.push(playerName+" n'a pas correctement répondu à la question !");
        }
      }
      this.logs.push("La réponse était : "+this.possibleAnswers[parseInt(this.trueAnswer)][1]);
      this.question = '';
      this.answers = new Array();
      this.possibleAnswers = new Array();
      $scope.$apply();
    }.bind(this));

    this.sendAnswer = function(){
      SocketIOService.broadcastSentAnswer(this.answer, this);
      this.answer = '';
    }.bind(this);

    this.addPossibleAnswer = function(){
      SocketIOService.broadcastAddedPossibleAnswer(this.possibleAnswer, this);
      this.possibleAnswer = '';
    }.bind(this);

    this.addQuestion = function(){
      SocketIOService.broadcastAddedQuestion(this.question, this);
      this.question = '';
    }.bind(this);

    this.selectTrueAnswer = function(){
      SocketIOService.broadcastTrueAnswer(this.trueAnswer, this);
      this.trueAnswer = '';
    }.bind(this);

    this.getPlayers = function(){
      SocketIOService.getPlayers();
    }.bind(this);

    this.endQuestion = function(){
      SocketIOService.endQuestion();
    }.bind(this);
  }
);
