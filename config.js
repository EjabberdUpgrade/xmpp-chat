;
(function (environment) {
  var fs = {};
  var Env = process.env.Environment || 'undefined';
  var ejabConfig = 
	{ "ejabConfig": [  
	  {host: 'undefined'},
	  {port: 'undefined'}
	  ]
	};
  
  var log4jConfig = 
	{   "appenders": [
      	     {
          	 type: "console",
                 category: "console"
             },
             {
          	 "type": "file",
         	 "filename": "tmp-test.log",
          	 "maxLogSize": 1024,
            	 "backups": 3,
          	 "category": "test"
      	     }]
  	};
 
  var sparkApi = 
	{ "sparkApi": [ 
	     {spark_api_endpoint: 'undefined'},
             {spark_app_id: 'undefined'},
             {spark_brand_id: 'undefined'},
             {spark_client_secret: 'undefined'},
             {spark_create_oauth_accesstoken: '/brandId/{brandId}/oauth2/accesstoken/application/{applicationId}'},
             {auth_profile_miniProfile: '/brandId/{brandId}/profile/attributeset/miniProfile/{targetMemberId}'},
             {profile_memberstatus: '/brandId/{brandId}/application/{applicationId}/member/{memberId}/status'}
	  ]
	};
   var community2brandId =
	{"communityBrandIdMap": [
	        {
	            name: 'spark',
	            communityId: '1',
	            brandId: '1001'
	        },
	        {
	            name: 'jdate',
	            communityId: '3',
	            brandId: '1003'
	        },
	        {
	            name: 'cupid',
	            communityId: '10',
	            brandId: '1015'
	        },
	        {
	            name: 'bbw',
	            communityId: '23',
	            brandId: '90410'
	        },
	        {
	            name: 'blacksingle',
	            communityId: '24',
	            brandId: '90510'
	        }
	   ]
	};  

  try {
     fs = require('graceful-fs');
  } catch (error) {
     fs = require('fs')
  };
  try {
    var configSource = {};
    var config = {};
    var config_file = '';
    console.log('Current dir:' + __dirname);
    switch(Env)
    {
	case 'dev':
		ejabConfig.host = 'chat64.ejabberddev.localdomain';
		ejabConfig.port = 5280;  
        	sparkApi.spark_api_endpoint = 'http://api.stgv3.spark.net/v2';
        	sparkApi.spark_app_id =  '1054';
        	sparkApi.spark_brand_id = '90510';
        	sparkApi.spark_client_secret = 'nZGVVfj8dfaBPKsx_dmcRXQml8o5N-iivf5lBkrAmLQ1';		
		break;
	case 'stage':
		ejabConfig.host = 'chat.stgv3.spark.net';
		ejabConfig.port = 5280;  
        	sparkApi.spark_api_endpoint = 'http://api.stgv3.spark.net/v2';
        	sparkApi.spark_app_id = '1054';
        	sparkApi.spark_brand_id = '90510';
        	sparkApi.spark_client_secret = 'nZGVVfj8dfaBPKsx_dmcRXQml8o5N-iivf5lBkrAmLQ1';			
		break;
	case 'preprod':
		ejabConfig.host = 'chat.stgv3.spark.net';
		ejabConfig.port = 5280;  
        	sparkApi.spark_api_endpoint = 'http://api.stgv3.spark.net/v2';
        	sparkApi.spark_app_id = '1054';
        	sparkApi.spark_brand_id = '90510';
        	sparkApi.spark_client_secret = 'nZGVVfj8dfaBPKsx_dmcRXQml8o5N-iivf5lBkrAmLQ1';	
		break;
	case 'prod':
		ejabConfig.host = 'chat.stgv3.spark.net';
		ejabConfig.port = 5280;  
        	sparkApi.spark_api_endpoint = 'undefined';
        	sparkApi.spark_app_id = 'undefined';
        	sparkApi.spark_brand_id = 'undefined';
        	sparkApi.spark_client_secret = 'undefined';
		break;

	default:
		throw new 'Unknown environment value!!!!!!!!!!!!!!!!';
    };     
    console.log(Env + ': Ejabberd Host: ' + ejabConfig.host);
    console.log(Env + ': Ejabberd Port: ' + ejabConfig.port);
    console.log(Env + ': Api Endpoint: ' + sparkApi.spark_api_endpoint);
    console.log(Env + ': AppId: ' + sparkApi.spark_app_id);
    console.log(Env + ': BrandId: ' + sparkApi.spark_brand_id);
    console.log(Env + ': Client Secret:' +sparkApi.spark_client_secret);
  } catch (error) {
     var errorMsg = 'Error reading config. Environment: ' + process.env.Environment;
     console.log(errorMsg);
     throw new Error(errorMsg)
  };
  var Constructor = (function() {
	this.ejab_config = (function(error, configJson) {
    		if(error) {
      			console.log('Error reading config %d', error);		
      			throw new Error('config read error abort!')	
    		};    
    		var Host =  configJson.get('ejabberd').get('host');
    		var Port =  configJson.get('ejabberd').get('port');
    		return JSON.stringify({ target: {
			host: Host,
			port: Port}})
		})(configVal);
  	this.log_config = (function(error, configJson) {
		if(error) {
		     console.log('Error reading config %d', error);		
		     throw new Error('config read error abort!')	
		};
		log4jConf = configJson.get('log4j');
		log4js.configure(JSON.stringify(log4jConf))
                })();	
  return new Constructor();})();
})();


