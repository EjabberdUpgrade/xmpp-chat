;
(function (environment) {
  var fs;
  try {
     fs = require("graceful-fs");
  } catch (error) {
     fs = require("fs")
  };
  try {
    var configSource = {};
    var config = {};
    var config_file = '';
    console.log("Current dir:" + __dirname);
    switch(process.env.Environment)
    {
	case "dev":
		config_file = "dev_config.json"; break;
	case "stage":
		config_file = "stage_config.json"; break;
	case "preprod":
		config_file = "preprod_config.json"; break;
	case "prod":
		config_file = "prod_config.json"; break;
	default:
		throw new "Unknown environment value!!!!!!!!!!!!!!!!";

    };     
    console.log("Reading "+ config_file);
    configSource = path.join(__dirname, config_file);
    console.log("Found config file at "+ configSource);
    config = ALCE.parse(confSource, {meta: true});
  } catch (err) {
     var errorMsg = "Error reading config. Environment: " + process.env.Environment;
     console.log(errorMsg);
     throw new Error(errorMsg)
  };
  var Constructor = (function(configVal) {
	this.ejab_config = (function(error, configJson) {
    		if(error) {
      			console.log("Error reading config %d", error);		
      			throw new Error("config read error abort!")	
    		};    
    		var Host =  configJson.get('ejabberd').get('host');
    		var Port =  configJson.get('ejabberd').get('port');
    		return JSON.stringify({ target: {
			host: Host,
			port: Port}})
		})(configVal);
  	this.log_config = (function(error, configJson) {
		if(error) {
		     console.log("Error reading config %d", error);		
		     throw new Error("config read error abort!")	
		};
		log4jConf = configJson.get('log4j');
		log4js.configure(JSON.stringify(log4jConf))
                })(configVal);	
  return new Constructor(config);})(config);
})();


