import React from "react"
import Countryinfo from "./Countryinfo"

const Countrylist = ({countries, show}) => {

    if (countries.length >= 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
      }
    if (countries.length === 1) {
        return (<Countryinfo country={countries[0]}/>)
    }

    return (
        <ul>
            {countries.map(country => 
            <p key={country.cca3}>
                <li>{country.name.common}</li><button onClick={()=>show(country)}>show</button>
            </p>
            )}
        </ul>
    )
}

export default Countrylist;