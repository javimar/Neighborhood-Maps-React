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
        this.props.onHandleMarkerDisplay(query.trim())
    }


    render()
    {
        const { places, onHandleLocationClick } = this.props
        const { query } = this.state

        let showingPlaces
        if(query) // someone has typed in the input filter
        {
            // escape special chars if any, 'i' means case independant
            const match = new RegExp(escapeRegExp(query.trim()), 'i')
            showingPlaces = places.filter((place) => match.test(place.name))
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
                        showingPlaces.map((place, index) =>
                            <li 
                                className="places-list-items"
                                tabIndex='0'
                                onClick={ (event) => onHandleLocationClick(index) } 
                                key={ index }>{ place.name }
                            </li>)
                    }
                </ul>
            </div>

        )
    }
}

export default ListPlaces
