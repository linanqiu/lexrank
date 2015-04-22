var lexrank = require('./lexrank');
var url = 'http://www.economist.com/news/finance-and-economics/21648673-regulators-have-made-banking-safer-has-made-markets-riskier-frozen';
var topLines = lexrank.summarizePage(url, 5, function (err, topLines, text) {
  if (err) {
    console.log(err);
  }
  console.log(topLines);
  console.log(text);
});
