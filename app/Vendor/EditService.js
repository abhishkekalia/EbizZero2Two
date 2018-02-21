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
import GetImage from './imageSlider';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

import RNFetchBlob from 'react-native-fetch-blob';
import Editimage from './Editimage';
const { width, height } = Dimensions.get('window');

export default class EditService extends Component {
    constructor(props) {
        super(props);
        this.state={
            imageSelect : false,
            avatarSource: null,
            user_type : null,
            visibleModal: false,
            u_id: this.props.u_id,
            country : this.props.country,
            height : '',
            service_type: this.props.service_type,
            service_name : this.props.service_name,
            detail_description : this.props.detail_description,
            short_description : this.props.short_description,
            price : this.props.price,
            special_price : this.props.special_price,
            rows : [] ,
            Imagepath : [],
            removed_images : []
        }
    this.inputs = {};

  }

    focusNextField(id) {
        this.inputs[id].focus();
    }


  componentDidMount(){
    var Items = this.props.serviceImages,
            length = Items.length,
            organization,
            Select =[],
            user,
            i;

        for (i = 0; i < length; i++) {
            organization = Items[i];
            Select.push ({uri:organization.image});
        }
        this.setState({
            rows : Select
        })

    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton, left :  this._renderLeftButton });
    }
   _renderLeftButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };
   _renderRightButton = () => {
        return(
            <TouchableOpacity onPress={() => this.uploadTocloud() } style={commonStyles.submit} >
            <Text style={{color : '#fff'}}>Upload</Text>
            </TouchableOpacity>
        );
    };

    validate(){
        const { service_type , service_name,
            short_description, detail_description, price,
            special_price,Imagepaths, Imagepath} = this.state;

        let path = Imagepath.length
        if(path < 1){
            MessageBarManager.showAlert({
                message: "Plese Select At Lest Single Image",
                alertType: 'warning',
                title:''
                })
            return false
            }

        if (!service_type.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Service Type",
                alertType: 'warning',
                title:''
                })
            return false
        }
        if (!service_name.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Service Name",
                alertType: 'warning',
                title:''
                })
            return false
        }
        if (!short_description.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Short description Of Product",
                alertType: 'warning',
                title:''
                })
            return false
        }
        if (!detail_description.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Detail description Of Product",
                alertType: 'warning',
                title:''
                })
            return false
        }
        if (!price){
            MessageBarManager.showAlert({
                message: "Plese Insert Price",
                alertType: 'warning',
                title:''
                })
            return false
        }
        if (!special_price){
            MessageBarManager.showAlert({
                message: "Plese Insert special Price",
                alertType: 'warning',
                title:''
                })
            return false

        }
        if ( special_price > price){
            MessageBarManager.showAlert({
                message: "Special Price cannot be greater than Price",
                alertType: 'warning',
                title:''
                })
            return false
        }
        return true;
    }


    uploadTocloud(){
               const { service_type , service_name,
            short_description, detail_description, price,
            special_price, Imagepath, removed_images} = this.state;

        const { u_id, country } = this.props;
        if(this.validate()) {
            this.setState({
                visibleModal : true
            });

            RNFetchBlob.fetch('POST', Utils.gurl('editService'),{
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
            { name : 'service_id', data: String(this.props.service_id)},
            { name : 'removed_images', data: removed_images.toString()},
            ])
            .uploadProgress((written, total) => {
            console.log('uploaded', Math.floor(written/total*100) + '%')
            })
            .then((res)=>{
                var getdata = JSON.parse(responseData.data);
               if(getdata.status){
                    MessageBarManager.showAlert({
                        message: "Product Update Successfully",
                        alertType: 'warning',
                        title:''
                    })
                    this.setState({
                        visibleModal : false
                    })
                }else{
                    MessageBarManager.showAlert({
                        message: "Product Upload Failed",
                        alertType: 'warning',
                        title:''
                    })
                    this.setState({
                        visibleModal : false
                    })
                }
            })
            .catch((errorMessage, statusCode) => {
                routes.service();
                // message: "Failed Due to Some communication Error",
                // MessageBarManager.showAlert({
                // alertType: 'warning',
                // })
                this.setState({
                        visibleModal : false
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
             let url = response.uri
             let path =
               (Platform.OS === 'ios')?
                   url.replace(/^file:\/\//, '') : response.uri

       let source = {
        name : 'service_images[]',
        filename : response.fileName,
        data: RNFetchBlob.wrap(path),
        uri: response.uri ,
        // name: response.fileName,
        type: 'image/jpg'};

                let uri = response.uri;
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
    getResponse(rows){
        this.setState({rows});
    }
    getRemoveresponse(result){
        var arrayvar = this.state.removed_images.slice()
        arrayvar.push(result)
        this.setState({ removed_images: arrayvar })
    }

    render() {
        const { imageSelect, quantityRows, sizeRows} = this.state;
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';

        let is_feature;
        if(this.state.is_feature === '0' ){
            is_feature = false} else { is_feature = true}

        return (
            <ScrollView
            contentContainerStyle={commonStyles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>

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


                    <View style={{  top: 10, marginBottom : 10 ,flexDirection:'row'}}>

                        {
                            Platform.OS === 'ios' ? 
                            <TouchableOpacity
                            onPress={this.selectPhotoTapped.bind(this)}>
                            <View style={{ }}>
                                <Feather
                                    name="upload-cloud" size= {30} style={{ padding:20 }}/>
                                    <Text>Click here</Text>
                            </View>
                            </TouchableOpacity>
                            :
                            <TouchableNativeFeedback
                                onPress={this.selectPhotoTapped.bind(this)}
                                background={TouchableNativeFeedback.SelectableBackground()}>
                                <View style={{ }}>
                                <Feather
                                    name="upload-cloud" size= {30} style={{ padding:20 }}/>
                                    <Text>Click here</Text>
                            </View>
                            </TouchableNativeFeedback>
                        }
                        <Editimage
                            productImages={this.state.rows}
                            callback={this.getResponse.bind(this)}
                            getremovedata= {this.getRemoveresponse.bind(this)}
                            />
                    </View>
                </View>
            <TouchableOpacity onPress={() => this.uploadTocloud() } style={{
                height:54,
                marginTop : 20,
                justifyContent :'center',
                alignItems :'center',
                backgroundColor:'#a9d5d1'
            }} >
            <Text style={{color : '#fff', fontWeight:'bold'}}>Edit Service</Text>
            </TouchableOpacity>
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                    <CirclesLoader />

                </View>
            </Modal>

            </ScrollView>
        )
    }
}
