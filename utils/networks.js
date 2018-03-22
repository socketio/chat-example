var networks = {};

var networkHandler = {
    handleUser: function (userData, networks) {
        networks.forEach(function(network){
            networkHandler.join(userData, network);
        });
    },
    join: function (userData, network) {
        if (typeof networks['id'] == 'undefined') {
            network.members = [];
            networks[networks.id] = network;
        }
        network.members.push(userData);
    },
    list: function() {
        return networks;
    }
};

module.exports = networkHandler;
