var Reflux  = require('reflux'),
    Actions = require('../actions.js'),
    Utility = require('../utility.js'),
    ajax    = Utility.ajax,
    moment  = require('moment');

var LocationStore = Reflux.createStore({

    listenables: Actions,

    init: function (){
        this.data = [];
        this.store = {
            locations: []
        };
    },

    setDefaults: function(args){
        this.data = args.data ? args.data:this.data;
    },

    updateLocations: function (store){
        this.store.locations = (store.locations.length) ? store.locations : this.store.locations;
        this.sortLocationsByDatetime();
        this.trigger(this.store);
    },

    sortLocationsByDatetime: function(){
        var locations = this.store.locations;
        console.log('sorting', locations.length, 'elements');
        locations.sort(function compare(a, b) {
            //a is less than b by some ordering criterion
            if (moment(a.datetime).isBefore(b.datetime)) {
                return 1;
            }
            //a is greater than b by the ordering criterion
            if (moment(a.datetime).isAfter(b.datetime)) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
    },

    onFilterLocationsByDate: function (start, end) {
        var locations = [];
        start = moment(start);
        end = moment(end);

        for(var i=0; i<this.data.length; i++){
            var datetime = moment(this.data[i].datetime);
            if(moment(datetime).isBetween(start, end) || moment(datetime).isSame(start) || moment(datetime).isSame(end)){
                locations.push(this.data[i]);
            }
        }

        this.updateLocations({locations: locations});
    },

    onFetchLocationData: function (){
        var self = this;
        var addDataFile = function (response){
            //not sure why it's double
            var file = JSON.parse(JSON.parse(response));

            for(var i=0; i<file.coordinates.length; i++){
                self.data.push({
                    lng: file.coordinates[i][1],
                    lat: file.coordinates[i][0],
                    datetime: new moment(file.coordTimes[i])
                });
            }
        };

        ajax.get("http://localhost:8080/data", function(response){
            var files = JSON.parse(response);
            for(var i=0; i<files.length; i++){
                ajax.get("http://localhost:8080/data/" + files[i], addDataFile);
            }
        });
    },
});

module.exports = LocationStore;