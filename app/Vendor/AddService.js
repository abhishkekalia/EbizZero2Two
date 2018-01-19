import React, { Component } from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Button,
    Keyboard,
    ScrollView,
    AsyncStorage,
    TextInput,
    Image,
    Alert,
    Switch
} from 'react-native'
import {Actions as routes} from "react-native-router-flux";

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import Utils from 'app/common/Utils';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';
import commonStyles from "./styles";
import ActionSheet from 'react-native-actionsheet';
import GetImage from './imageSlider';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

import RNFetchBlob from 'react-native-fetch-blob';
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = 'Select Category'

import SelectedImage from './SelectedImage';

const { width, height } = Dimensions.get('window');

const INITIAL_STATE = { quantity: '',  Size: ''}

export default class AddService extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            imageSelect : false,
            avatarSource: null,
            user_type : null,
            visibleModal: false,
            u_id: null,
            country : null,
            height : '',
            service_type: '',
            service_name : '',
            detail_description : '',
            short_description : '',
            price : '',
            special_price : '',
            rows : [] ,
            Imagepath : [],
        }
    this.inputs = {};

  }

    focusNextField(id) { 
        this.inputs[id].focus();
    }


  componentDidMount(){
        this.getKey()
        .done();
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton });    
    }
   _renderRightButton = () => {
        return(
            <TouchableOpacity onPress={() => this.uploadTocloud() } style={commonStyles.submit} >
            <Text style={{color : '#fff'}}>ADD</Text>
            </TouchableOpacity>
        );
    };

    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country ,
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

    validate(){
        const { service_type , service_name, 
            short_description, detail_description, price, 
            special_price,Imagepaths, Imagepath} = this.state; 

        let path = Imagepath.length
        if(path < 1){
            MessageBarManager.showAlert({
                message: "Plese Select At Lest Single Image",
                alertType: 'warning',
                })      
            return false
            }

        if (!service_type.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Service Type",
                alertType: 'warning',
                })      
            return false
        } 
        if (!service_name.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Service Name",
                alertType: 'warning',
                })      
            return false
        }    
        if (!short_description.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Short description Of Product",
                alertType: 'warning',
                })      
            return false
        }    
        if (!detail_description.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Detail description Of Product",
                alertType: 'warning',
                })      
            return false
        }    
        if (!price){
            MessageBarManager.showAlert({
                message: "Plese Insert Price",
                alertType: 'warning',
                })      
            return false
        }    
        if (!special_price){
            MessageBarManager.showAlert({
                message: "Plese Insert special Price",
                alertType: 'warning',
                })      
            return false
             
        }
        if ( special_price > price){
            MessageBarManager.showAlert({
                message: "Special Price cannot be greater than Price",
                alertType: 'warning',
                })      
            return false
        }      
        return true;
    }

    uploadTocloud(){
        const { service_type , service_name, 
            short_description, detail_description, price, 
            special_price, Imagepath , u_id, country} = this.state;
        
        if(this.validate()) { 
            this.setState({
                visibleModal : true
            });
        
            RNFetchBlob.fetch('POST', Utils.gurl('addService'),{ 
                Authorization : "Bearer access-token", 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            [...Imagepath,
            { name : 'u_id', data: String(u_id)}, 
            { name : 'country', data: String(country)}, 
            { name : 'service_type', data: String(service_type)}, 
            { name : 'service_name', data: String(service_name)}, 
            { name : 'short_description', data: String(short_description)}, 
            { name : 'detail_description', data: String(detail_description)}, 
            { name : 'price', data: String(price)}, 
            { name : 'special_price', data: String(special_price)}, 
            ])
            .uploadProgress((written, total) => {
            console.warn('uploaded', Math.floor(written/total*100) + '%') 
            })
            .then((res)=> this.setState({
                visibleModal : false
            }))
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
    
       let source = { 
        name : 'service_images[]', 
        filename : response.fileName, 
        data: RNFetchBlob.wrap(response.uri), 
        uri: response.uri , 
        // name: response.fileName, 
        type: 'image/jpg'};
                // let source = { uri: response.uri , name: response.fileName, type: 'image/jpg'}; 
                
                let uri = response.uri;

              // let path = { uri , name: response.fileName, type: 'image/jpg'};

                this.setState({
                    avatarSource: source,
                    imageSelect : true,
                    videoSelect : false,
                    // image : path,
                });
                var newStateArray = this.state.rows.slice(); 
                var newPathArray = this.state.Imagepath.slice(); 
                newStateArray.push(source); 
                newPathArray.push(source); 
                    this.setState({ 
                        rows: newStateArray,
                        Imagepath: newPathArray
                    });
            }
        });
    }
    render() {
        const { imageSelect, quantityRows, sizeRows, Imagepath} = this.state; 

        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';
        
        return (
            <ScrollView 
            contentContainerStyle={commonStyles.container} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
                <View style={commonStyles.ImageAdd}>
                    <Text style={{color: borderColorImage}}>Select Service Image</Text>  
                    <View style={{ borderWidth: 1, borderColor: 'transparent', borderRadius : 40}}>
                        <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="upload-cloud" size= {30} style={{padding :20 }} /> 
                    </View>
                    <View style={{  top: 10, flexDirection:'row', marginBottom :20}}>
                        { this.state.avatarSource === null ? <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="image" size= {30} style={{padding :20, borderWidth: 1, borderColor: '#ccc', }} /> :
                            <SelectedImage 
                            productImages={this.state.rows} 
                            />
                        }
                    </View>
                </View>
                <View style={[commonStyles.formItems, { paddingRight : 25}]}> 
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Service Type *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
                        value={this.state.service_type}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Service Type"
                        maxLength={140}
                        onSubmitEditing={() => { 
                            this.focusNextField('two');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => { 
                            this.inputs['one'] = input;
                        }}
                        onChangeText={(service_type) => this.setState({service_type})}
                        />
                    </View>
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Name *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
                        value={this.state.service_name}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Service name"
                        maxLength={140}
                        onSubmitEditing={() => { 
                            this.focusNextField('three');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => { 
                            this.inputs['two'] = input;
                        }}
                        onChangeText={(service_name) => this.setState({service_name})}
                        />
                    </View>
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Short Description *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
                        value={this.state.short_description}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Short Description "
                        maxLength={140}
                        onSubmitEditing={() => { 
                            this.focusNextField('four');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => { 
                            this.inputs['three'] = input;
                        }}
                        onChangeText={(short_description) => this.setState({short_description})}
                        />
                    </View>
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Detail Description  *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height)}]}
                        value={this.state.detail_description}
                        numberOfLines={3}
                        multiline
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Detail Description "
                        maxLength={140}
                        onSubmitEditing={() => { 
                            this.focusNextField('five');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => { 
                            this.inputs['four'] = input;
                        }}
                        onContentSizeChange={(event) => {
                            this.setState({height: event.nativeEvent.contentSize.height});
                        }}
                        onChangeText={(detail_description) => this.setState({detail_description})}
                        />
                    </View>
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Price *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
                        value={this.state.price}
                        keyboardType={'numeric'}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Price "
                        maxLength={7}
                        onSubmitEditing={() => { 
                            this.focusNextField('six');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => { 
                            this.inputs['five'] = input;
                        }}
                        onChangeText={(price) => this.setState({price})}
                        />
                    </View>
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Special Price *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
                        value={this.state.special_price}
                        underlineColorAndroid = 'transparent'
                        keyboardType={'numeric'}
                        autoCorrect={false}
                        placeholder="Special Price"
                        maxLength={7}
                        returnKeyType={"done" }
                        ref={ input => { 
                            this.inputs['six'] = input;
                        }}
                        onChangeText={(special_price) => this.setState({special_price})}
                        />
                    </View>
                    
                   
                </View>

                    
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                        <CirclesLoader />
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}
