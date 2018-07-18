import React, { Component } from 'react'
import { places } from '../data/places';

class ListPlaces extends Component
{
    render()
    {
        return (
            <ul>
                { places.map(function(place, index)
                    {
                        return <li className="" key={ index }>{ place.name }</li>;
                    }
                )}
            </ul>
        )
    }
}

export default ListPlaces
