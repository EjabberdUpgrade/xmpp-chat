;
'use strict';
var util = require('util');
var Workspace = module.exports = function() {
  var fs = {};
  var Env = process.env.NODE_ENV || 'undefined';
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
 
  var sparkApi = {
	
	 log4j: [
		{"appenders": [
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
          }],
          
	 restApi: [ 
	     {spark_api_endpoint: 'undefined'},
             {spark_app_id: 'undefined'},
             {spark_brand_id: 'undefined'},
             {spark_client_secret: 'undefined'},
             {spark_create_oauth_accesstoken: '/brandId/{brandId}/oauth2/accesstoken/application/{applicationId}'},
             {auth_profile_miniProfile: '/brandId/{brandId}/profile/attributeset/miniProfile/{targetMemberId}'},
             {profile_memberstatus: '/brandId/{brandId}/application/{applicationId}/member/{memberId}/status'},
	  
             {communityBrandIdMap: [
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
           }
	] 
  };
  try {
     fs = require('graceful-fs');
  } catch (error) {
     fs = require('fs')
  };
  try {

    util.puts('Configuration file is reading from dir:' + __dirname);
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
    util.puts(Env + ': Ejabberd Host: ' + ejabConfig.host);
    util.puts(Env + ': Ejabberd Port: ' + ejabConfig.port);
    util.puts(Env + ': Api Endpoint: ' + sparkApi.spark_api_endpoint);
    util.puts(Env + ': AppId: ' + sparkApi.spark_app_id);
    util.puts(Env + ': BrandId: ' + sparkApi.spark_brand_id);
    util.puts(Env + ': Client Secret:' +sparkApi.spark_client_secret);
  } catch (error) {
     var errorMsg = 'Error reading config. Environment: ' + process.env.NODE_ENV;
     util.puts(errorMsg);
     throw new Error(errorMsg)
  };

  process.env.EjabHost = ejabConfig.host;
  process.env.EjabPort = ejabConfig.port;
  //return JSON.stringify(sparkApi);  
  return sparkApi;  
};

(function() {
   this.init = function(){};
}).call(Workspace.prototype);
