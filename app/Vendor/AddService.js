import React, { Component } from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
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
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker'
import Utils from 'app/common/Utils';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';
import commonStyles from "./styles";
import ActionSheet from 'react-native-actionsheet';
import GetImage from './imageSlider';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import RNFetchBlob from 'react-native-fetch-blob';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = 'Select Type'

import SelectedImage from './SelectedImage';

const { width, height } = Dimensions.get('window');

const INITIAL_STATE = { quantity: '',  Size: ''}

class AddService extends Component {
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
            service_name_in_arabic: '',
            short_description_in_arabic: '',
            detail_description_in_arabic: '',
            price_in_arabic: '',
            is_weekend:false,
            special_price_in_arabic: '',
            price : '',
            special_price : '',
            rows : [] ,
            Imagepath : [],
            languageChoose: 'en',
            is_feature: '',
            options : ['0','1'],
            optionsAvailable: [],
            product_category: '',
            product_category_id:'',
            service_type_name:'',
        }
        this.inputs = {};
        this.onSelect = this.onSelect.bind(this)
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
    }
    onSelect(index, value){
      console.warn("radio val",value);
        this.setState({
            languageChoose: value
        })
    }
    focusNextField(id) {
        this.inputs[id].focus();
    }
    componentDidMount(){
        this.getKey()
        .then(()=>this.getServiceType())
        .done();
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton, left :  this._renderLeftButton, hideNavBar : false });
    }
    _renderLeftButton = () => {
        const { lang} = this.props;
        return(
            lang === 'ar' ?
            <TouchableOpacity onPress={() => this.uploadTocloud() } style={[commonStyles.submit, { margin: 5}]} >
                <Text style={{color : '#fff'}}>{I18n.t('venderprofile.uploadad', { locale: lang })}</Text>
            </TouchableOpacity>
            :
            <Text style={{color : '#fff'}}></Text>
        );
    };
    _renderRightButton = () => {
        const { lang} = this.props;
        return(
            lang === 'ar' ? <Text style={{color : '#fff'}}></Text> :
            <TouchableOpacity onPress={() => this.uploadTocloud() } style={[commonStyles.submit, { margin: 5}]} >
                <Text style={{color : '#fff'}}>{I18n.t('venderprofile.uploadad', { locale: lang })}</Text>
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

    getServiceType(){
        const { u_id, country,} = this.state;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("Request ServiceTypeList:=",config)
        fetch(Utils.gurl('ServiceTypeList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Response ServiceTypeList:=",responseData.data)
            if(responseData.status){
                var data = responseData.data,
                length = data.length,
                optionsList= []
                optionsList.push('Cancel');
                for(var i=0; i < length; i++) {
                    order = data[i];
                    category_name = order.name;
                    optionsList.push(category_name);
                }
                this.setState({
                    options : optionsList,
                    optionsAvailable : responseData.data
                })
            }
        })
        .catch((errorMessage, statusCode) => {
            console.log(errorMessage);
        })
        .done();
    }

    handlePress(i) {
        if (i > 0) {
            console.log("Selected Type:=",i)
            var data = this.state.optionsAvailable[i-1]
            console.log("Selected Type:=",data.id)
            this.setState({
                product_category: i,
                product_category_id: data.id,
                service_type_name: data.name,
            })
        }
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    validate(){
        const { service_type , service_name, service_name_in_arabic, short_description_in_arabic, detail_description_in_arabic, price_in_arabic, special_price_in_arabic, short_description, detail_description, price, special_price,Imagepaths, Imagepath, product_category_id} = this.state;
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        let path = Imagepath.length
        if(path < 1){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.imageuploaderr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        // if (!service_type.length){
        //     MessageBarManager.showAlert({
        //         message: I18n.t('vendoraddservice.servicetypeerr', { locale: lang }),
        //         alertType: 'extra',
        //         title:'',
        //         titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //         messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        //     })
        //     return false
        // }

        if (!product_category_id.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.servicetypeerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        
        if (!service_name.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.servicenameerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!short_description.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.shortdescerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!detail_description.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.detaildescerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!price){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.priceerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        // if (!special_price){
        //     MessageBarManager.showAlert({
        //         message: I18n.t('vendoraddservice.specialpriceerr', { locale: lang }),
        //         alertType: 'extra',
        //         title:'',
        //         titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //         messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        //     })
        //     return false
        // }
        if ( parseInt(special_price) > parseInt(price)){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.specialpriceerr1', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!service_name_in_arabic.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.servicename_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!short_description_in_arabic.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.shortdesc_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!detail_description_in_arabic.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.detaildesc_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        return true;
    }

    uploadTocloud(){
    const { service_type , service_name, service_name_in_arabic,
        short_description_in_arabic, detail_description_in_arabic,
        price_in_arabic, special_price_in_arabic, short_description,
        detail_description, price, special_price,Imagepath,  u_id, country, product_category_id, service_type_name} = this.state;
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
                // { name : 'service_type', data: String(service_type)},
                { name : 'service_type', data: String(service_type_name)},
                { name : 'service_type_id', data: String(product_category_id)},                
                { name : 'service_name', data: String(service_name)},
                { name : 'service_name_in_arabic', data: String(service_name_in_arabic)},
                { name : 'short_description', data: String(short_description)},
                { name : 'short_description_in_arabic', data: String(short_description_in_arabic)},
                { name : 'detail_description', data: String(detail_description)},
                { name : 'detail_description_in_arabic', data: String(detail_description_in_arabic)},
                { name : 'price', data: String(price)},
                { name : 'price_in_arabic', data: String(price)},
                { name : 'special_price', data: String(special_price)},
                { name : 'special_price_in_arabic', data: String(special_price)},
            ])
            .uploadProgress((written, total) => {
                console.warn('uploaded', Math.floor(written/total*100) + '%')
            })
            .then((res)=>{ 
                    this.setState({
                        visibleModal : false
                    })
                    console.log("Response addService:=",res)
                    var responseData = JSON.parse(res.data)
                    console.log("responseData:=",responseData)
                    if (responseData.response.status == true) {
                        MessageBarManager.showAlert({
                            message: responseData.response.data.message,
                            alertType: 'warning',
                            title:''
                        })
                        routes.service()
                    }
                    else {
                        MessageBarManager.showAlert({
                            message: responseData.response.data.message,
                            alertType: 'warning',
                            title:''
                        })
                    }
                }
            )
            .catch((errorMessage, statusCode) => {
                MessageBarManager.showAlert({
                    message: errorMessage,
                    alertType: 'warning',
                    title:''
                })
            })
            .done();
        }
    }
    selectPhotoTapped() {
        const options = {
            quality: 0.6,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                // skipBackup: true
                cameraRoll: true,
                waitUntilSaved: true,
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
                let name = response.fileName
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
                    type: 'image/jpg'
                };

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
    render() {
        const { imageSelect, quantityRows, sizeRows, Imagepath, languageChoose} = this.state,
        { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';
        let is_feature;
        if(this.state.is_feature === '0' ){ is_feature = false} else { is_feature = true}
        let is_weekend_work;
        if(this.state.is_weekend === true){ is_weekend_work = "checkbox-marked"} else {is_weekend_work = "checkbox-blank-outline"}
        return (
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: 'transparent',
                    paddingBottom:30,
                    width: width,
                    padding: 10
                }}//commonStyles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}
                automaticallyAdjustContentInsets={false}
                directionalLockEnabled = {true}
                horizontal = {false}
                ref={'scrView'}
                >
                <View style={commonStyles.ImageAdd}>
                    <Text style={{color: borderColorImage, marginBottom : 10, marginTop:20}}>{I18n.t('vendoraddservice.selectserviceimg', { locale: lang })}</Text>
                    <Text style={[commonStyles.label,{ textAlign: textline, marginBottom : 10}]}>{I18n.t('vendoraddservice.uploadpicture', { locale: lang })}</Text>

                    <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#a9d5d1'}}>
                        <Feather onPress={this.selectPhotoTapped.bind(this)}
                            name="upload-cloud" size= {30} style={{padding :30, marginBottom:20 }} />

                        </View>
                    <View style={{  top: 10, flexDirection:'row', marginBottom :20}}>
                        { this.state.avatarSource === null ? undefined :
                            <SelectedImage
                            productImages={this.state.rows}
                            />
                        }
                    </View>
                </View>
                <RadioGroup
                    size={15}
                    thickness={1}
                    color='#a9d5d1'
                    highlightColor='transparent'
                    // selectedIndex={langIndex}
                    selectedIndex={0}
                    onSelect = {(index, value) => this.onSelect(index, value)}
                    style={{flexDirection: 'row', justifyContent: 'space-around'}}
                    >

                    <RadioButton value='en' >
                        <Text>English</Text>
                    </RadioButton>
                    <RadioButton value='ar'>
                        <Text>Arabic</Text>
                    </RadioButton>
                </RadioGroup>
                <View style={commonStyles.formItems}>
                    {/* --------------------------service Type start-----------*/}
                    {(languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.servicetypelbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            {/* <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5,textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
                                value={this.state.service_type}
                                underlineColorAndroid = 'transparent'
                                autoCorrect={false}
                                placeholder={I18n.t('vendoraddservice.servicetype', { locale: languageChoose })}
                                maxLength={140}
                                onSubmitEditing={() => {
                                    this.focusNextField('two');
                                }}
                                returnKeyType={ "next" }
                                ref={ input => {
                                    this.inputs['one'] = input;
                                }}
                                onChangeText={(service_type) => this.setState({service_type})}
                                /> */}
                            <TouchableOpacity style={{
                                        borderRadius : 5,
                                        padding : 5,
                                        // margin : 15,
                                        borderWidth : 1,
                                        borderColor : '#ccc',
                                        width : width-40,
                                        // marginTop:5
                                    }} onPress={this.showActionSheet}>
                                    <Text style={{
                                            textAlign: textline, 
                                            paddingVertical:5, 
                                            textAlign: languageChoose == 'ar'? 'right': 'left',
                                            // backgroundColor:'red'
                                        }}>
                                        { this.state.product_category ? this.state.options[this.state.product_category] : I18n.t('vendoraddservice.selectServiceType', { locale: lang })}
                                    </Text>
                                    <ActionSheet
                                        ref={o => this.ActionSheet = o}
                                        title={title}
                                        options={this.state.options}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={this.handlePress}/>
                                </TouchableOpacity>
                        </View>
                        :
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.servicetypelbl', { locale: lang })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            {/* <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
                                value={this.state.service_type}
                                underlineColorAndroid = 'transparent'
                                autoCorrect={false}
                                placeholder={I18n.t('vendoraddservice.servicetype', { locale: lang })}
                                maxLength={140}
                                onSubmitEditing={() => {
                                    this.focusNextField('two');
                                }}
                                returnKeyType={ "next" }
                                ref={ input => {
                                    this.inputs['one'] = input;
                                }}
                                onChangeText={(service_type) => this.setState({service_type})}
                                /> */}
                                <TouchableOpacity style={{
                                        borderRadius : 5,
                                        padding : 5,
                                        // margin : 15,
                                        borderWidth : 1,
                                        borderColor : '#ccc',
                                        width : width-40,
                                        // marginTop:5
                                    }} onPress={this.showActionSheet}>
                                    <Text style={{
                                            textAlign: textline, 
                                            paddingVertical:5, 
                                            // backgroundColor:'red'
                                        }}>
                                        { this.state.product_category ? this.state.options[this.state.product_category] : I18n.t('vendoraddservice.selectServiceType', { locale: lang })}
                                    </Text>
                                    <ActionSheet
                                        ref={o => this.ActionSheet = o}
                                        title={title}
                                        options={this.state.options}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={this.handlePress}/>
                                </TouchableOpacity>
                        </View>
                    }
                    {/* --------------------------service Type end-----------*/}
                    {/* --------------------------service name start-----------*/}
                    {(languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.servicenamelbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
                                value={this.state.service_name_in_arabic}
                                underlineColorAndroid = 'transparent'
                                autoCorrect={false}
                                placeholder={I18n.t('vendoraddservice.servicename', { locale: languageChoose })}
                                maxLength={140}
                                onSubmitEditing={() => {
                                    this.focusNextField('three');
                                }}
                                returnKeyType={ "next" }
                                ref={ input => {
                                    this.inputs['two'] = input;
                                }}
                                onChangeText={(service_name_in_arabic) => this.setState({service_name_in_arabic})}
                                />
                        </View>
                        :
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.servicenamelbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
                                value={this.state.service_name}
                                underlineColorAndroid = 'transparent'
                                autoCorrect={false}
                                placeholder={I18n.t('vendoraddservice.servicename', { locale: languageChoose })}
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
                    }
                    {/* --------------------------service name end-----------*/}
                    {/* --------------------------service short description start-----------*/}
                    {(languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.shortdesclbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
                            value={this.state.short_description_in_arabic}
                            underlineColorAndroid = 'transparent'
                            autoCorrect={false}
                            placeholder={I18n.t('vendoraddservice.shortdesc', { locale: languageChoose })}
                            maxLength={140}
                            onSubmitEditing={() => {
                                this.focusNextField('four');
                            }}
                            returnKeyType={ "next" }
                            ref={ input => {
                                this.inputs['three'] = input;
                            }}
                            onChangeText={(short_description_in_arabic) => this.setState({short_description_in_arabic})}
                            />
                        </View>
                        :
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.shortdesclbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
                            value={this.state.short_description}
                            underlineColorAndroid = 'transparent'
                            autoCorrect={false}
                            placeholder={I18n.t('vendoraddservice.shortdesc', { locale: languageChoose })}
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
                    }
                    {/* --------------------------service short description ens-----------*/}
                    {/* --------------------------service detail description start-----------*/}
                    {(languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.detaildesclbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                            style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height),  textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
                            value={this.state.detail_description_in_arabic}
                            numberOfLines={3}
                            multiline
                            underlineColorAndroid = 'transparent'
                            autoCorrect={false}
                            placeholder={I18n.t('vendoraddservice.detaildesc', { locale: languageChoose })}
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
                            onChangeText={(detail_description_in_arabic) => this.setState({detail_description_in_arabic})}
                            />
                        </View>
                        :
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.detaildesclbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                            style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height),  textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
                            value={this.state.detail_description}
                            numberOfLines={3}
                            multiline
                            underlineColorAndroid = 'transparent'
                            autoCorrect={false}
                            placeholder={I18n.t('vendoraddservice.detaildesc', { locale: languageChoose })}
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
                    }
                    {/* --------------------------service price start-----------*/}
                    <View style={commonStyles.textField}>
                        <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                            <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.pricelbl', { locale: languageChoose })}</Text>
                            <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                        </View>
                        <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10, paddingRight:10}]}
                        value={this.state.price}
                        keyboardType={'numeric'}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder={I18n.t('vendoraddservice.price', { locale: languageChoose })}
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
                    {/* --------------------------service price end-----------*/}
                    {/* --------------------------service special start-----------*/}
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.sppricelbl', { locale: languageChoose })}</Text>
                                {/* <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text> */}
                            </View>
                            <TextInput
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10, paddingRight:10}]}
                            value={this.state.special_price}
                            underlineColorAndroid = 'transparent'
                            keyboardType={'numeric'}
                            autoCorrect={false}
                            placeholder={I18n.t('vendoraddservice.spprice', { locale: languageChoose })}
                            maxLength={7}
                            returnKeyType={"done" }
                            ref={ input => {
                                this.inputs['six'] = input;
                            }}
                            onChangeText={(special_price) => this.setState({special_price})}
                            />
                        </View>
                    {/* --------------------------service special price end-----------*/}
                </View>
                <View style={[commonStyles.feature,{paddingTop:10,paddingRight:10, flexDirection: direction}]}>
                    <View style={{ flexDirection: direction}}>
                        <Text style={[commonStyles.label, { textAlign: textline}]}>{I18n.t('vendoraddservice.isfeature', { locale: lang })}</Text>
                        <Text style={[commonStyles.label, { textAlign: textline}]}>*</Text>
                    </View>
                    <Switch
                        value={is_feature}
                        onValueChange={(val) =>
                            this.setState({ is_feature : val ? "2" : "0"})
                        }
                        disabled={false}
                        activeText={'On'}
                        inActiveText={'Off'}
                        backgroundActive={'green'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'#30a566'}
                        circleInActiveColor={'#000000'}
                        />
                </View>
                <TouchableWithoutFeedback style={[commonStyles.feature,{paddingTop:10,paddingRight:10, flexDirection: direction}]} onPress={()=> this.setState({
                        is_weekend : !this.state.is_weekend
                    })}>
                    <View style={{ flexDirection: direction}}>
                        <Text style={[commonStyles.label, { textAlign: textline, width:width-60}]}>{I18n.t('vendoraddservice.weekendlabel', { locale: lang })} *</Text>
                        <Icon name={is_weekend_work} size={20} style={{marginTop:8}}/>
                    </View>
                </TouchableWithoutFeedback>

                {Platform.OS === 'ios'? <KeyboardSpacer/> : undefined}
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                        <CirclesLoader />
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(AddService);
