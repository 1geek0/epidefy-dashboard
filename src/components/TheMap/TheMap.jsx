import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  // width: '300px',
  // marginBottom: '200px'
  // height: '100%',
};


class TheMap extends Component {
	render() {
		return (
			<div>
				<Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        />
			</div>
		)
	}
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCpNV97PE8xtDMPme8yg0E6u-Roqos7Kqc'
})(TheMap);
