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
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import { SegmentedControls } from 'react-native-radio-buttons';
import RNFetchBlob from 'react-native-fetch-blob';
import SelectedImage from './SelectedImage';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = 'Select Category'
const { width, height } = Dimensions.get('window');
const INITIAL_STATE = { quantity: '',  Size: ''}

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            avatarSource: null,
            product_category: '',
            options : ['0','1'],
            optionsAvailable: [],
            u_id: null,
            user_type : null,
            country : null,
            visibleModal: false,
            additional: false,
            height : '',
            productname : '',
            product_name_in_arabic: '',
            detaildescription : '',
            short_description_in_arabic: '',
            detail_description_in_arabic: '',
            price_in_arabic: '',
            special_price_in_arabic: '',
            shortdescription : '',
            price : '',
            special : '',
            quantity : '',
            Size : '',
            quantityRows : [],
            sizeRows : [],
            rows : [] ,
            Imagepath : [],
            is_feature : 0,
            gender : '',
            languageChoose: ''
        }
        this.inputs = {};
        this.chips = {};
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }
    focusNextField(id) {
        this.inputs[id].focus();
    }
    focuschipField(id) {
        this.chips[id].focus();
    }
    showActionSheet() {
        this.ActionSheet.show()
    }
    handlePress(i) {
        this.setState({
            product_category: i
        })
    }
    componentDidMount(){
        this.getKey()
        .then(()=>this.getCategory())
        .done();
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton, left :  this._renderLeftButton, hideNavBar: false });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow () {
        routes.refresh ({hideTabBar: true})
    }
    _keyboardDidHide () {
        routes.refresh ({hideTabBar: false})
    }
   _renderLeftButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };
   _renderRightButton = () => {
       const { lang} = this.props;
        return(
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
    getCategory(){
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
        fetch(Utils.gurl('categoryList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.response.status){
                var data = responseData.response.data,
                length = data.length,
                optionsList= []
                optionsList.push('Cancel');
                for(var i=0; i < length; i++) {
                    order = data[i];
                    category_name = order.category_name;
                    optionsList.push(category_name);
                }
                this.setState({
                    options : optionsList,
                    optionsAvailable : responseData.response.data
                })
            }
        })
        .catch((errorMessage, statusCode) => {
            console.log(errorMessage);
        })
        .done();
    }
    validate(){
        const { product_category , productname,
            shortdescription, detaildescription, price,
            discount,final_price, quantityRows,
            Size, quantity, is_feature, Imagepath , special, rows ,sizeRows,
            product_name_in_arabic, short_description_in_arabic,
            detail_description_in_arabic,price_in_arabic, special_price_in_arabic
        } = this.state;
        const { lang} = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        let path = Imagepath.length
        if(path < 1){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.imageuploaderr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!productname.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.productnmempty', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!shortdescription.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.provideshortdesc', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!detaildescription.length){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.providedetaildesc', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!price){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.provideprice', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!special){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.providespprice', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if ( special > price){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.sppriceerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!quantityRows.length > 0){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.quantityerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!sizeRows.length > 0){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.sizeerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!product_name_in_arabic.length > 0){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.productname_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!short_description_in_arabic.length > 0){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.shortdesc_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!detail_description_in_arabic.length > 0){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.detaildesc_ar_err', { locale: lang }),
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
        const {
            productname, product_category,
            shortdescription, detaildescription, price,
            discount,final_price, quantityRows,
            Size, quantity, is_feature, Imagepath ,
            special, rows ,sizeRows, u_id, country, gender,
            product_name_in_arabic, short_description_in_arabic,
            detail_description_in_arabic,price_in_arabic, special_price_in_arabic
        } = this.state;
        if (gender === '') {
            let genderty = "";
        } else {
            let genderty= gender.label == "Male" ? 1 : 0
        }

        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';
            if(this.validate()) {
                var productcategory = product_category ? this.state.optionsAvailable.find(x => x.category_name === this.state.options[this.state.product_category]).category_id : null;
                this.setState({
                    visibleModal : true
                });

                RNFetchBlob.fetch('POST', Utils.gurl('productAdd'),{
                    Authorization : "Bearer access-token",
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                [...Imagepath,
                    { name : 'u_id', data: String(u_id)},
                    { name : 'country', data: String(country)},
                    { name : 'product_category', data: String(productcategory)},
                    { name : 'product_name', data: String(productname)},
                    { name : 'product_name_in_arabic', data: String(product_name_in_arabic)},
                    { name : 'short_description', data: String(shortdescription)},
                    { name : 'short_description_in_arabic', data: String(short_description_in_arabic)},
                    { name : 'detail_description', data: String(detaildescription)},
                    { name : 'detail_description_in_arabic', data: String(detail_description_in_arabic)},
                    { name : 'price', data: String(price)},
                    { name : 'price_in_arabic', data: String(price)},
                    { name : 'special_price', data: String(special)},
                    { name : 'special_price_in_arabic', data: String(special)},
                    { name : 'discount', data: String(10)},
                    { name : 'final_price', data: String(special)},
                    { name: 'quantity',data: "10"},
                    { name : 'quantity_for_product_size', data: quantityRows.toString()},
                    { name : 'size', data: sizeRows.toString()},
                    { name : 'is_feature', data: String(is_feature)},
                    { name : 'gender', data: String(genderty)},
                ])
                .uploadProgress((written, total) => {
                    console.log('uploaded', Math.floor(written/total*100) + '%')
                })
                .then((res)=>{
                    console.log(res.data);
                    MessageBarManager.showAlert({
                        message: I18n.t('vendoraddproduct.productadded', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                })
                .then(()=> this.setState({
                    visibleModal : false
                })
            )
            .then(()=>routes.product())
            .catch((errorMessage, statusCode) => {
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
                let path = (Platform.OS === 'ios') ? url.replace(/^file:\/\//, '') : response.uri
                let source = {
                    name : 'product_images[]',
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
    setSelectedOption(option){
        this.setState({
            gender: option,
        });
    }
    onSelect(index, value){
        this.setState({
            languageChoose: value
        })
    }
    productCont(){
        Keyboard.dismiss();
        const { quantity, Size} = this.state;

        if(quantity !== "" && Size != "")
        {
            var newStateArray = this.state.quantityRows.slice();
            var newsizeArray = this.state.sizeRows.slice();
            newStateArray.push(quantity);
            newsizeArray.push(Size);
            this.setState({...INITIAL_STATE,
                quantityRows: newStateArray,
                sizeRows: newsizeArray,
                additional : false
            });
        }else{

        }
    }
    textInputFocused(){
        console.log("focused");
        this.refs.scrView.scrollToOffset({animated:false,offset:100});
    }
    render() {
        const { imageSelect, quantityRows, sizeRows, languageChoose} = this.state;
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left',
        langIndex = lang == 'ar'? '1': '0',
        options = [
			{ label:I18n.t('userregister.male', { locale: lang }), value: I18n.t('userregister.male', { locale: lang })},
			{ label:I18n.t('userregister.female', { locale: lang }), value: I18n.t('userregister.female', { locale: lang })},
			// { label:I18n.t('userregister.other', { locale: lang }), value: I18n.t('userregister.other', { locale: lang })},
		];
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';
        let is_feature;
        if(this.state.is_feature === '0' ){ is_feature = false} else { is_feature = true}
        return (
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: 'transparent',
                    margin :10,
                    paddingBottom:30}
                }//commonStyles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}
                automaticallyAdjustContentInsets={false}
                directionalLockEnabled = {true}
                horizontal = {false}
                ref={'scrView'}>

                <KeyboardAwareScrollView>
                    <View style={commonStyles.ImageAdd}>
                        <Text style={{color: borderColorImage, marginBottom : 10, textAlign: textline}}>{I18n.t('vendoraddproduct.selectprodimg', { locale: lang })}</Text>
                        <Text style={{color: "#696969", fontSize:12, marginBottom : 5,textAlign: textline}}>{I18n.t('vendoraddproduct.clickimgtoupload', { locale: lang })}</Text>
                        <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#a9d5d1'}}>
                            <Feather
                                onPress={this.selectPhotoTapped.bind(this)}
                                name="upload-cloud" size= {30} style={{padding :30, marginBottom:20 }} />
                        </View>
                        <View style={{  top: 10, flexDirection:'row'}}>
                            { this.state.avatarSource === null ? undefined :
                                <SelectedImage
                                    productImages={this.state.rows}/>}
                        </View>
                        <TouchableOpacity style={commonStyles.addCat} onPress={this.showActionSheet}>
                            <Text style={{textAlign: textline}}>{ this.state.product_category ? this.state.options[this.state.product_category] : I18n.t('vendoraddproduct.addproductcategory', { locale: lang })}</Text>
                            <ActionSheet
                                ref={o => this.ActionSheet = o}
                                title={title}
                                options={this.state.options}
                                cancelButtonIndex={CANCEL_INDEX}
                                // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={this.handlePress}/>
                        </TouchableOpacity>
                    </View>
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
                            <Text> {I18n.t('vendoraddproduct.english', { locale: lang })}</Text>
                        </RadioButton>
                        <RadioButton value='ar'>
                            <Text> {I18n.t('vendoraddproduct.arabic', { locale: lang })}</Text>
                        </RadioButton>
                    </RadioGroup>
                    <View style={commonStyles.formItems}>
                        {/* --------------------------Product name start-----------*/}
                        {(languageChoose === 'ar') ?
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.productnamelbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.product_name_in_arabic}
                                    // onFocus={()=>this.hidetab()}
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.productname', { locale: languageChoose })}
                                    maxLength={140}
                                    onSubmitEditing={() => {
                                        this.focusNextField('two');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['one'] = input;
                                    }}
                                    onChangeText={(product_name_in_arabic) => this.setState({product_name_in_arabic})}
                                    />
                            </View>
                            :
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.productnamelbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.productname}
                                    // onFocus={()=>this.hidetab()}
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.productname', { locale: languageChoose })}
                                    maxLength={140}
                                    onSubmitEditing={() => {
                                        this.focusNextField('two');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['one'] = input;
                                    }}
                                    onChangeText={(productname) => this.setState({productname})}
                                    />
                            </View>
                        }
                        {/* --------------------------Product name end-----------*/}
                        {/* --------------------------short description start-----------*/}
                        {(languageChoose === 'ar') ?
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.shortdesclbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{  textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.short_description_in_arabic}
                                    // onFocus={this.textInputFocused.bind(this)}
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.shortdesc', { locale: languageChoose })}
                                    maxLength={140}
                                    onSubmitEditing={() => {
                                        this.focusNextField('three');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['two'] = input;
                                    }}
                                    onChangeText={(short_description_in_arabic) => this.setState({short_description_in_arabic})}
                                    />
                            </View>
                            :
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.shortdesclbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.shortdescription}
                                    // onFocus={this.textInputFocused.bind(this)}
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.shortdesc', { locale: languageChoose })}
                                    maxLength={140}
                                    onSubmitEditing={() => {
                                        this.focusNextField('three');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['two'] = input;
                                    }}
                                    onChangeText={(shortdescription) => this.setState({shortdescription})}
                                    />
                            </View>
                        }
                        {/* --------------------------short description end-----------*/}
                        {/* --------------------------detail description start-----------*/}
                        { languageChoose === 'ar' ?
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.detaildesclbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height),  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.detail_description_in_arabic}
                                    numberOfLines={3}
                                    multiline
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.detaildesc', { locale: languageChoose })}
                                    maxLength={140}
                                    onSubmitEditing={() => {
                                        this.focusNextField('four');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['three'] = input;
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
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.detaildesclbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height),  textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.detaildescription}
                                    numberOfLines={3}
                                    multiline
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.detaildesc', { locale: languageChoose })}
                                    maxLength={140}
                                    onSubmitEditing={() => {
                                        this.focusNextField('four');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['three'] = input;
                                    }}
                                    onContentSizeChange={(event) => {
                                        this.setState({height: event.nativeEvent.contentSize.height});
                                    }}
                                    onChangeText={(detaildescription) => this.setState({detaildescription})}
                                    />
                            </View>
                        }
                        {/* --------------------------detail description end-----------*/}
                        {/* --------------------------Price start-----------*/}
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.pricelbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.price}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid = 'transparent'
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.price', { locale: languageChoose })}
                                    maxLength={7}
                                    onSubmitEditing={() => {
                                        this.focusNextField('five');
                                    }}
                                    returnKeyType={ "next" }
                                    ref={ input => {
                                        this.inputs['four'] = input;
                                    }}
                                    onChangeText={(price) => this.setState({price})}
                                    />
                            </View>
                        {/* --------------------------Price end-----------*/}
                        {/* --------------------------Special price start-----------*/}
                            <View style={commonStyles.textField}>
                                <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.sppricelbl', { locale: languageChoose })}</Text>
                                    <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                                </View>
                                <TextInput
                                    style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left'}]}
                                    value={this.state.special}
                                    underlineColorAndroid = 'transparent'
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                    placeholder={I18n.t('vendoraddproduct.spprice', { locale: languageChoose })}
                                    maxLength={7}
                                    returnKeyType={"done" }
                                    ref={ input => {
                                        this.inputs['five'] = input;
                                    }}
                                    onChangeText={(special) => this.setState({special})}
                                    />
                            </View>
                        {/* --------------------------Special price end-----------*/}

                        <View style={{borderBottomWidth: 0.5, borderColor: '#fbcdc5'}}>
                            <Text/>
                            <SegmentedControls
                                tint= {'#a9d5d1'}
                                selectedTint= {'white'}
                                backTint= {'#fff'}
                                optionStyle= {{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    // fontFamily: 'Snell Roundhand'
                                    alignItems: align
                                }}

                                containerStyle= {{
                                    marginLeft: 10,
                                    marginRight: 10,
                                }}
                                options={ options }
                                onSelection={ this.setSelectedOption.bind(this) }
                                selectedOption={ this.state.gender }
                                extractText={ (option) => option.label }
                                testOptionEqual={ (a, b) => {
                                    if (!a || !b) {
                                        return false;
                                    }
                                    return a.label === b.label
                                }
                            }/>
                            <Text/>
                        </View>
                        <View style={[commonStyles.feature,{paddingTop:10,paddingRight:10, flexDirection: direction}]}>
                            <View style={{ flexDirection: direction}}>
                                <Text style={[commonStyles.label, { textAlign: textline}]}>{I18n.t('vendoraddproduct.isfeature', { locale: lang })}</Text>
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
                        <Text style={[commonStyles.label, {textAlign: textline}]}>
                            {I18n.t('vendoraddproduct.sizequantitymsg', { locale: lang })}
                        </Text>
                        <View style={[commonStyles.chip, { flexDirection: direction}]}>
                            <View>
                                <View style={[commonStyles.textField, {flexDirection: direction}]}>
                                    <Text style={commonStyles.label}>{I18n.t('vendoraddproduct.quantitylbl', { locale: lang })}</Text>
                                    <Text style={commonStyles.label}>*</Text>
                                    <Text style={{ color : '#000', left : 20 }}>{quantityRows.toString()}</Text>
                                </View>
                                <View style={[commonStyles.textField, {flexDirection: direction}]}>
                                    <Text style={commonStyles.label}>{I18n.t('vendoraddproduct.sizelbl', { locale: lang })}</Text>
                                    <Text style={commonStyles.label}>*</Text>
                                    <Text style={{ color : '#000',left : 20}}>{sizeRows.toString()}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{
                                    backgroundColor : '#ccc',
                                    padding : 10,
                                    borderRadius : 3,
                                    top : 5
                                }}
                                onPress={() => this.setState({ additional: true,})}>
                                <Text style={{fontSize : 12, textAlign: textline}}>{I18n.t('vendoraddproduct.sizequantitybtn', { locale: lang })}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Modal isVisible={this.state.additional}>
                        <View style={{ padding:10, backgroundColor : '#fff'}}>
                            <Text style={{color :"#a9d5d1", fontWeight : 'bold', bottom : 10, textAlign: 'center'}}>{I18n.t('vendoraddproduct.sizequantitybtn', { locale: lang })}</Text>
                            <View style={{flexDirection: direction, width: '90%'}}>
                                <Text style={{color :"#a9d5d1" ,bottom : 10}}>{I18n.t('vendoraddproduct.quantitylbl', { locale: lang })}</Text>
                                <Text style={{color :"#a9d5d1" ,bottom : 10}}>:</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputs, { bottom : 20,  textAlign: textline, width: '90%'}]}
                                value={this.state.quantity}
                                underlineColorAndroid = 'transparent'
                                autoCorrect={false}
                                keyboardType={'numeric'}
                                placeholder={I18n.t('vendoraddproduct.quantitylbl', { locale: lang })}
                                maxLength={3}
                                onSubmitEditing={() => {
                                    this.focusNextField('two');
                                }}
                                returnKeyType={ "next" }
                                ref={ input => {
                                    this.inputs['one'] = input;
                                }}
                                onChangeText={(quantity) => this.setState({quantity})}
                                />
                            <View style={{flexDirection: direction, width: '90%'}}>
                                <Text style={{color :"#a9d5d1" ,bottom : 10}}>{I18n.t('vendoraddproduct.sizelbl', { locale: lang })}</Text>
                                <Text style={{color :"#a9d5d1" ,bottom : 10}}>:</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputs, {bottom : 20,  textAlign: textline, width: '90%'}]}
                                value={this.state.Size}
                                underlineColorAndroid = 'transparent'
                                autoCorrect={false}
                                keyboardType={'default'}
                                placeholder={I18n.t('vendoraddproduct.sizelbl', { locale: lang })}
                                maxLength={15}
                                onSubmitEditing={() => {
                                }}
                                returnKeyType={ "next" }
                                ref={ input => {
                                    this.inputs['two'] = input;
                                }}
                                onChangeText={(Size) => this.setState({Size})}
                                />
                            <View style={{flexDirection: direction, justifyContent: 'space-around'}}>
                                <Button title={I18n.t('vendoraddproduct.cancel', { locale: lang })} onPress={()=>this.setState({
                                        additional : false
                                    })} color="#a9d5d1"/>
                                <Button title={I18n.t('vendoraddproduct.submit', { locale: lang })}  onPress={()=>this.productCont()} color="#a9d5d1"/>
                            </View>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.visibleModal}>
                        <View style={{alignItems : 'center', padding:10}}>
                            <CirclesLoader />
                        </View>
                    </Modal>
                    {Platform.OS === 'ios'? <KeyboardSpacer/> : undefined}
                </KeyboardAwareScrollView>
            </ScrollView>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(AddProduct);
