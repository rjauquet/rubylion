var Utility = {};
Utility.ajax = {
    get: function (url, callback){
        var request = new XMLHttpRequest(),
            self    = this;

        if ("withCredentials" in request) {

            request.open("GET", url, true);

            request.onload = function() {
                var responseText = request.responseText;

                if(callback){
                    callback(responseText);
                }
            };

            request.onerror = function() {
                console.log('There was an error!');
            };
            request.send(null);
        }
    }
};

module.exports = Utility;