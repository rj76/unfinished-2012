define(function() {
    var Events = function() {
        var allEvents = [];
        var eventTable = {};

        this.add = function(event) {
            allEvents.push(event);
        };

        this.clear = function() {
            for (var k in eventTable) {
                // use hasOwnProperty to filter out keys from the Object.prototype
                if (eventTable.hasOwnProperty(k)) {
                    clearTimeout(eventTable[k].tid);
                }
            }
        };

        this.run = function() {
            // Installing event handlers
            for (var i=0;i<allEvents.length;i++) {
                var event = allEvents[i];
                if (!eventTable[event.name]) eventTable[event.name] = {tid: false};
                eventTable[event.name].event = event;
                if (!eventTable[event.name].tid) {
                    eventTable[event.name].tid = setTimeout(event.action, 1000*event.start);
                    console.log('adding '+event.name+', with action: '+event.action);
                }
            }

            console.log(eventTable);
        };

        this.setTimer = function(name) {
            if (name.indexOf('start') == -1) {
                eventTable[name].tid = setTimeout(function() { fireEvent(eventTable[name].event) }, 1000*eventTable[name].event.step);
            }
        };

        function fireEvent(event) {
            if (event.log == true) {
               console.log('firing: '+event.name);
            }
            event.action();
        }
    };

    return Events;
});
