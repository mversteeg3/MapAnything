import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { AutocompleteList } from './components/AutocompleteList'
import { sendPlacesQuery, lookupLocation } from './utilities/Networking.js'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { getCurrentLocation } from './utilities/Location.js'
const TestFairy = require('react-native-testfairy');

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const DEFAULT_LATITUDE = 37.78825;
const DEFAULT_LONGITUDE = -122.4324;
const DEFAULT_LATITUDE_DELTA = 0.0922;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LATITUDE_DELTA * ASPECT_RATIO,
      },
      markers: [],
      query: props.text,
      locations: props.data,
      loading: props.loading,
    };
  }

  componentWillMount() {
    TestFairy.begin("d86c94cfe40e335f07f97595bad864801c757522");
 }

  componentDidMount() {
    return getCurrentLocation().then(position => {
      if (position) {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          },
        });
      }
    }).catch(function (err) {
      Toast.show("Something went wrong, please try again later")
    });
  }

  gotLocationDetails(details) {
    oldMarkers = this.state.markers
    newLoc = details.geometry.location
    vp = details.geometry.viewport
    TestFairy.log("Got a location")
    latDelta = Math.abs(vp.northeast.lat - vp.southwest.lat)
    this.state.markers.push(details)
    this.setState({
      query: "",
      locations: [],
      loading: false,
      region: {
        latitude: newLoc.lat,
        longitude: newLoc.lng,
        latitudeDelta: latDelta,
        longitudeDelta: latDelta * ASPECT_RATIO
      }
    });
  }

  onSelectLocation = (location) => {
    var self = this
    lookupLocation(location.place_id).then(function (details) {
      self.gotLocationDetails(details)
    }).catch(function (err) {
      Toast.show("Something went wrong, please try again later")
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.mapRef = ref }}
          provider={this.props.provider}
          style={styles.map}
          showsUserLocation={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          region={this.state.region}>

          {this.state.markers.map(marker => (
            <Marker
              title={marker.name}
              key={marker.place_id}
              coordinate={{ latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng }}
            />
          ))}

        </MapView>
        <View style={styles.searchBarContainer}>
          <AutocompleteList
            enabled={this.connected}
            onSelectLocation={this.onSelectLocation}
            threshold='3'
            style={styles.searchBar} />
        </View>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'orange',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch'
  },
  searchBar: {
    flex: 1
  },
  searchBarContainer: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  barPadding: {
    flex: 1,
    backgroundColor: 'red'
  },
  list: {
    height: 0
  }
});
