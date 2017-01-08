var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '116.62.40.65:9200',
    log: 'trace'
});

var hits = null;

client.search({
    index: 'market_index',
    type: '指数行情',
    size: 1000,
    body: {
        query: {
            match: {
                "指数代码": '000001'
            }
        },
        sort:[{"交易日":{"order":"desc","missing" : "_last" , "unmapped_type":"date"}}]
    }
}).then(function (resp) {
    hits = resp.hits.hits;
    console.log(hits)
}, function (err) {
    console.trace(err.message);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});

router.get('/service', function(req, res, next) {
    res.render('service', { title: 'Express' });
});

router.get('/bbs', function(req, res, next) {
    res.render('bbs', { title: 'Express' });
});

router.get('/basic', function(req, res, next) {

    var value  = [];
    for(i = 0; i < hits.length; i++)
        value[hits.length - i - 1] = ( [ hits[i]._source["交易日"].replace(new RegExp('-', 'g'),'/'), hits[i]._source["今开盘指数"], hits[i]._source["今收盘指数"], hits[i]._source["最低价指数"], hits[i]._source["最高价指数"], hits[i]._source["成交量"]])
        //value[hits.length - i - 1] = ( [ hits[i]._source["交易日"].replace(new RegExp('-', 'g'),'/'), hits[i]._source["开盘价"], hits[i]._source["收盘价"], hits[i]._source["最低价"], hits[i]._source["最高价"], hits[i]._source["成交量"]])

    //var valueparsed = JSON.parse("[" + value  + "]" )

    res.render('basic', {data : JSON.stringify(value)});
});

module.exports = router;
