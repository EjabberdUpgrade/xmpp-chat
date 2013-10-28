;// Basic server to serve static assets from /public folder
// with a proxy for XMPP server BOSH interface
'use strict';

var util = require('util')
    , express = require('express')
    , partials = require('express-partials')
    , httpProxy = require('http-proxy')
    , log4js = require('log4js')
    , restify = require('restify')
    , ALCE = require('alce')
    , fs = require('fs');


var confSource = path.join(__dirname, 'config.json');
    config = ALCE.parse(confSource, {meta: true});	

var log4jConfig = function(error, configJson) {
    if(error) {
      log.error("Error reading config %d", error);		
      throw new Error("config read error abort!")	
    };
    log4jConf = configJson.get('log4j');
    log4js.configure(
	JSON.stringify(log4jConf));

var log4js = require('/log4js')
    , log =  log4js.getLogger("	xmpp-chat");

var ejabConfig = function(error, configJson) {
    if(error) {
      log.error("Error reading config %d", error);		
      throw new Error("config read error abort!")	
    };    
    var Host =  configJson.get('ejabberd').get('host');
    var Port =  configJson.get('ejabberd').get('port');
    JSON.stringify({ target: {
	host: Host,
	port: Port
   }});

};

var app = express(), 
    ejabberd =  ejabConfig(),
    proxy = new httpProxy.HttpProxy({
        target: {
            host: ,
            port:           // Port of XMPP server
        }
    });

app.configure(function() {
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname));
    app.use(partials());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'f7cd7374c2851fb727582bf'}));
});

app.set('view engine', 'ejs');

app.configure("development", function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function (req, res) {
    if (!req.session.user) {
        res.redirect('/sign_in');
    } else {
        res.render('index', {
            locals: {
                user: req.session.user
            }
        });
    }
});

app.get('/sign_in', function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('sign_in');
    }
});

app.post('/sign_in', function (req, res) {
    req.session.user = {
        name: req.body.name,
        password: req.body.password
    };
    res.redirect('/');
});

app.get('/sign_out', function (req, res) {
    delete req.session.user;
    res.redirect('/sign_in');
});


app.get('/test', function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('unit_test');
    }
});


// Proxy BOSH request to XMPP server
app.all('/http-bind', function(req, res) {
    util.puts('Request successfully proxied: ' + req.url);
    util.puts(JSON.stringify(req.headers, true, 2));
    proxy.proxyRequest(req, res);
});

app.listen(9677); // XMPP
util.puts("Server running at http://0.0.0.0:9677/ in " + app.set("env") + " mode.");
