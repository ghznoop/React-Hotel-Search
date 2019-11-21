import React, { Component } from 'react';

import SearchForm from './SearchForm';
import GeocodeResult from './GeocodeResult';
import Map from './Map';
import HotelsTable from './HotelsTable';

import { geocode } from '../domain/Geocoder';
import { searchHotelByLocation } from '../domain/HotelRepository';

const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: 35.6585805,
        lng: 139.7454329,
      },
      hotels: [
        { id: 111, name: 'Apa hotel', url: 'https://google.com' },
        { id: 222, name: 'Hyatt', url: 'https://google.com' },
      ],
    };
  }

  setErrorMessage(message) {
    this.setState({
      address: message,
      location: {
        lat: 0,
        lng: 0,
      },
    });
  }

  handlePlaceSubmit(place) {
    geocode(place)
      .then(({ status, address, location }) => {
        switch (status) {
          case 'OK': {
            this.setState({ address, location });
            return searchHotelByLocation(location);
          }
          case 'ZERO_RESULTS': {
            this.setErrorMessage('Oops, There are no results!');
            break;
          }
          default: {
            this.setErrorMessage('Error happend');
          }
        }
        return [];
      })
      .then((hotels) => {
        this.setState({ hotels });
      })
      .catch(() => {
        this.setErrorMessage('Failed to connect');
      });
  }

  render() {
    return (
      <div className="app">
        <h1 className="app__title">Hotel Search</h1>
        <SearchForm onSubmit={place => this.handlePlaceSubmit(place)} />
        <div className="app__result">
          <Map location={this.state.location} />
          <div className="result-right">
            <GeocodeResult
              address={this.state.address}
              location={this.state.location}
            />
            <h2>Hotel Search Result</h2>
            <HotelsTable hotels={this.state.hotels} />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
