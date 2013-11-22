// Basic server to serve static assets from /public folder
// with a proxy for XMPP server BOSH interface
'use strict';

var util = require('util'),
    express = require('express'),
    partials = require('express-partials'),
    assert = require('assert'),
    httpProxy = require('http-proxy');
 
/*
var XMPPChatConfig = {
    throwifundefined = function(ValNane, Val) {
        if(Val === 'undefined') {
            throw new Error('ValName cannot be ' + Val),
        }
    },
    environment: process.env.NODE_ENV || 'undefined',
    node_config: {
        host: require('os').hostname() || 'undefined',
        port: process.env.HTTP_PORT || 'undefined'
    },
    ejab_config: {
        host: process.env.EJAB_HOST || 'undefined',
        port: process.env.EJAB_PORT || 'undefined'
    }
};
*/
var Environment = process.env.NODE_ENV || 'undefined';
var NodeHost = require('os').hostname() || 'undefined';
var HttpPort = process.env.HTTP_PORT || 'undefined';
var EjabHost = process.env.EJAB_HOST || 'undefined';
var EjabPort = process.env.EJAB_PORT || 'undefined'; 
util.puts('Node Environment: ' + Environment + ' HttpPort: ' + HttpPort);

assert(Environment !== 'undefined', 'Node_Env must be set');
assert(NodeHost !== 'undefined', 'NodeHost must be set');
assert(HttpPort !== 'undefined', 'HttpPort must be set');
assert(EjabHost !== 'undefined', 'EjabHost must be set');
assert(EjabPort !== 'undefined', 'EjabPort must be set');


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

app.listen(HttpPort); // XMPP
util.puts("Server running at http://" + NodeHost +":"+ HttpPort +"/ in " + app.set("env") + " mode.");

