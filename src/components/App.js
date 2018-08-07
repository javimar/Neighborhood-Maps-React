import React, { Component } from 'react'
import '../App.css'
import Map from './Map'
import ListPlaces from './ListPlaces'
import scriptLoader from 'react-async-script-loader'
import * as AUTH from '../data/auth'
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

            const infowindow = new window.google.maps.InfoWindow({
                maxWidth: 250
            })

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

        // Go and grab some restaurants from the API Foursquare
        this.fetchData();
    }

    fillInfoWindow = (marker, infowindow) =>
    {
        // ES6 destructuring
        const { places, markers, googleMap } = this.state

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

            let content =`<h3>${marker.name}</h3><h4>Restaurants around:</h4>`
            let index = marker.id
            let address

            for(let j = 0; j < places[index].venues.length; j++)
            {
                address = places[index].venues[j].location.address
                if(address === undefined)
                {
                    address = 'Not listed'
                }
                content = content + 
                        (`<p class="infow">${places[index].venues[j].name}.<br>`) +
                        (`Address: ${address}.<br>`) +
                        (`<span class="distance">Distance: ${places[index].venues[j].location.distance}m</span></p>`) 
            }
            infowindow.setContent(content)
            infowindow.open(googleMap, marker)

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


    handleMarkerDisplay = (query) => 
    {
        const { places, markers, infoWindow } = this.state
        
        if(query) 
        {
            places.forEach((currentlocation, i) => 
            {
                if (currentlocation.name.toLowerCase().includes(query.toLowerCase())) 
                {
                    markers[i].setVisible(true)
                } 
                else 
                {
                    if (infoWindow.marker === markers[i]) 
                    {
                        infoWindow.close()
                    }
                    markers[i].setVisible(false)
                }
            })
        } 
        else 
        {
            places.forEach((currentlocation, i) => 
            {
                markers[i].setVisible(true)
            })
        }        
    }


    fetchData = () => // Get data from the FOURSQUARE API
    {
        const { places } = this.state
        places.map((place) => // fill the venues of all my places

            fetch(`https://api.foursquare.com/v2/venues/search?` +
                `ll=${place.location.lat},${place.location.lng}` +
                `&intent=browse` +
                `&radius=700` +
                `&query=restaurant` +
                `&client_id=${AUTH.FSQ_CLI_ID}` +
                `&client_secret=${AUTH.FSQ_CLI_SEC}` +
                `&v=20180323`
                )
                .then(response => response.json())
                .then(data => 
                {
                  if (data.meta.code === 200) // request successful
                  {
                    place.venues = data.response.venues;
                  }
                }).catch(error => 
                {
                  console.log(error);
                }) 
        );
    }


    render()
    {
        const { places } = this.state

        return (
            <div className="container" role='main'>
                <header className="header">Alameda de Osuna Neighborhood</header>

                <aside className="aside filter-section">

                    <ListPlaces
                        places={ places }
                        onHandleLocationClick={ this.handleLocationClick }
                        onHandleMarkerDisplay={ this.handleMarkerDisplay }
                    />

                </aside>

                <Map />

                <footer className="footer">
                    <div>JaviMar 2018</div>
                    Restaurant data provided by <a target="_blank" href="https://developer.foursquare.com/">
                    Foursquare</a>
                </footer>

            </div>
            )
    }
} // End CLASS


// Loop through the markers array and display them
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


// Take a color and creates a new marker icon of that color
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
  [`https://maps.googleapis.com/maps/api/js?key=${AUTH.MAP_API_KEY}`]
)(App);
