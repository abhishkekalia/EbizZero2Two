import React, { Component } from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
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
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EventEmitter from "react-native-eventemitter";

const { width, height } = Dimensions.get('window');
class EditService extends Component {
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
            service_name_in_arabic : this.props.service_name_in_arabic,
            short_description_in_arabic : this.props.short_description_in_arabic,
            detail_description_in_arabic : this.props.detail_description_in_arabic,
            detail_description : this.props.detail_description,
            short_description : this.props.short_description,
            price : this.props.price,
            special_price : this.props.special_price,
            rows : [] ,
            Imagepath : [],
            removed_images : [],
            languageChoose: '',
            is_feature:0,
            is_weekend:this.props.is_weekend,
            is_weekend_work :this.props.is_weekend
        }
        this.inputs = {};
        this.onSelect = this.onSelect.bind(this)
    }
    onSelect(index, value){
        this.setState({
            languageChoose: value
        })
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
    validate(){
        const {
            service_type , service_name, service_name_in_arabic, short_description_in_arabic, detail_description_in_arabic,
            short_description, detail_description, price, special_price,Imagepaths, Imagepath
        } = this.state;
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        let path = Imagepath.length
        // if(path < 1){
        //     MessageBarManager.showAlert({
        //         message: I18n.t('vendoraddservice.imageuploaderr', { locale: lang }),
        //         alertType: 'extra',
        //         title:'',
        //         titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //         messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        //     })
        //     return false
        //     }

        if (!service_type.length){
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
                message: I18n.t('vendoraddservice.servicetypeerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!special_price){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.servicetypeerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false

        }
        if ( special_price > price){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddservice.servicetypeerr', { locale: lang }),
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
        const { service_type , service_name, service_name_in_arabic, short_description_in_arabic, detail_description_in_arabic,
            short_description, detail_description, price,
            special_price, Imagepath, removed_images,is_feature,is_weekend, is_weekend_work
        } = this.state;
        const { u_id, country, lang, service_id } = this.state,
        align = (lang === 'ar') ?  'right': 'left';

        console.log("u_id", u_id);
        console.log("country", country);
        console.log("service_type", service_type);
        console.log("service_name", service_name);
        console.log("service_name_in_arabic", service_name_in_arabic);
        console.log("short_description", short_description);
        console.log("short_description_in_arabic", short_description_in_arabic);
        console.log("detail_description", detail_description);
        console.log("detail_description_in_arabic", detail_description_in_arabic);
        console.log("price", price);
        console.log("special_price", special_price);
        console.log("service_id", service_id);
        console.log("removed_images", removed_images);
        console.log("is_feature", is_feature);
        console.warn("is_weekend_work", is_weekend);
        if(this.validate()) {
            this.setState({
                visibleModal : true
            });
            console.log(Imagepath);
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
                { name : 'service_name_in_arabic', data: String(service_name_in_arabic)},
                { name : 'short_description', data: String(short_description)},
                { name : 'short_description_in_arabic', data: String(short_description_in_arabic)},
                { name : 'detail_description', data: String(detail_description)},
                { name : 'detail_description_in_arabic', data: String(detail_description_in_arabic)},
                { name : 'price', data: String(price)},
                { name : 'price_in_arabic', data: String(price)},
                { name : 'special_price_in_arabic', data: String(special_price)},
                { name : 'special_price', data: String(special_price)},
                { name : 'service_id', data: String(service_id)},
                { name : 'removed_images', data: removed_images.toString()},
                { name : 'is_feature', data: String(is_feature)},
                { name : 'is_weekend', data: String(is_weekend)},
            ])
            .uploadProgress((written, total) => {
                console.log('uploaded', Math.floor(written/total*100) + '%')
            })
            .then((res)=>{
                console.log(res);
                var getdata = JSON.parse(res.data);
                if(getdata.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('vendoraddservice.updateSuccess', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                    this.setState({
                        visibleModal : false
                    })
                    EventEmitter.emit("serviceList")
                    routes.service();
                }else{
                    MessageBarManager.showAlert({
                        message: I18n.t('vendoraddservice.updateSuccess', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                    this.setState({
                        visibleModal : false
                    })
                }
            })
            .catch((errorMessage, statusCode) => {
                // console.warn(errorMessage);
                // routes.service();
                MessageBarManager.showAlert({
                    message: I18n.t('vendoraddservice.updatefail', { locale: lang }),
                    alertType: 'extra',
                    title:'',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
                this.setState({
                    visibleModal : false
                })
                console.log(errorMessage);
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
        const { lang } =this.props,
        { imageSelect, quantityRows, sizeRows, languageChoose, is_weekend} = this.state,
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d',
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';

        let is_feature;
        if(this.state.is_feature === '0' ){
            is_feature = false
        } else {
            is_feature = true
        }
        let is_weekend_work,
            weekend_work_value;
        if(is_weekend === '0'){
            is_weekend_work = "checkbox-blank-outline";
            weekend_work_value = '1';
        } else {
            is_weekend_work = "checkbox-marked";
            weekend_work_value = '0';
        }

        return (
            <ScrollView
            contentContainerStyle={commonStyles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
            <RadioGroup
                size={15}
                thickness={1}
                color='#a9d5d1'
                highlightColor='transparent'
                // selectedIndex={langIndex}
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

                <View style={[commonStyles.formItems, { paddingRight : 25}]}>
                    {/* --------------------------service Type start-----------*/}
                    {(languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.servicetypelbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5,textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                                />
                        </View>
                        :
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddservice.servicetypelbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                                />
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
                                style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                            style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height),  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                            style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height),  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                                <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                            style={[commonStyles.inputusername, { borderRadius : 5,  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
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
                    <View style={[commonStyles.feature, { flexDirection: direction}]}>
                        <View style={{ width: '80%', flexDirection: direction}}>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddservice.isfeature', { locale: lang })}</Text>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>*</Text>
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
                            circleInActiveColor={'#000000'}/>
                    </View>
                    <TouchableOpacity style={[commonStyles.feature,{paddingTop:10,paddingRight:10, flexDirection: direction}]}
                        onPress={()=> this.setState({
                            is_weekend : weekend_work_value,
                        })}>
                        <View style={{ flexDirection: direction}}>
                            <Text style={[commonStyles.label, { textAlign: textline}]}>{I18n.t('vendoraddservice.weekendlabel', { locale: lang })}</Text>
                            <Text style={[commonStyles.label, { textAlign: textline}]}>*</Text>
                        </View>
                        <Icon name={is_weekend_work} size={20}/>
                    </TouchableOpacity>

                    <View style={{  top: 10, marginBottom : 10 ,flexDirection:direction}}>
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
            <Text style={{color : '#fff', fontWeight:'bold'}}>{I18n.t('vendoraddservice.editButton', { locale: lang })}</Text>
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
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
    }
}
export default connect(mapStateToProps)(EditService);
