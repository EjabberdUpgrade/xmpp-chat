// Basic server to serve static assets from /public folder
// with a proxy for XMPP server BOSH interface
'use strict';

var util = require('util'),
    express = require('express'),
    partials = require('express-partials'),
    httpProxy = require('http-proxy');


var Environment = process.env.NODE_ENV || 'undefined';
var NodeHost = require('os').hostname() || 'undefined';
var HttpPort = process.env.HTTP_PORT || 'undefined';
var EjabHost = process.env.EJAB_HOST || 'undefined';
var EjabPort = process.env.EJAB_PORT || 'undefined'; 
util.puts('Node Environment: ' + Environment + ' HttpPort: ' + HttpPort);


if(Environment === 'undefined') throw new Error('Node_Env must be set');
if(NodeHost === 'undefined') throw new Error('NodeHost must be set');
if(HttpPort === 'undefined') throw new Error('HttpPort must be set');
if(EjabHost === 'undefined') throw new Error('EjabHost must be set');
if(EjabPort === 'undefined') throw new Error('EjabPort must be set');


var Workspace = require('./config/spark_config');

var app = express(),
    proxy = new httpProxy.HttpProxy({
        target: {
            host: EjabHost,
            port: EjabPort          // Port of XMPP server
        }
    });

app.configure(function() {
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

app.get('/online_status', function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('online_status');
    }
})

app.get('/online_users', function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('online_users');
    }
})


app.get('/sign_out', function (req, res) {
    delete req.session.user;
    res.redirect('/sign_in');
});

// Proxy BOSH request to XMPP server
app.all('/http-bind', function(req, res) {
    util.puts('Request successfully proxied: ' + req.url);
    util.puts(JSON.stringify(req.headers, true, 2));
    proxy.proxyRequest(req, res);
});

app.listen(9677); // XMPP
util.puts("Server running at http://0.0.0.0:9677/ in " + app.set("env") + " mode.");

