import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  NetInfo
} from 'react-native';
import {Actions} from "react-native-router-flux";

import Utils from 'app/common/Utils';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Picker } from 'react-native-picker-dropdown';

const { width, height } = Dimensions.get('window')

export default class WelcomeScreen extends Component {
    constructor(props) { 
        super(props); 
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
    componentwillMount(){
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange); 

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ netStatus: isConnected }); }
            );

        NetInfo.isConnected.fetch().done((isConnected) => { 
            if (isConnected)
            {
            }else{
                console.log(`is connected: ${this.state.netStatus}`);
            }
        });
    }
    componentDidMount(){

        this.fetchData()
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done((isConnected) => { 
            this.setState({ 
                netStatus: isConnected 
            }); 
        });
    }
    
    handleConnectionChange = (isConnected) => { 
        this.setState({ netStatus: isConnected }); 
        {this.state.netStatus ? this.fetchData() : MessageBarManager.showAlert({ 
                message: `Internet connection not available`,
                alertType: 'error',
            })
        }          
    }
    fetchData(){
        console.log("fetchData call")
        // const { container_id, type} = this.state; 
        fetch(Utils.gurl('countryList'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }   
        })
        .then((response) => response.json())
        .then((responseData) => { 
                    // console.warn(JSON.stringify(responseData))
                    console.log("response:=",JSON.stringify(responseData))
            this.setState({
                userTypes: responseData.response.data,
                 loaded: true
        });
        })
        .catch((error) => {
          console.log(error);
        })       
        .done();

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

    render(){ 
        this.gotologin()
         const resizeMode = 'center';
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return ( 
            <View 
            style={{ 
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems : 'center', 
            }}> 
                <Image
                style={{
                    flex: 1,
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                source={require('../images/bg_img.jpg')}
                />
                    <View style={{ flex:1, justifyContent : 'center', alignItems:'center'}}> 
                        <Image 
                        style={{ 
                            resizeMode,
                            // width : 50,
                            height : '50%'
                        }}
                        source={require('../images/logo.png')} /> 
                    </View>
    
                    <View style={styles.container}>
                        <View style={styles.row}>
                        <FontAwesome 
                            name="globe" 
                            size={30} 
                            color="#FFCC7D" 
                            style={styles.countryIcon}/>
                                                        
                            <Picker 
                            style={{width: width-100, height: 40}} 
                            mode="dropdown"
                            selectedValue={this.state.selectCountry}
                            onValueChange={(itemValue, itemIndex) => 
                            this.setState({selectCountry: itemValue})}>
                                {this.loadUserTypes()}
                            
                            </Picker>

                            {!this.state.selectCountry? <Text style={{position:'absolute', marginLeft:70, fontSize:12 }}>Select Country</Text>: undefined}
                        </View>
                    
                        <View style={styles.row}>
                            <Ionicons 
                            name="truck-fast" 
                            size={30} 
                            color="#FFCC7D" 
                            style={styles.countryIcon}/>
                            <Picker
                            Header="Select one" 
                            mode="dropdown"
                            style={{width: width-100, height: 40}} 
                            selectedValue={this.state.deliveryarea} 
                            
                            onValueChange={(deliveryarea) => this.setState({deliveryarea})}> 
                                <Picker.Item label="Select Delivery Area" value="" /> 
                                <Picker.Item label="Ahmedabad" value="1" /> 
                                <Picker.Item label="Gandhinagar" value="2" /> 
                            </Picker>
                        </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        top : 20,
        // justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: 20
    }, 

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#fbcdc5',
        // justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: '#F6F6F6',
        marginBottom : 10
    }, 

    countryIcon: {
        borderRightWidth: 1, 
        borderColor: '#fbcdc5',
        width : 40,
        height:40,
        marginLeft :10,
        marginRight :10,
        paddingTop :5
    },
    centering : {
        flex : 1,
        justifyContent  :'center',
        alignItems : 'center'
    }
});