#Hopwork Dailyrate Search

CasperJS script to get an average daily rate on www.hopwork.com

## Requirements

- Nodejs
- SlimerJS installed globally : http://slimerjs.org/ | npm install -g slimerjs
- CasperJS installed globally : http://casperjs.org/ | npm install -g casperjs

## Use

```
casperjs --engine=slimerjs -load-images no index.js --technology=YOURSEARCH --email=YOUREMAIL --pwd=YOURPASSWORD
```

If your are behind a corporate proxy, add the required params

```
casperjs --engine=slimerjs -load-images no --proxy=YOURPROXY --proxy-type=http index.js --technology=YOURSEARCH --email=YOUREMAIL --pwd=YOURPASSWORD
```

## Results

```
Technology searched: html5
Average price is: 350 €
```