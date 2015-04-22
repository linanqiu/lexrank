/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var debug = require('debug')('tokenizer:test');
var assert = require('assert');

var Tokenizer = require('../lib/tokenizer');

describe('Tokenizer creations', function () {
  describe('No botname', function () {
    var tokenizer = new Tokenizer('François');

    it('should use ECTOR as a default botname',
      function() {
        assert.equal(tokenizer.botname, 'ECTOR');
      });
  });
  describe('With specific botname', function () {
    var tokenizer = new Tokenizer('François',
                                  'Achille');

    it('should use Achille as a botname', function() {
      assert.equal(tokenizer.botname, 'Achille');
    });
  });
});

describe('Sentences token', function () {
  var tokenizer = new Tokenizer('François');
  describe('Classic', function () {
    var entry = "Nous allons bien voir ce que ça   donne!" +
    " N'est-ce pas ? " +
    " Et avec une URL en plus, c'est mieux: http://google.com." +
    " Mais il nous manque encore un mail: gg@gggg.kk";
    tokenizer.setEntry(entry);
    var sentences = tokenizer.getSentences();
    it("should get 4 sentences", function () {
      assert.equal(sentences.length, 4);
    });
    it("should have the first sentence", function () {
      assert.equal(sentences[0],
        "Nous allons bien voir ce que ça donne!");
    });
    it("should have second sentence", function () {
      assert.equal(sentences[1], "N'est-ce pas ?");
    });
    it("should have third sentence", function () {
      assert.equal(sentences[2],
        "Et avec une URL en plus, c'est mieux: http://google.com.");
    });
    it("should have fourth sentence", function () {
      assert.equal(sentences[3],
        "Mais il nous manque encore un mail: gg@gggg.kk");
    });
  });
  describe('Two sentences', function () {
    var entry = "Salut." +
    " Hello.";
    tokenizer.setEntry(entry);
    var sentences = tokenizer.getSentences();
    it("should get 2 sentences", function () {
      assert.equal(sentences.length, 2);
    });
  });
  describe('Only one sentence', function () {
    debug('Only one sentence!');
    var entry = "Hello.";
    var tokenizer = new Tokenizer('François');
    tokenizer.setEntry(entry);
    var sentences = tokenizer.getSentences();
    it('should get one sentence', function () {
      assert.equal(sentences.length, 1);
      assert.equal(sentences[0], entry);
    });
    it('should set the sentence', function () {
      assert.equal(tokenizer.sentences[0], entry);
    });
  });
  describe('False end', function () {
    var entry = "Bon sang ce n'est pas ça. Bon sang";
    tokenizer.setEntry(entry);
    var sentences = tokenizer.getSentences();
    it('should produce only 2 sentences', function () {
      assert.equal(sentences.length, 2);
    });
  });
  describe('Names', function () {
    var entry = "Salut ECTOR. Je m'appelle François.";
    tokenizer.setEntry(entry);
    var sentences = tokenizer.getSentences();
    it('botname replaced', function () {
      assert.equal(sentences[0], 'Salut {yourname}.');
    });
    it('username replaced', function () {
      assert.equal(sentences[1], "Je m'appelle {myname}.");
    });
  });
});

describe('Word tokens', function() {
  var tokenizer = new Tokenizer('François');
  var entry = "Très bien ECTOR." +
  " Je suis fort aise que tu m'écoutes." +
  " Très!!!" +
  " Appelle-moi François, si tu veux...";
  tokenizer.setEntry(entry);
  tokenizer.getSentences();
  
  describe('First sentence', function () {
    var tokens = tokenizer.getTokens(0);
    it('should give 3 tokens', function () {
      assert.equal(tokens.length, 3);
    });
    it('should have these tokens', function () {
      assert.equal(tokens[0], "Très");
      assert.equal(tokens[1], "bien");
      assert.equal(tokens[2], "{yourname}.");
    });
  });

  describe('Second sentence', function () {
    var tokens = tokenizer.getTokens(1);
    it('should give 7 tokens', function () {
      assert.equal(tokens.length, 7);
    });
    it('should have these tokens', function () {
      assert.equal(tokens[0], "Je");
      assert.equal(tokens[1], "suis");
      assert.equal(tokens[2], "fort");
      assert.equal(tokens[3], "aise");
      assert.equal(tokens[4], "que");
      assert.equal(tokens[5], "tu");
      assert.equal(tokens[6], "m'écoutes.");
    });
  });

  describe('Third sentence', function () {
    var tokens = tokenizer.getTokens(2);
    it('should give 1 token', function () {
      assert.equal(tokens.length, 1);
    });
    it('should have this token', function () {
      assert.equal(tokens[0], "Très!!!");
    });
  });

  // Appelle-moi François, si tu veux...
  describe('Fourth sentence', function () {
    var tokens = tokenizer.getTokens(3);
    it('should give 5 tokens', function () {
      assert.equal(tokens.length, 5);
    });
    it('should have these tokens', function () {
      assert.equal(tokens[0], "Appelle-moi");
      assert.equal(tokens[1], "{myname},");
      assert.equal(tokens[2], "si");
      assert.equal(tokens[3], "tu");
      assert.equal(tokens[4], "veux...");
    });
  });

});