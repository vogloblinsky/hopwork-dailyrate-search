var request     = require('request'),
    cheerio     = require('cheerio'),
    inquirer    = require('inquirer'),
    Q           = require('q'),

    findAveragePrice = function(bodyData) {
        var $ = cheerio.load(bodyData),
            i = 0,
            finalArr = [],
            price = average = 0;

        $('.price').each(function(i, elem) {
            var individualPrice = $(this).text().match(/\d+/)[0];
            finalArr.push(individualPrice)
        });

        len = finalArr.length;

        for (i; i < len; i++) {
            price += parseInt(finalArr[i]);
        }

        return average = price / len;
    },
    searchMaxPagination = function(bodyData) {
        var $ = cheerio.load(bodyData),
            tmpMax = 0;
        $('.pagination  .signin-mandatory').each(function(i, elem) {
            var _val = parseInt($(this).text());
            if (_val !== 'Nan' && _val > tmpMax) {
                tmpMax = _val
            }
        });
        return tmpMax;
    },
    searchMaxResults = function(bodyData) {
        var $ = cheerio.load(bodyData);
        return $('title').text().match(/\d+/)[0];
    },
    runner = function() {

    },
    starter = function(query) {
        var p = Q.defer();

        console.log(query);

        return p.promise;
    };

/*
request('https://www.hopwork.com/s?q=HTML5&location=&lon=&lat=&countryCode=&country=&region=&regionCode=&city=', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(findAveragePrice(body));
        console.log(searchMaxPagination(body));
        console.log(searchMaxResults(body));
    }
});
*/

inquirer.prompt(
    [
        {
            type: 'input',
            message: 'Which technology/domain would you like to search ?',
            name: 'query'
        }
    ], function(answer) {
    starter(answer.query).then(function(averagePrice) {
        console.log('Average price for ' + answer.query + ' is : ' + averagePrice + '€');
    })
});
