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
        this.setState({query: query.trim()})
    }


    render()
    {
        const { places } = this.props
        const { query } = this.state

        let showingPlaces
        if(query) // someone has typed in the input filter
        {
            // escape special chars if any, and 'i' means case independant
            const match = new RegExp(escapeRegExp(query), 'i')
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
                />
                <ul>
                    {
                        showingPlaces.map(function(place, index)
                        {
                            return <li className="places-list-items" key={ index }>{ place.name }</li>;
                        }
                    )}
                </ul>
            </div>

        )
    }
}

export default ListPlaces
