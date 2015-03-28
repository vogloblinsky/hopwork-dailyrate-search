var casper = require('casper').create({
        logLevel: 'debug',
        verbose: false
    }),
    tech = '',
    email = '',
    pwd = '',
    numberPeople = 0,
    paginationIndex = 1,
    averagePrices = 0,
    finalPrice = 0,
    searchNumberOfPeople = function(title) {
        return title.match(/\d+/)[0];
    },
    searchPrice = function(priceString) {
        return priceString.match(/\d+/)[0];
    },
    maxPagination = 0,
    searchMaxPagination = function(pagers) {
        var tmpMax = 0,
            pagers = casper.getElementsInfo('.pagination  .signin-mandatory');
        casper.each(pagers, function(self, pager) {
            var _val = parseInt(pager.text);
            if (_val !== 'Nan' && _val > tmpMax) {
                tmpMax = _val;
            }
        });
        return tmpMax;
    },
    getLinks = function() {
        var links = document.querySelectorAll('.price');
        return Array.prototype.map.call(links, function(e) {
            return e.textContent;
        });
    },
    processPrices = function(rawPrices) {
        var i = 0,
            len = rawPrices.length,
            buffer = 0;
        numberPeople += len;
        for (i; i < len; i++) {
            buffer += parseInt(searchPrice(rawPrices[i]));
        }
        averagePrices += buffer / rawPrices.length;
    },
    getPrices = function() {
        return this.waitForSelector('.price', function() {
            return this.waitFor(function() {
                var _rawPrices = this.evaluate(getLinks);
                processPrices(_rawPrices);
                return true;
            });
        });
    },
    openPageAndCalculateData = function() {
        this.echo('Process page ' + paginationIndex);

        //this.capture('capture-' + paginationIndex + '.png');

        if (paginationIndex > maxPagination) {
            return terminate.call(casper);
        }

        this.waitFor(function() {
            return this.waitFor(function() {
                return this.waitFor(getPrices, function() {
                    paginationIndex++;
                    return casper.open('https://www.hopwork.com/s?q=' + tech + '&location=&lon=&lat=&countryCode=&country=&region=&regionCode=&city=&p=' + paginationIndex);
                });
            });
        }, openPageAndCalculateData, terminate);
    },
    terminate = function() {
        finalPrice = averagePrices / maxPagination;
        this.echo('Average price is: ' + finalPrice + ' €').exit();
    };

casper.cli.drop('cli');
casper.cli.drop('casper-path');

if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    casper.echo('Please provide the option technology').exit();
} else {
    tech = casper.cli.get('technology');
    email = casper.cli.get('email');
    pwd = casper.cli.get('pwd');

    casper.echo('Technology searched: ' + tech);

    casper.start('https://www.hopwork.com/s?q=' + tech + '&location=&lon=&lat=&countryCode=&country=&region=&regionCode=&city=');

    casper.waitFor(function check() {
        //numberPeople = searchNumberOfPeople(this.getTitle());
        maxPagination = searchMaxPagination();
        this.thenClick('#signinlink');
        this.viewport(1200, 800);
        //Wait login modal loaded
        return this.wait(1000, function() {
            // Fill login form
            this.thenEvaluate(function(login, password) {
                document.getElementById('j_username').setAttribute('value', login);
                document.getElementById('signin_password').setAttribute('value', password);
                document.getElementById('btnSignin').click();
            }, email, pwd);
            // Wait login form hidden
            return this.wait(1500, function() {
                return this.capture('capture.png', {
                    top: 0,
                    left: 0,
                    width: 1200,
                    height: 800
                });
            });
        });
    }, openPageAndCalculateData, function timeout() { // step to execute if check has failed
        this.echo('I can\'t has your price !').exit();
    });

    casper.run();
}
