import React from 'react';
import Toast from 'react-native-simple-toast';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, TextInput, FlatList, NetInfo, ActivityIndicator } from 'react-native';
import { sendPlacesQuery } from '../utilities/Networking.js'


export class AutocompleteItem extends React.PureComponent {

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={styles.flatview}>
            {this.props.item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class AutocompleteList extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      text: ''
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        this.setState({ connected: isConnected });
      }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ connected: isConnected });
    // console.log(`is connected: ${this.state.status}`);
  }

  onChange = (text) => {
    var self = this
    if (this.state.connected) {
      return sendPlacesQuery(text).then(function (val) {
        self.setState({ data: val, loading: false, focused: true})
        
      }).catch(function (err) {
        console.error(err)
      });
    } else {
      Toast.show('No internet connection!  Please connect to a network to search locations');
    }
  };

  _onSelectLoc = (location) => {
    if (this.state.connected) {
      this.props.onSelectLocation(location)
      this.setState({ data: [], loading: false, text: '', focused: false })

    } else {
      Toast.show('No internet connection!  Please connect to a network to search locations');
    }
  }

  render() {
    console.log(this.state.data)
    if ((this.state.data.length == 0 || this.state.loading) && this.state.connected) {
      return (
        <View style={styles.mainContainer}>
          <View style={styles.barPadding} pointerEvents="none"/>
          <View style={[styles.autocompleteContainer, styles.autocompleteContainer_WithoutList]}>
            <TextInput
              ref={(input) => { this.inputText = input; }}
              style={styles.input}
              autoFocus={this.state.focused}
              placeholder="Search for a location"
              onChangeText={(text) => {
                if (text.length >= this.props.threshold) {
                  this.setState({ loading: true, text: text, data: [] });
                  this.onChange(text)
                } else {
                  this.setState({ loading: false, text: text, data: [] });
                }
              }
              }
              value={this.state.text} />
            <ActivityIndicator animating={this.state.loading} style={styles.spinner} />
          </View>
          <View style={styles.barPadding} pointerEvents="none"/>
        </View>
      );
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.barPadding} pointerEvents="none"/>
        <View style={styles.listAndBarContainer}>
          <View style={[styles.autocompleteContainer, styles.autocompleteContainer_WithList]}>
            <TextInput
              ref={(input) => { this.inputText = input; }}
              style={styles.input}
              autoFocus={this.state.focused}
              placeholder="Search for a location"
              onChangeText={(text) => {
                if (text.length >= this.props.threshold) {
                  this.setState({ loading: true, text: text, data: [] });
                  this.onChange(text)
                } else {
                  this.setState({ loading: false, text: text, data: [] });
                }
              }
              }
              value={this.state.text} />
          </View>
          <FlatList
            keyboardShouldPersistTaps='always'
            style={styles.list}
            data={this.state.data}
            renderItem={({ item }) =>
              <AutocompleteItem
                item={item}
                onPressItem={this._onSelectLoc} />
            }
            keyExtractor={(item, index) => item.id} />
        </View>
        <View style={styles.barPadding} pointerEvents="none"/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: 'white'
  },
  spinner: {
    width: 32,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  listAndBarContainer: {
    flex: 8,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  autocompleteContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
    backgroundColor: 'white',
    height: 40,
  },
  autocompleteContainer_WithList: {

  },
  autocompleteContainer_WithoutList: {
    flex: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  barPadding: {
    flex: 1,
    // backgroundColor: 'orange'
  },
  itemText: {
    fontSize: 17,
    color: '#000000',
  },
  flatview: {
    justifyContent: 'center',
    paddingTop: 4,
    borderRadius: 2,
  },
  name: {
    fontSize: 18
  }
});