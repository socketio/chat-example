module.exports = {
    rooms: {
        "all": {
            "nbMembers": 0,
            "msgs": []
        }
    },
    getDefaultRoom: function() {
        return "all";
    },
    join: function(room) {
        if (typeof this.rooms[room] == 'undefined') {
            this.create(room);
        }
        this.rooms[room].nbMembers++;
    },
    leave: function(room) {
        if (typeof this.rooms[room] == 'undefined') {
            return;
        }
        this.rooms[room].nbMembers--;
    },
    create: function(room) {
        this.rooms[room] = {
            "nbMembers": 0,
            "msgs": []
        };
    },
    write: function(msg) {
        this.rooms[msg.room].msgs.push(msg);
    },
    read: function(room) {
        return this.rooms[room].msgs;
    }
};
