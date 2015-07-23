/* app.js */
/* We will need Unirest to obtain HTTPS data. */ 
var unirest = require('unirest');
var fs = require('fs');
var TOKEN = "" /* !!! SET THIS !!! Here goes your token, as received from the botfather. */
var BASE_URL = "https://api.telegram.org/bot"+ TOKEN + "/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=15"; /* Set your timeout here, if your connection is slow or if you are experiencing issues. Measured in seconds. */
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";
var offset = "200";
var file = "message.txt" /* Write your output file here. */
console.log('variables have been set up');
poll(100);
function poll(offset) {
        var url = POLLING_URL.replace(":offset:", offset);
        console.log('requesting messages');
        unirest.get(url).end(function(response) {
                var body = response.raw_body;
                if (response.status == 200) {
                        console.log('response was 200 OK');
                        var jsonData = JSON.parse(body);
                        console.log('writing to file');
						var output = JSON.stringify(jsonData)
						if (output == '{"ok":true,"result":[]}'){
							/* Do nothing, the result is fully blank, we dont want our file spammed */
							console.log('no result, not writing')
						} else {
							/* Result != blank, write it to a text file */
							console.log('writing to file')
							fs.appendFile(file, output+"\n", function (err) {});
						}
                        var result = jsonData.result;
                        if(result.length == 0) {
								console.log('result.length is 0, polling again')
                                poll(offset);
                        } else {
								console.log('result.length is NOT 0, polling again')
                                max_offset = parseInt(result[result.length - 1].update_id) + 1;    
                                poll(max_offset);
                        };
                };
        });
};