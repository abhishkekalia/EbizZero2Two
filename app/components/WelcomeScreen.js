import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import {Actions} from "react-native-router-flux";
import { Picker } from 'react-native-picker-dropdown';
import Utils from 'app/common/Utils';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window')


export default class WelcomeScreen extends Component<{}> {
     constructor(props) { 
        super(props); 
        this.fetchData=this.fetchData.bind(this);
        this.gotologin = this.gotologin.bind(this);

        this.state = { 
            userTypes: '', 
            selectCountry: '',
            animating: true, 
            refreshing: false,
            loaded: false,
            deliveryarea : ''
        }
    }


    componentDidMount(){
        this.fetchData();
    }
    fetchData(){
        const { container_id, type} = this.state; 
        fetch(Utils.gurl('countryList'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }   
        })
        .then((response) => response.json())
        .then((responseData) => { 
                    // console.warn(JSON.stringify(responseData))
            this.setState({
                userTypes: responseData.response.data,
                 loaded: true
        });
        }).done();
    }

    renderLoadingView() {
        return (
            <ActivityIndicator  
            style={styles.centering} 
            color="#1e90ff" 
            size="large"/>
            );
    }

    gotologin(){
        const { deliveryarea, selectCountry } = this.state
        if (deliveryarea.length && selectCountry.length ) { 
            Actions.loginPage();
        }
    }

    // loadUserTypes() {
    //     return this.state.userTypes.map(user => ( 
    //         <Picker.Item key={user.country_id} label={user.country_name} value={user.country_id} /> 
    //     ))
    // } 

    render(){ 
      this.gotologin()
        
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return ( 
        <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
        <View style={{
          alignSelf: 'stretch',
          paddingBottom: 10,
        }}>
          <Picker
            selectedValue={this.state.selectCountry}
            onValueChange={(selectCountry) => this.setState({selectCountry})}
            mode="dropdown"
            style={{
                borderWidth : 1,
                borderColor : '#ccc',
                alignSelf: 'stretch',
                color: 'black',
                padding:10
            }}
          >
            <Picker.Item label="United States" value="1" />
            <Picker.Item label="India" value="2" />
            <Picker.Item label="UK" value="3" />
          </Picker>
        </View>
        <View style={{
          alignSelf: 'stretch',
        }}>
          <Picker
            selectedValue={this.state.deliveryarea}
            onValueChange={(deliveryarea) => this.setState({deliveryarea})}
            mode="dropdown"
            style={{
                borderWidth : 1,
                borderColor : '#ccc',
                alignSelf: 'stretch',
                color: 'black',
                padding :10
            }}
          >
            <Picker.Item label="Ahmedabad" value="1" />
            <Picker.Item label="Gandhinagar" value="2" />
            <Picker.Item label="Vadodara" value="3" />
          </Picker>
        </View>
      </View>);
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        padding: 20
    }, 
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },

    row: {
        flexDirection: 'row',
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: '#F6F6F6',
        marginBottom : 10
    }, 

    countryIcon: {
        // borderRightWidth: 1, 
        // borderColor: '#CCC',
        width : 40,
        height:40,
        padding :10
    },
});