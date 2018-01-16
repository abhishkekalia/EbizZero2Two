import React, { Component } from 'react'
import {
    View,
    Text,
    Picker,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    PixelRatio,
    Button,
    AsyncStorage,
    Image,
    Alert
} from 'react-native';
 const { width, height } = Dimensions.get('window')

import {Actions as routes} from "react-native-router-flux";
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import Utils from 'app/common/Utils';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';
import RNFetchBlob from 'react-native-fetch-blob';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

export default class MarketingCompaign extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            videoSelect: false,
            avatarSource: null,
            videoSource: null ,
            imageSource : '',
            imageName : '',
            u_id: null,
            ad_category : '',
            user_type : null,
            country : null,
            amount : '0',
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
    validate(){
        const { imageSource, imageName, ad_category} = this.state; 
        if (!imageName.length){
            MessageBarManager.showAlert({
                message: "Plese Select Image",
                alertType: 'warning',
                })      
            return false
        }
        if (!ad_category.length){
            MessageBarManager.showAlert({
                message: "Plese Select Advertisement Category",
                alertType: 'warning',
                })      
            return false
        } 
        return true;
    }

    uploadTocloud(source, name){
        const { 
            image, 
            imageSelect , 
            avatarSource, 
            videoSelect, 
            u_id, 
            user_type, 
            country, 
            amount, 
            ad_category,
            imageSource,
            imageName,
        } = this.state; 
        var isImage, price 
        if(image === 'image') { 
            isImage = "1", price = 1 } else { isImage = "2", price = 1.5}
        // if(image === 'image') { path = imageSelect} else { path = videoSelect}

        if(this.validate()){
            this.setState({
                visibleModal : true
            })

            RNFetchBlob.fetch('POST', Utils.gurl('addMarketingAd'),{ 
                Authorization : "Bearer access-token", 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            [
            { name : 'path',  filename : "image.jpg", data: RNFetchBlob.wrap(imageSource)},
            { name : 'thumbnail_image',  filename : "thumbline.jpg", data: RNFetchBlob.wrap(imageName)},
            { name : 'u_id', data: String(u_id)}, 
            { name : 'country', data: String(country)}, 
            { name : 'user_type', data: String(user_type)}, 
            { name : 'ad_type', data: String(isImage)}, 
            { name : 'ad_category', data: String(ad_category)}, 
            { name : 'amount', data: String(price)}, 
            ])
            .uploadProgress((written, total) => {
            console.log('uploaded', Math.floor(written/total*100) + '%') 
            })
            .then((responseData)=>{ 
               var getdata = JSON.parse(responseData.data);
                    routes.myfaturah({ uri : getdata.data.url, order_id : getdata.data.ad_id})

                        this.setState({
                            visibleModal : false,
                            amount : price
                        })
                    })
            .done();
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
              let path = response.uri
              let name = response.fileName

                this.setState({
                    avatarSource: source,
                    imageSelect : true,
                    videoSelect : false,
                    image : 'image',
                    imageSource: path,
                    imageName : name,
                });
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
            <TouchableOpacity style={{ alignItems : 'flex-end'}} onPress={()=>this.uploadTocloud()}>
            <Text style={{backgroundColor : '#ccc', padding : 10, borderRadius : 5}}>Upload</Text>
            </TouchableOpacity> 
                <View style={{ flex:1, 
                    borderColor : '#ccc', 
                    borderWidth : 1, 
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    padding : 10
                }}>
                    <Text style={{ textAlign: 'center'}}>Select files To upload </Text>
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

                    <View style={{ borderWidth : 1, borderColor : '#ccc', margin : 10, borderRadius : 5}}>
                    <Picker 
                    mode={"dropdown"}
                    selectedValue={this.state.ad_category} 
                    onValueChange={(itemValue, itemIndex) => this.setState({ad_category: itemValue})}> 
                    <Picker.Item label="Select Ad Category" value="" /> 
                    <Picker.Item label="Products" value="1" /> 
                    <Picker.Item label="accessories" value="2" />
                    <Picker.Item label="Services" value="3" />
                    <Picker.Item label="External" value="4" />
                    </Picker>
                    </View>
                    <Text style={{ width: width-50 ,textAlign: 'center', fontSize: 14, }}>
                    Raise your awareness about your brand by promoting video and images 
                    that show behind the scene footage, product lounches or customer Stories

                    </Text>

                </View>
                <Text style={{ fontSize : 20, textAlign : 'center', color : '#a9d5d1', padding : 10}}>Help And Suggestion</Text>
                <Text style={{ fontSize : 10, textAlign : 'center'}}>
                want to upload videos longer than 15 Secounds
                </Text>
                <View style={styles.cost}>
                <Text >Cost Per Advertisement</Text>
                <Text style={{color : '#a9d5d1',}}>{this.state.amount} KWD</Text>
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
        width: 70,
        height: 70
    },
    cost : {
        alignItems : 'center',
        borderColor : '#ccc',
        borderTopWidth : 1,
        borderBottomWidth : 1,
        padding : 10
    }

})