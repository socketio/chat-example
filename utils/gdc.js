const gdc = require(__dirname+'/../config/gdc_app.js');
const request = require('request');
const uuidv4 = require('uuid/v4');

module.exports = {
    getRedirectUrl: function() {
        return 'https://gensdeconfiance.fr/oauth/v2/auth?client_id='+gdc.client_id+'&response_type=code&redirect_uri='+encodeURIComponent(gdc.callback_url)+'&scope=profile%20groups%20friends';
    },
    getToken: function(oauthCode, res, callback) {
        var gdcUrl = 'https://gensdeconfiance.fr/oauth/v2/token?grant_type=authorization_code&redirect_uri=';
        gdcUrl += encodeURIComponent(gdc.callback_url)+'&client_id='+gdc.client_id;
        gdcUrl += '&client_secret='+gdc.client_secret;
        gdcUrl += '&code='+oauthCode;
        request(gdcUrl, function (error, response, body) {
            var userData = JSON.parse(body);
            request('https://gensdeconfiance.fr/api/v2/members/me', {'headers': {
                'Authorization': 'Bearer '+ userData.access_token,
            }}, function(error, response, body){
                var userData = JSON.parse(body);
                userData.uuid = uuidv4();;
                callback(res, JSON.parse(body));
            })
        });
    }
};
