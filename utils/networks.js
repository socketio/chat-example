var networks = {};
var members = [];

var networkHandler = {
    handleUser: function (userData, networks) {
        networks.forEach(function(network){
            networkHandler.join(userData, network);
        });
    },
    join: function (userData, network) {
        if (typeof networks['id'] == 'undefined') {
            networks[networks.id] = network;
        }
        members.push(userData);
    },
};

module.exports = networkHandler;
