import React, { Component } from 'react'


class SearchBar extends Component
{

    render()
    {
        return (
            <div>
                <input id="filter-text" type="text" placeholder="Filter places" />
            </div>
        )
    }

}

export default SearchBar
