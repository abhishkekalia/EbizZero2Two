import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Picker,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import {Actions} from "react-native-router-flux";

import Utils from 'app/common/Utils';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window')

export default class WelcomeScreen extends Component {
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
            style={[styles.centering]} 
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

    loadUserTypes() {
        return this.state.userTypes.map(user => ( 
            <Picker.Item key={user.country_id} label={user.country_name} value={user.country_id} /> 
        ))
    } 

    render(){ this.gotologin()
        
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return ( 
            <View style={styles.container}>
                <View style={styles.row}>
                    <Image style={{ width:21, height:21, marginRight : 15}} source={require('../images/_Select_Country-128.png')} />
                    <Picker style={{width: width/1.5, height: 40, backgroundColor: 'transparent'}}
                    mode="dropdown"
                    selectedValue={this.state.selectCountry}
                    onValueChange={(itemValue, itemIndex) => 
                        this.setState({selectCountry: itemValue})}>
                    <Picker.Item label="Select country" value="" /> 
                        {this.loadUserTypes()}
                    </Picker>
                    <Ionicons 
                    name="chevron-down" 
                    size={21} 
                    color="#ff8c00" 
                    style={styles.countryIcon}/>
                </View>
                <View style={styles.row}>
                    <Ionicons 
                    name="truck-delivery" 
                    size={21} 
                    color="#ff8c00" 
                    style={styles.countryIcon}/>
        
                    <Picker 
                    mode="dropdown"
                    style={{width: width/1.5, height: 40, backgroundColor: 'transparent'}} 
                        selectedValue={this.state.deliveryarea} 
                        onValueChange={(deliveryarea) => this.setState({deliveryarea})}> 
                            <Picker.Item label="Select Delivery Area" value="" /> 
                            <Picker.Item label="Ahmedabad" value="1" /> 
                            <Picker.Item label="Gandhinagar" value="2" /> 
                    </Picker>
                    <Ionicons 
                    name="chevron-down" 
                    size={21} 
                    color="#ff8c00" 
                    style={styles.countryIcon}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
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
