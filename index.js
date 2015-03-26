var request = require('request'),
    cheerio = require('cheerio'),

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
    };

request('https://www.hopwork.com/s?q=HTML5&location=&lon=&lat=&countryCode=&country=&region=&regionCode=&city=', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(findAveragePrice(body));
        console.log(searchMaxPagination(body));
        console.log(searchMaxResults(body));
    }
});
