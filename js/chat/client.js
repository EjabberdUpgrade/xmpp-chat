// TODO:
// - bare/full JIDs
//   - send messages using full JID if available
//   - forget full JID on presence change (from online to offline-ish)
// - properly parse activity messages (?)
// - offline (delayed) messages (?)
// - automatic reconnecting... (?)
// - fetch user data (avatar, metadata) (?)

var IM = {};

// constructor
IM.Client = function (options) {
    this.host = options.host || '/http-bind';  //the server already proxy it
    this.jid = options.jid;
    this.password = options.password;
    this.connection = new Strophe.Connection(this.host);
    this.jids = {};

    // TODO: move into a function
    // monitor all traffic in debug mode
    if (options.debug) {
	Strophe.LogLevel = 0;
        this.connection.xmlInput = function (xml) {
            console.log('Incoming:');
            console.log(xml);
        };
        this.connection.xmlOutput = function (xml) {
            console.log('Outgoing:');
            console.log(xml);
        };
    }
};

// private properties and methods
IM.Client.prototype._onConnect = function (status) {
    var Status = Strophe.Status;

    switch (status) {
    case Status.ERROR:
   	console.log('Strophe status: Status.ERROR');

        $.publish('error.client.im');
        break;
    case Status.CONNECTING:
   	console.log('Strophe status: Status.CONNECTING');
        $.publish('connecting.client.im');
        break;
    case Status.CONNFAIL:
   	console.log('Strophe status: Status.CONNFAIL');
        $.publish('connfail.client.im');
        break;
   case Status.AUTHENTICATING:
   	console.log('Strophe status: Status.AUTHENTICATING');
        $.publish('authenticating.client.im');
        break;
    case Status.AUTHFAIL:
   	console.log('Strophe status: Status.AUTHFAIL');
        $.publish('authfail.client.im');
        break;
    case Status.CONNECTED:
   	console.log('Strophe status: Status.CONNECTED');
        this._onConnected();
        $.publish('connected.client.im');
        break;
    case Status.DISCONNECTING:
   	console.log('Strophe status: Status.DISCONNECTING');
        $.publish('diconnecting.client.im');
        break;
    case Status.DISCONNECTED:
   	console.log('Strophe status: Status.DISCONNECTED');
        $.publish('diconnected.client.im');
        break;
    case Status.ATTACHED:
   	console.log('Strophe status: Status.ATTACHED');
        $.publish('attached.client.im');
        break
   default:
   	console.log('Strophe status: Status.UNKNOWN');
	break
    }

    return true;
};

IM.Client.prototype._onConnected = function () {
    // get friend list
    this.getRoster(null, _.bind(this._onRoster, this));

    // monitor friend list changes
    this.connection.addHandler(_.bind(this._onRosterChange, this), Strophe.NS.ROSTER, 'iq', 'set');

    // monitor friends presence changes
    this.connection.addHandler(_.bind(this._onPresenceChange, this), null, 'presence');

    // monitor incoming chat messages
    this.connection.addHandler(_.bind(this._onMessage, this), null, 'message', 'chat');

    // notify others that we're online and request their presence status
    this.presence();
};

IM.Client.prototype._onPresenceChange = function (stanza) {
    stanza = $(stanza);

    // @show: possible values: XMPP native 'away', 'chat', 'dnd', 'xa' and 2 custom 'online' and 'offline'
    // @status: human-readable string e.g. 'on vacation'

    var fullJid = stanza.attr('from'),
        bareJid = Strophe.getBareJidFromJid(fullJid),
        show = stanza.attr('type') === 'unavailable' ? 'offline' : 'online',
        message = {
            from: bareJid,
            type: stanza.attr('type') || 'available',
            show: stanza.find('show').text() || show,
            status: stanza.find('status').text()
        };

    // Reset addressing
    // if online
    this.jids[bareJid] = bareJid;
    // else
    // this.jids[bareJid] = bareJid;

   console.log('onPresence: from fullJid: '+ fullJid);
   console.log('onPresence: bareJid: ' + bareJid);
   console.log('onPresnce: show: ' + show);	
	
    console.log('presence.client.im' + message);
    $.publish('presence.client.im', message);
    return true;
};

IM.Client.prototype._onMessage = function (stanza) {
    stanza = $(stanza);

    var fullJid = stanza.attr('from'),
        bareJid = Strophe.getBareJidFromJid(fullJid),
        body = stanza.find('body').text(),
        // TODO: fetch activity
        activity = 'active',
        message = {
            id: stanza.attr('id'),
            //from: fullJid,
	   from: bareJid,
            body: body,
            activity: activity
        };

    // Reset addressing
    this.jids[bareJid] = bareJid;  //fullJid;
    console.log('message.client.im' + message);
    $.publish('message.client.im', message);
    return true;
};

IM.Client.prototype._onRoster = function (stanza) {
    var message = this._handleRosterStanza(stanza);

    // Wrap message array again into an array,
    // otherwise jQuery will split it into separate arguments
    // when passed to 'bind' function
    console.log('roster.client.im' + [message]);
    $.publish('roster.client.im', [message]);
    return true;
};

IM.Client.prototype._onRosterChange = function (stanza) {
    var message = this._handleRosterStanza(stanza);
    console.log('rosterChange.client.im' + [message]);
    $.publish('rosterChange.client.im', [message]);
    return true;
};

IM.Client.prototype._handleRosterStanza = function (stanza) {
    var self = this,
        items = $(stanza).find('item');

    return items.map(function (index, item) {
        item = $(item);

        var fullJid = item.attr('jid'),
            bareJid = Strophe.getBareJidFromJid(fullJid);

        // Setup addressing
        self.jids[bareJid] = bareJid;

        return {
            jid: bareJid,
            subscription: item.attr('subscription')
        };
    }).get();
};

IM.Client.prototype._handleActivityStanza = function(stanza) {
    var activity = $(stanza).find('activity');
    return activity.map(function(index, item) {



    }).get();



};


// public properties and methods
IM.Client.prototype.connect = function () {
    this.connection.connect(this.jid, this.password, _.bind(this._onConnect, this));
    return this;
};

IM.Client.prototype.disconnect = function () {
    this.
    this.connection.flush();
    this.connection.disconnect();
    $.publish('disconnected.client.im');
};

IM.Client.prototype.send = function (stanza) {
    this.connection.send(stanza);
};

IM.Client.prototype.iq = function (stanza, error, success) {
    this.connection.sendIQ(stanza, success, error);
};

IM.Client.prototype.presence = function (status) {
    var stanza = $pres();
    if (status) {
        stanza.attrs({type: status});
    }
    this.send(stanza);
};

IM.Client.prototype.chat_message = function(to, thread_id, message) {
    //var fullJid = this.jids[to],
    var bareJid = Strophe.getBareJidFromJid(this.Jids[to]), 
        stanza = $msg({
            to: bareJid,
            type: 'chat'
            }).c('body').t(message)
            .c('thread').t(thread_id);
    this.send(stanza);
};

IM.Client.prototype.message = function (to, message) {
   // var fullJid = this.jids[to],
    var bareJid = Strophe.getBareJidFromJid(this.Jids[to]),     
	   stanza = $msg({
            to: bareJid,
            type: 'chat'
        }).c('body').t(message);
    this.send(stanza);
};

IM.Client.prototype.getRoster = function (error, success) {
    var stanza = $iq({type: 'get'}).c('query', {xmlns: Strophe.NS.ROSTER});
    this.iq(stanza, error, success);
};
