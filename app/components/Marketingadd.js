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
    AsyncStorage,
    Image,
    Alert
} from 'react-native'
import {Actions as routes} from "react-native-router-flux";

import Picker     from './Picker'
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import Utils from 'app/common/Utils';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';

export default class Marketingadd extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            videoSelect: false,
            avatarSource: null,
            videoSource: null ,
            u_id: null,
            user_type : null,
            country : null,
            amount : '1',
            visibleModal: false       
        }
    }
    componentDidMount(){
        this.getKey()
        .done();
    }
    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country ,
                user_type: response.userdetail.user_type 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

    uploadTocloud(source, name){
        const { image, imageSelect , avatarSource, videoSelect, u_id, user_type, country, amount } = this.state; 
        var isImage 
        if(image === 'image') { isImage = "1"} else { isImage = "2"}
        // if(image === 'image') { path = imageSelect} else { path = videoSelect}

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('user_type', String(user_type)); 
        formData.append('ad_type', String(isImage)); 
        formData.append('path', {
            uri:  source,
            type: 'image/jpg', 
            name: name});         
        formData.append('thumbnail_image', {
            uri:  source,
            type: 'image/jpg', 
            name: name});
        formData.append('ad_category', String(4)); 
        formData.append('amount', String(amount)); 

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        } 
            fetch(Utils.gurl('addMarketingAd'), config) 
            .then((response) => response.json())
            .then((responseData) => {
                routes.myuserAdfaturah({ uri : responseData.data.url, ad_id : responseData.data.ad_id, amount :amount })

                if(responseData.status){
                    this.setState({
                        visibleModal : false});
                }
            }).done();


        // console.warn(formData);

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
              let path = response.uri
              let name = response.fileName
    // console.warn(response.uri);

                this.setState({
                    avatarSource: source,
                    imageSelect : true,
                    videoSelect : false,
                    image : 'image',
                    visibleModal : true
                });
                this.uploadTocloud(path, name );
            }
        });
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
                  imageSelect : false,
                  image : 'video'

        
              });
        }});
    }

    render() {
        const { imageSelect , videoSelect} = this.state; 
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d'    
        borderColorVideo= videoSelect ? "#a9d5d1" : '#f53d3d'    

        return (
            <View style={[styles.container, { padding : 10}]}> 
                <View style={{ flex:0.5, borderColor : '#ccc', borderWidth : 1, flexDirection: 'column',justifyContent: 'space-around',}}>
                    <Text style={{ textAlign: 'center'}}>Choose Your Picture or Video </Text>
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
                    <Text style={{ textAlign: 'center', fontSize: 14, fontWeight:'bold' }}>Kd : 1</Text>
                    <Text style={{  textAlign: 'center'}}> Charges for Marketing Advertisement </Text>

                </View>
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                    <CirclesLoader />
                    
                </View>
            </Modal>

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