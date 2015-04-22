# lexrank.js

Implements Radev's Lexrank algorithm [http://www.jair.org/papers/paper1523.html](http://www.jair.org/papers/paper1523.html) for unsupervised text summarization in node. Basically applying PageRank to each sentence in a document, finding the most important sentences, and reranking them.

## Quick Start

```js
var lexrank = require('lexrank');
```

The `lexrank` provides two functions:

```js
lexrank.summarize(text, lineCount, callback)
```

where

- `text` is the original text. There's no need to tokenize the text. Raw text is fine. `lexrank.js` does a sentence tokenization and then word tokenization.
- `lineCount` is the number of sentences in the output desired.

```js
lexrank.summarizePage(url, lineCount, callback)
```

where

- `url` is the URL of the page to summarize. `lexrank` then uses [`node-unfluff`](https://github.com/ageitgey/node-unfluff) to extract the text content from the page, then passes it to `lexrank.summarize`

The other parameters are the same.

## Examples

```js
var lexrank = require('lexrank');
var originalText = 'some...text...here...';
var topLines = lexrank.summarize(originalText, 5, function (err, toplines, text) {
  if (err) {
    console.log(err);
  }
  console.log(toplines);
// [{
//   weight: 0.16398118821187135,
//   text: 'The intention of all these rules is to prevent a repeat of the bankruptcies and bail-outs of 2008.',
//   index: 3
// }, {
//   weight: 0.1603637724075845,
//   text: 'By throttling the bits of banks that “make markets” in bonds, shares, currencies and commodities, the theory goes, watchdogs have made such assets less liquid.',
//   index: 5
// }, {
//   weight: 0.1670898954042791,
//   text: 'Meanwhile, the value of outstanding bonds has swollen to record levels, most of them in the hands of asset managers (see chart).',
//   index: 12
// }, {
//   weight: 0.17266004699219448,
//   text: 'That is in part a corollary of banks trimming lending, and so pushing borrowers to the bond market instead, and in part a natural response to low interest rates.',
//   index: 13
// }, {
//   weight: 0.16298329363189878,
//   text: 'They also suspect, however, that the high level of liquidity before the crisis was an anomaly that bankers are harping on about in an effort to roll back regulation.',
//   index: 32
// }]

  console.log(text);
// The intention of all these rules is to prevent a repeat of the bankruptcies
// and bail-outs of 2008. By throttling the bits of banks that “make markets” in
// bonds, shares, currencies and commodities, the theory goes, watchdogs have
// made such assets less liquid. Meanwhile, the value of outstanding bonds has
// swollen to record levels, most of them in the hands of asset managers (see
// chart). That is in part a corollary of banks trimming lending, and so pushing
// borrowers to the bond market instead, and in part a natural response to low
// interest rates. They also suspect, however, that the high level of liquidity
// before the crisis was an anomaly that bankers are harping on about in an
// effort to roll back regulation.
});
```

lexrank returns both a toplines object which contains an array of the top sentences objects together with their text, eigenvalues associated with them ,and their sentence index.

Since most of us will be using this to grab text from sites, lexrank can take URLs as well.

```js
var lexrank = require('lexrank');
var url = 'http://www.economist.com/news/finance-and-economics/21648673-regulators-have-made-banking-safer-has-made-markets-riskier-frozen';
var topLines = lexrank.summarizePage(url, 5, function (err, topLines, text) {
  if (err) {
    console.log(err);
  }
  console.log(toplines);

  console.log(text);
});
```

## Evaluation

This is **not** a great summarization algorithm. However, it is an improvement on picking the first few sentences at little to no cost in time.

For example using this [article from The Economist on liquidity in financial markets](http://www.economist.com/news/finance-and-economics/21648673-regulators-have-made-banking-safer-has-made-markets-riskier-frozen):

The first paragraph shows

> TO ENSURE that it meets the 750 new rules on capital imposed in the aftermath of the financial crisis, JPMorgan Chase employs over 950 people. A further 400 or so try to follow around 500 regulations on the liquidity of its assets, designed to stop the bank toppling over if markets seize up. A team of 300 is needed to monitor compliance with the Volcker rule, which in almost 1,000 pages restricts banks from trading on their own account.

lexrank produces

> The intention of all these rules is to prevent a repeat of the bankruptcies and bail-outs of 2008. By throttling the bits of banks that “make markets” in bonds, shares, currencies and commodities, the theory goes, watchdogs have made such assets less liquid. Meanwhile, the value of outstanding bonds has swollen to record levels, most of them in the hands of asset managers (see chart). That is in part a corollary of banks trimming lending, and so pushing borrowers to the bond market instead, and in part a natural response to low interest rates. They also suspect, however, that the high level of liquidity before the crisis was an anomaly that bankers are harping on about in an effort to roll back regulation.

Which is way more relevant than the story on JPMorgan. I'm sorry JPMorgan.

## License

The MIT License (MIT)

Copyright (c) 2015 [Linan Qiu](github.com/linanqiu)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
