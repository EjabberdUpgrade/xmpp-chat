var Chat = window.Chat = Ember.Application.create({
    connect: function (options) {
    	console.log("Options host:" + options.host + " port:" +options.port );
        Chat.Controllers.application.connect(options);
    },

    disconnect: function () {
        Chat.Controllers.application.disconnect();
    }
});

Chat.Models = {};
Chat.Controllers = {};
Chat.Views = {
    Roster: {},
    ChatTab: {}
};
