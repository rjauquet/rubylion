var React         = require('react/addons'),
    Reflux        = require('reflux'),
    Actions       = require('./actions.js'),
    Utility       = require('./utility.js'),
    ajax          = Utility.ajax,
    LocationStore = require('./stores/LocationStore.js'),
    highlight     = require('highlight.js'),
    marked        = require('marked'),
    moment        = require('moment'),
    L             = require('leaflet');

    require('../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js')(window, document, undefined);

L.Icon.Default.imagePath = '../node_modules/leaflet/dist/images';

var Main = React.createClass({

    addMarkers: function(){
        var self = this;
        self.data = [];

        self.markers = new L.MarkerClusterGroup({
            disableClusteringAtZoom: 9,
            maxClusterRadius: 50
        });

        var addMarker = function (response){
            var file = JSON.parse(JSON.parse(response));
            console.log(file);
            for(var i=0; i<file.coordinates.length; i++){
                var marker = L.marker(
                    [file.coordinates[i][1], file.coordinates[i][0]],
                    { time: new moment(file.coordTimes[i]) }
                );
                self.markers.addLayer(
                    marker
                );
                self.data.push(marker);
            }
        };

        ajax.get("http://localhost:8080/data", function(response){

            var files = JSON.parse(response);

            for(var i=0; i<files.length; i++){
                console.log("http://localhost:8080/data/" + files[i]);
                ajax.get("http://localhost:8080/data/" + files[i], addMarker);
            }

            self.map.addLayer(self.markers);
        });
    },

    filterMarkersByDate: function(start, end){
        start = moment(start);
        end = moment(end);

        this.markers.clearLayers();

        for(var i=0; i<this.data.length; i++){
            var datetime = moment(this.data[i].options.time);
            if(moment(datetime).isBetween(start, end) || moment(datetime).isSame(start) || moment(datetime).isSame(end)){
                this.markers.addLayer(
                    this.data[i]
                );
            }
        }

    },

    componentDidMount: function() {
        var map = this.map = L.map(this.getDOMNode(), {
            minZoom: 2,
            maxZoom: 20,
            layers: [
                L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
            ],
            attributionControl: false,
        });

        this.addMarkers();

        //map.on('click', this.onMapClick);
        map.fitWorld();
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    shouldComponentUpdate: function (){
        //let leaflet handle updates to the map
        //return false;
    },
    onMapClick: function() {
        // Do some wonderful map things...
    },
    render: function() {
        return (
            <div className='map'></div>
        );
    }
});

var Text = React.createClass({
    getDefaultProps: function (){
        return {
            style: {
                width: 'auto',
                height: 'auto',
            }
        };
    },
    getInitialState: function (){

        var request = new XMLHttpRequest(),
            self    = this;

        if ("withCredentials" in request) {
            request.open("GET","http://localhost:8080/page/about.md", true);
            request.onload = function() {
                var responseText = request.responseText;

                self.setState({
                    markup: JSON.parse(responseText)
                });
            };

            request.onerror = function() {
                console.log('There was an error!');
            };
            request.send(null);
        }

        marked.setOptions({
            highlight: function (code) {
                return highlight.highlightAuto(code).value;
            },
            gfm: true,
            sanitize: true,
            breaks: true
        });

        return {
            markup: '## No pages yet'
        };
    },
    render: function() {
        var text = this.state.markup ? marked(this.state.markup, {sanitize: true}) : '';

        return (
            <div className="main" style={this.props.style}>
                <span dangerouslySetInnerHTML={{__html: text}} />
            </div>
        );
    }
});

React.render(<Main />, document.getElementById('content'));