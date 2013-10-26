;{   log4j: {
  	"appenders": [
        {
            type: "console"
          , category: "console"
        },
        {
            "type": "file",
            "filename": "tmp-test.log",
            "maxLogSize": 1024,
            "backups": 3,
            "category": "xmpp-chat"
        }
      ]
   }
};
