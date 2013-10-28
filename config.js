;
(function (environment) {
  var fs = {};
  var Env = process.env.Environment || 'undefined';
  var ejabConfig = { 
	host: '';
   	port: ''; };

  var sparkApi: {
        spark_api_endpoint: '',
        spark_app_id: '',
        spark_brand_id: '',
        spark_client_secret: '',
        spark_create_oauth_accesstoken: '/brandId/{brandId}/oauth2/accesstoken/application/{applicationId}',
        auth_profile_miniProfile: '/brandId/{brandId}/profile/attributeset/miniProfile/{targetMemberId}',
        profile_memberstatus: '/brandId/{brandId}/application/{applicationId}/member/{memberId}/status'
    },
   var community2brandId: [
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
        	sparkApi.spark_api_endpoint = 'http://api.stgv3.spark.net/v2',
        	sparkApi.spark_app_id =  '1054',
        	sparkApi.spark_brand_id = '90510',
        	sparkApi.spark_client_secret = 'nZGVVfj8dfaBPKsx_dmcRXQml8o5N-iivf5lBkrAmLQ1'		
		break;
	case 'stage':
        	sparkApi.spark_api_endpoint = 'http://api.stgv3.spark.net/v2',
        	sparkApi.spark_app_id = '1054',
        	sparkApi.spark_brand_id = '90510',
        	sparkApi.spark_client_secret = 'nZGVVfj8dfaBPKsx_dmcRXQml8o5N-iivf5lBkrAmLQ1'			
		
	case 'preprod':
        	sparkApi.spark_api_endpoint = 'http://api.stgv3.spark.net/v2',
        	sparkApi.spark_app_id = '1054',
        	sparkApi.spark_brand_id = '90510',
        	sparkApi.spark_client_secret = 'nZGVVfj8dfaBPKsx_dmcRXQml8o5N-iivf5lBkrAmLQ1'	

	case 'prod':
        	sparkApi.spark_api_endpoint = 'undefined',
        	sparkApi.spark_app_id = 'undefined',
        	sparkApi.spark_brand_id = 'undefined',
        	sparkApi.spark_client_secret = 'undefined',

	default:
        	sparkApi.spark_api_endpoint = 'undefined',
        	sparkApi.spark_app_id = 'undefined',
        	sparkApi.spark_brand_id = 'undefined',
        	sparkApi.spark_client_secret = 'undefined',
		throw new 'Unknown environment value!!!!!!!!!!!!!!!!';

    };     
    console.log('Api Environment '+ );
    console.log('Api Endpoint' + sparkApi.spark_api_endpoint = 'undefined',
    console.log('' + sparkApi.spark_app_id = 'undefined',
    console.log('' + sparkApi.spark_brand_id = 'undefined',
    console.log('' +sparkApi.spark_client_secret = 'undefined',
  } catch (error) {
     var errorMsg = 'Error reading config. Environment: ' + process.env.Environment;
     console.log(errorMsg);
     throw new Error(errorMsg)
  };
  var Host = 
  var Port = 
  var Constructor = (function(configVal) {
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
                })(configVal);	
  return new Constructor(config);})(config);
})();


