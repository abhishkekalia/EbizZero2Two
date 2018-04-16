import React, { Component } from 'react';
import { Dimensions, StyleSheet,View } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";
import I18n from 'react-native-i18n'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 22.966425;
const LONGITUDE = 72.615933;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyD4T7njRubC7I7zYNwE5wnuTw0X5E_1Cc4';

class TrackOrder extends Component<Props> {

      constructor(props) {
        super(props);
        this.state = {
          coordinates: [
            {
              latitude: 22.966425,
              longitude: 72.615933,
            },
            {
              latitude: 22.996170,
              longitude: 72.599584,
            },
          ],
        };

        this.mapView = null;
      }

      onMapPress = (e) => {
        this.setState({
          coordinates: [
            ...this.state.coordinates,
            e.nativeEvent.coordinate,
          ],
        });
      }

      render() {
        return (
            <View style={{ flex : 1, justifyContent: 'center',}}>
                <MapView
              initialRegion={{
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              style={StyleSheet.absoluteFill}
              ref={c => this.mapView = c}
              onPress={this.onMapPress}
            >
              {this.state.coordinates.map((coordinate, index) =>
                <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} >
                    <FontAwesome name="car" size={15} color="#FFCC7D"/>
                    </MapView.Marker>
              )}
              {(this.state.coordinates.length >= 2) && (
                <MapViewDirections
                  origin={this.state.coordinates[0]}
                  waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): null}
                  destination={this.state.coordinates[this.state.coordinates.length-1]}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={5}
                  strokeColor="#a9d5d1"
                  onStart={(params) => {
                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                  }}
                  // onReady={(result) => {
                  //   this.mapView.fitToCoordinates(result.coordinates, {
                  //     edgePadding: {
                  //       right: (width / 20),
                  //       bottom: (height / 20),
                  //       left: (width / 20),
                  //       top: (height / 20),
                  //     }
                  //   });
                  // }}
                  onError={(errorMessage) => {
                    // console.log('GOT AN ERROR');
                  }}
                />
              )}
            </MapView>
          </View>
        );
      }
    }
    function mapStateToProps(state) {
        return {
            identity: state.identity,
    		lang: state.auth.lang,
            country: state.auth.country,
            u_id: state.identity.u_id,
            deviceId: state.auth.deviceId,
        };
    }

    export default connect(mapStateToProps)(TrackOrder);
