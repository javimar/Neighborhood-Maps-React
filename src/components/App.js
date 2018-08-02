import React, { Component } from 'react'
import '../App.css'
import Map from './Map'
import ListPlaces from './ListPlaces'
import scriptLoader from 'react-async-script-loader'
import { MAP_API_KEY } from '../data/auth'
import { places } from '../data/places'

let createdMap = {}
let filterMarkers = []
let infoWindows = []

class App extends Component
{
    state =
    {
        googleMap: {},
        places: places,
        markers: [],
        infoWindow: []
    }

    // Load the Google MAP
    componentWillReceiveProps()
    {
        createdMap = new window.google.maps.Map(document.getElementById('map'),
        {
            center: { lat: 40.455606, lng: -3.588177 },
            zoom: 15
        });

        let defaultIcon = makeMarkerIcon('0091ff');
        let highlightedIcon = makeMarkerIcon('ffff24');

        // Create an array of markers
        for(let i = 0; i < places.length; i++)
        {
            // Get the position from the location array.
            let position = places[i].location;
            let name = places[i].name;
            const marker = new window.google.maps.Marker(
            {
                position: position,
                name: name,
                animation: window.google.maps.Animation.DROP,
                id: i
            });

            const infowindow = new window.google.maps.InfoWindow()

            marker.addListener('click', () =>
            {
                this.fillInfoWindow(marker, infowindow)
            })

            marker.addListener('mouseover', function()
            {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function()
            {
                this.setIcon(defaultIcon);
            });

            showPlaces();

            filterMarkers.push(marker)
            infoWindows.push(infowindow)
        }

        this.setState({
            googleMap: createdMap,
            markers: filterMarkers,
            infoWindow: infoWindows
        })
    }

    fillInfoWindow = (marker, infowindow) =>
    {
        // ES6 destructuring
        const { markers } = this.state

        // Check for infowindow open
        if (infowindow.marker !== marker) 
        {
            if (infowindow.marker) 
            {
                const ind = markers.findIndex(m => m.title === infowindow.marker.title)
                markers[ind].setIcon(makeMarkerIcon('ffffff'))
            }
          
            marker.setIcon(makeMarkerIcon('d77ee7'))
            infowindow.marker = marker
            infowindow.setContent(`<h3>${marker.name}</h3><h4>ha hecho clic</h4>`)
            infowindow.open(this.map, marker)

            infowindow.addListener('closeclick', () =>
            {
                infowindow.marker = null
            })
        }        
    }


    handleLocationClick = (index) => 
    {
        const {markers, infoWindow } = this.state
        const markerIndex = markers.findIndex(m => m.id === index)
        this.fillInfoWindow(markers[markerIndex], infoWindow[markerIndex])
    }


    render()
    {
        const { markers, places, infoWindow } = this.state

        return (
            <div className="container" role='main'>
                <header className="header">Alameda de Osuna Neighborhood</header>

                <aside className="aside filter-section">

                    <ListPlaces
                        places={ places }
                        onHandleLocationClick={ this.handleLocationClick }
                    />

                </aside>

                <Map />

                <footer className="footer">JaviMar 2018</footer>

            </div>
            )
    }
} // End CLASS


// This function will loop through the markers array and display them all.
function showPlaces()
{
    let bounds = new window.google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for(let i = 0; i < filterMarkers.length; i++)
    {
        filterMarkers[i].setMap(createdMap);
        bounds.extend(filterMarkers[i].position);
    }
    createdMap.fitBounds(bounds);
}

// This function will loop through the places and hide them all.
function hidePlaces()
{
    for(let i = 0; i < filterMarkers.length; i++)
    {
        filterMarkers[i].setMap(null);
    }
}


// Take a color and creates a new marker icon of that colorº
function makeMarkerIcon(markerColor)
{
    let markerImage = new window.google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
         '|40|_|%E2%80%A2',
         new window.google.maps.Size(21, 34),
         new window.google.maps.Point(0, 0),
         new window.google.maps.Point(10, 34),
         new window.google.maps.Size(21,34));
    return markerImage;
}

// Load Google Maps asynchronously using React Script Loader
export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`]
)(App);
