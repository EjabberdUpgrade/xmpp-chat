;// Basic server to serve static assets from /public folder
// with a proxy for XMPP server BOSH interface
'use strict';

var util = require('util')
    , express = require('express')
    , partials = require('express-partials')
    , httpProxy = require('http-proxy')
    , log4js = require('log4js')
    , restify = require('restify')
    , fs = require('fs');

const Environment = process.env.NODE_ENV || undefined;
const HttpPort = process.env.HTTP_PORT || undefined;
const EjabHost = process.env.EJAB_HOST || undefined;
const EjabPort = process.env.EJAB_PORT || undefined; 
util.puts('Node Environment: ' + Environment + ' HttpPort: ' + HttpPort);
if(Environment === 'undefined') throw new Error('Node_Env must be set');

var Workspace = require('./config/spark_config');
this.workspace = new Workspace();


util.puts("Current config values: %j " + util.inspect(this.workspace));


var app = express(), 
    proxy = new httpProxy.HttpProxy({
        target: {
            host: EjabHost,
            port: EjabPort          // Port of XMPP server
        }
    });

app.configure(function() {
    app.use(express.favicon());
    app.use(express.logger(Environment));
    app.use(express.static(__dirname));
    app.use(partials());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'f7cd7374c2851fb727582bf'}));
});

app.set('view engine', 'ejs');

app.configure(Environment, function () {
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

app.get('/sign_up', function (req, res) {
    delete req.session.user;
    res.redirect('/sign_up');
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

app.listen(HttpPort); // XMPP
util.puts("Server running at http://0.0.0.0:" + HttpPort + "/ in " + app.set("env") + " mode.");
