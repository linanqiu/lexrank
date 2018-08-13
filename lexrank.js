(function () {
  'use strict';
  var unfluff = require('unfluff');
  var request = require('request');
  var Tokenizer = require('sentence-tokenizer');
  var natural = require('natural');
  var wuzzy = require('wuzzy');

  function summarizePage(url, lines, callback) {
    request(url, function (err, resp, body) {
      if (err || resp.statusCode != 200) {
        return callback(err);
      }
      var text = unfluff(body).text;
      
      if (!text) {
        return callback(new Error('no text to summarize'));
      }
      
      summarize(text, lines, callback);
    });
  }

  function summarize(text, lines, callback) {
    var sentenceTokenizer = new Tokenizer('utterer');
    sentenceTokenizer.setEntry(text);
    var sentences = sentenceTokenizer.getSentences();
    var sentencesOriginal = sentences.slice();

    var wordTokenizer = new natural.TreebankWordTokenizer();
    sentences.forEach(function (sentence, index, array) {
      array[index] = wordTokenizer.tokenize(sentence.toLowerCase());
    });

    var matrix = constructMatrix(sentences);
    var sortedSentences = pageRank(matrix, sentencesOriginal);

    var topLines = [];

    for (var i = 0; i < Math.min(lines, sortedSentences.length); i++) {
      topLines.push(sortedSentences[i]);
    }

    topLines.sort(function (a, b) {
      return a.index - b.index;
    });

    var concatenated = '';

    for(var i = 0 ; i < topLines.length; i++) {
      concatenated += topLines[i].text + ' ';
    }

    callback(false, topLines, concatenated);
  }

  function fillArray(length, value) {
    var array = [];
    for (var i = 0; i < length; i++) {
      array[i] = value;
    }
    return array;
  }

  function pageRank(matrix, sentencesOriginal) {
    var eigen = fillArray(sentencesOriginal.length, 1);

    for (var h = 0; h < 10; h++) {
      var w = fillArray(sentencesOriginal.length, 0);

      for (var i = 0; i < sentencesOriginal.length; i++) {
        for (var j = 0; j < sentencesOriginal.length; j++) {
          w[i] = w[i] + (matrix[i][j] * eigen[j]);
        }
      }
      eigen = normalize(w);
    }

    // sort bags according to eigen value
    var eigenCounts = [];

    for (var i = 0; i < sentencesOriginal.length; i++) {
      var eigenObject = {
        weight: eigen[i],
        text: sentencesOriginal[i],
        index: i
      }
      eigenCounts.push(eigenObject);
    }
    eigenCounts.sort(function (a, b) {
      return b.weight - a.weight;
    });

    return eigenCounts;
  }

  function constructMatrix(sentences, threshold) {
    var matrix = [];
    for (var i = 0; i < sentences.length; i++) {
      matrix[i] = [];

      var sentenceA = sentences[i];

      for (var j = 0; j < sentences.length; j++) {
        var sentenceB = sentences[j];
        var value = wuzzy.tanimoto(sentenceB, sentenceA);
        if(!!threshold && value < threshold) {
          value = 0;
        }
        matrix[i][j] = value;
      }

      matrix[i] = normalize(matrix[i]);
    }
    return matrix;
  }

  function normalize(array) {
    var distance = 0;

    for (var i = 0; i < array.length; i++) {
      distance += array[i] * array[i];
    }

    distance = Math.sqrt(distance);

    for (var i = 0; i < array.length; i++) {
      array[i] = array[i] / distance;
    }

    return array;
  }

  module.exports = {
    summarize: summarize,
    summarizePage: summarizePage
  }
})();
