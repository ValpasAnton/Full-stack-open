import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Filter from './components/Filter'
import Countrylist from './components/Countrylist';
import Countryinfo from './components/Countryinfo';


const App = () => {
  const [search, setSearch] = useState('')
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const source = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  useEffect(() => {
    axios.get(source)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const onShow = (country) => {
    setSelectedCountry(country)
  }
  const onBack = () => {
    setSelectedCountry(null)
  }
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <Filter search={search} handleSearchChange={handleSearchChange}/>
      {selectedCountry
        ? <Countryinfo country={selectedCountry} back={onBack} />
        : <Countrylist countries={filteredCountries} show={onShow} />
      }
    </div>
  )
}

export default App;