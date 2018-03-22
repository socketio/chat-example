var networks = {};

var networkHandler = {
    handleUser: function (userData) {
        userData.groups.forEach(function(network){
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
    list: function(userData) {
        return networks;
    }
};

module.exports = networkHandler;
