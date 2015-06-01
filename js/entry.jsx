var React         = require('react/addons'),
    Reflux        = require('reflux'),
    Actions       = require('./actions.js'),
    LocationStore = require('./stores/locationStore.js'),
    highlight     = require('highlight.js'),
    marked        = require('marked'),
    moment        = require('moment'),
    L             = require('leaflet');

require('../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js')(window, document, undefined);
require('../node_modules/Leaflet.AnimatedMarker/src/AnimatedMarker.js')(window, document, undefined);
L.Icon.Default.imagePath = '../node_modules/leaflet/dist/images';

var Main = React.createClass({

    mixins: [Reflux.listenToMany({
        setMarkersFromStore: LocationStore,
    })],

    setMarkersFromStore: function(store){

        this.markers.clearLayers();
        if(this.polyline){
            this.map.removeLayer(this.polyline);
        }

        if(!store.locations.length){
            return;
        }

        var line = [];

        for (var i = store.locations.length - 1; i >= 0; i--) {
            this.markers.addLayer(
                L.marker(
                    [store.locations[i].lng, store.locations[i].lat],
                    { datetime: store.locations[i].datetime }
                )
            );
            line.push(L.latLng(store.locations[i].lng, store.locations[i].lat));
        }
        var polyline_options = {
            color: '#000',
            smoothFactor: 1,
            weight: 7
          };

        this.polyline = L.polyline(line, polyline_options).addTo(this.map);
        var animatedMarker = L.animatedMarker(this.polyline.getLatLngs(),{
            distance: 1000,  // meters
            interval: 100, // milliseconds
        });

        this.map.addLayer(animatedMarker);

        this.map.fitBounds(this.markers.getBounds());

        console.log(store.locations);
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
        this.markers = new L.MarkerClusterGroup({
            //disableClusteringAtZoom: 12,
            //animateAddingMarkers: true,
            singleMarkerMode: true,
            maxClusterRadius: 30
        });
        this.map.fitWorld();
        map.addLayer(this.markers);

        Actions.fetchLocationData();
        window.filterbydate = Actions.filterLocationsByDate;
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