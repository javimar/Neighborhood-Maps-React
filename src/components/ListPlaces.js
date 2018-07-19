import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class ListPlaces extends Component
{
    state = // if state changes, render() will trigger
    {
        query: ''
    }

    updateQuery = (query) =>
    {
        this.setState({ query: query })
    }

    render()
    {
        const { places, markers } = this.props
        const { query } = this.state

        let showingPlaces
        if(query) // someone has typed in the input filter
        {
            // escape special chars if any, and 'i' means case independant
            const match = new RegExp(escapeRegExp(query.trim()), 'i')
            showingPlaces = places.filter((place) => match.test(place.name))

            /*
            let marks = markers.filter((place) => match.test(place.name))
            for (let x in marks)
            {
                marks[x].setMap(null);
            }
*/
        }
        else
        {
            showingPlaces = places
        }

        showingPlaces.sort(sortBy('name'))

        return (
            <div>
                <input
                    className="filter-text"
                    type="text"
                    placeholder="Filter places"
                    value={ query }
                    onChange={ (event) => this.updateQuery(event.target.value) }
                    role="search"
                    aria-labelledby="Search places"
                />
                <ul>
                    {
                        showingPlaces.map(function(place, index)
                        {

                            //if(place.name !== markers.name)
                            //    markers[markers.indexOf("name")].setMap(null)

                            return <li
                                className="places-list-items"
                                key={ index }>{ place.name }
                            </li>
                        }
                    )}
                </ul>
            </div>

        )
    }
}

export default ListPlaces
