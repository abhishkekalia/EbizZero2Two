import React, { Component } from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    PixelRatio,
    Button,
    Image,
    Alert
} from 'react-native'
import Picker     from './Picker'
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'

export default class Marketingadd extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            imageSelect : false,
            videoSelect: false,
            avatarSource: null,
            videoSource: null        
        }
    }
    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
              skipBackup: true
            }
        }; 

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response); 
            if (response.didCancel) {
            console.log('User cancelled photo picker');
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {
              let source = { uri: response.uri };
    
                this.setState({
                    avatarSource: source,
                    imageSelect : true,
                    videoSelect : false,
            });
        }});
    }

    selectVideoTapped() { 
        const options = {
            title: 'Video Picker',
            takePhotoButtonTitle: 'Take Video...',
            mediaType: 'video',
            videoQuality: 'medium'
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
              console.log('User cancelled video picker');
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {
              this.setState({
                  videoSource: response.uri,
                  videoSelect : true,
                  imageSelect : false
        
              });
        }});
    }

    render() {
        const { imageSelect , videoSelect} = this.state; 
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d'    
        borderColorVideo= videoSelect ? "#a9d5d1" : '#f53d3d'    

        return (
            <View style={[styles.container, { padding : 10}]}> 
                <View style={{ flex:0.5, borderColor : '#ccc', borderWidth : 1, flexDirection: 'column',      justifyContent: 'space-around',}}>
                    <Text style={{ left : 20}}>Choose Your Picture or Video </Text>
                        <View style={{justifyContent : "space-around",flexDirection: 'row',}}>
                        { this.state.avatarSource === null ? <Feather name="upload-cloud" size= {30} style={{padding :20 }} /> :
                            <Image style={styles.avatar} source={this.state.avatarSource} />
                        }
                        </View>
                    <View style={{justifyContent : "space-around",flexDirection: 'row',}}>
                        <Entypo  
                            name="image" 
                            size= {30}
                            color={borderColorImage}
                            onPress={this.selectPhotoTapped.bind(this)}
                            style={{padding :20 , borderColor : "#ccc", borderWidth : 0.5, borderRadius : 40}} /> 
                        <Feather 
                        name="play-circle" onPress={this.selectVideoTapped.bind(this)}
                        color={borderColorVideo}
                        size= {30} 
                        style={{padding :20 , borderColor : '#ccc', borderWidth : 0.5, borderRadius : 40}} />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'transparent',
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 50,
        width: 100,
        height: 100
    }

})