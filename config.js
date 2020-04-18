const env = process.env.NODE_ENV || 'development'

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
	development :{
		APIKey : 'EvvJFmHVRbemTCpnHDCVAQ',
		APISecret : 'oNJecNAzYt6mt574zX9TqOsNdsA2j6xgWx2B'
	},
	production:{	
		APIKey : 'EvvJFmHVRbemTCpnHDCVAQ',
		APISecret : 'oNJecNAzYt6mt574zX9TqOsNdsA2j6xgWx2B'
	}
};

module.exports = config[env]
