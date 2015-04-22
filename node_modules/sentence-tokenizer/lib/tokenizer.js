/*jshint node:true, laxcomma:true */
"use strict";

var debug = require('debug')('tokenizer');

var sugar = require('sugar');

function Tokenizer(username, botname) {

  // // Maybe it is not useful
  // if (!(this instanceof Tokenizer)) {
  //   return new Tokenizer();
  // }

  this.username = username || 'Guy';
  this.entry = null;
  this.sentences = null;

  if (typeof botname == 'string') {
    this.botname = botname;
  }
  else {
    this.botname = 'ECTOR';
  }
}

Tokenizer.prototype = {
  setEntry : function (entry) {
    this.entry = entry.compact();
    this.sentences = null;
  },
  // Split the entry into sentences.
  getSentences : function () {
    // this.sentences = this.entry.split(/[\.!]\s/);
    var words = this.entry.words();
    var endingWords = words.filter(function(w) {
      return w.endsWith(/[\.!\?]/);
    });

    var self = this;
    var botnameRegExp = new RegExp("\\W?" + self.botname.normalize() + "\\W?");
    var usernameRegExp = new RegExp("\\W?" + self.username.normalize() + "\\W?");
    var lastSentence = words[0];
    self.sentences = [];
    words.reduce(function (prev, cur, index, array) {
      var curNormalized = cur.normalize();
      var curReplaced = cur;
      if (curNormalized.search(botnameRegExp) !== -1) {
        curReplaced = cur.replace(self.botname,"{yourname}");
      }
      else if (curNormalized.search(usernameRegExp) !== -1) {
        curReplaced = cur.replace(self.username,"{myname}");
      }

      if (endingWords.indexOf(prev) != -1) {
        self.sentences.push(lastSentence.compact());
        lastSentence = "";
      }
      lastSentence = lastSentence + " " + curReplaced;
      return cur;
    });
    self.sentences.push(lastSentence.compact());
    return this.sentences;
  },
  // Get the tokens of one sentence
  getTokens : function (sentenceIndex) {
    var s = 0;
    if(typeof sentenceIndex === 'number') s = sentenceIndex;
    return this.sentences[s].words();
  }
};

module.exports = Tokenizer;