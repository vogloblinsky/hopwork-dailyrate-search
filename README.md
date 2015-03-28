#Hopwork Dailyrate Search

CasperJS script to get an average daily rate on www.hopwork.com

## Requirements

- Nodejs
- SlimerJS installed globally : http://slimerjs.org/ | npm install -g slimerjs
- CasperJS installed globally : http://casperjs.org/ | npm install -g casperjs

## Use

```
casperjs --engine=slimerjs -load-images no index.js --technology=html5 --email=YOUREMAIL --pwd=YOURPASSWORD
```