'use strict';

/* globals document */

var casper = require('casper').create({
        logLevel: 'debug',
        verbose: false
    }),
    utils = require('utils'),
    tech = '',
    email = '',
    pwd = '',
    numberPeople = 0,
    paginationIndex = 1,
    averagePrices = 0,
    finalPrice = 0,
    maxPagination = 0,
    searchPrice = function(priceString) {
        return priceString.match(/\d+/)[0];
    },
    searchMaxPagination = function() {
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
    terminate = function() {
        finalPrice = Math.floor(averagePrices / maxPagination);
        this.echo('Average price is: ' + finalPrice + ' €').exit();
    },
    openPageAndCalculateData = function() {
        this.echo(' Process page ' + paginationIndex);

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
    };

casper.cli.drop('cli');
casper.cli.drop('casper-path');

if (Object.keys(casper.cli.options).length <= 2) {
    casper.echo('Please provide the mandatory options').exit();
} else {
    tech = casper.cli.get('technology');
    email = casper.cli.get('email');
    pwd = casper.cli.get('pwd');

    casper.echo('Technology searched: ' + tech);

    casper.start('https://www.hopwork.com/s?q=' + tech + '&location=&lon=&lat=&countryCode=&country=&region=&regionCode=&city=');

    casper.waitFor(function check() {
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
                casper.echo('Login ok');
                return this.capture('capture.png', {
                    top: 0,
                    left: 0,
                    width: 1200,
                    height: 800
                });
            });
        });
    }, openPageAndCalculateData, function timeout() { // step to execute if check has failed
        this.echo('I can\'t had your price !').exit();
    });

    casper.run();
}
