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
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import { SegmentedControls } from 'react-native-radio-buttons';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

const { width, height } = Dimensions.get('window');

class EditProduct extends Component {
    constructor(props) {
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            avatarSource: null,
            product_category: this.props.product_category,
            u_id: this.props.u_id,
            country : this.props.country,
            visibleModal: false,
            editSizeModal:false,
            height : '',
            productname : this.props.product_name,
            detaildescription : this.props.detail_description,
            shortdescription : this.props.short_description,
            price : this.props.price,
            special : this.props.special_price,
            Size : this.props.size,
            quantityRows : this.props.quantity,
            sizeRows : this.props.size,
            product_name_in_arabic: this.props.product_name_in_arabic,
            short_description_in_arabic: this.props.short_description_in_arabic,
            detail_description_in_arabic: this.props.detail_description_in_arabic,
            rows : [] ,
            Imagepath : [],
            is_feature : this.props.is_feature ,
            removed_images : [],
            quasize : [],
            size_id :[],
            Quantity:[],
            Size_ar :[],
            languageChoose: ''
        }
        this.inputs = {};
        this.handlePress = this.handlePress.bind(this)
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
    handlePress(i) {
        this.setState({
            product_category: i
        })
    }
    setSelectedOption(option){
        this.setState({
            gender: option,
        });
    }
    getSizeandQuan(sizeRows){
        this.setState({sizeRows}, ()=> this.productCont());
    }
    componentDidMount(){
        var Items = this.props.productImages,
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
        this.productCont();
    }
    validate(){
        const {
            productname, shortdescription, detaildescription, price, discount,final_price, quantityRows, product_name_in_arabic,
            short_description_in_arabic, detail_description_in_arabic, Size, quantity, is_feature, Imagepath , special, rows ,sizeRows,gender
        } = this.state;
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        let path = rows.length
        // if(path < 1){
        //     MessageBarManager.showAlert({
        //         message: I18n.t('vendoraddproduct.imageuploaderr', { locale: lang }),
        //         alertType: 'extra',
        //         title:'',
        //         titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //         messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        //     })
        //     return false
        // }
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
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align}
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
        if ( parseInt(special) > parseInt(price)){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.sppriceerr', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        // if ( gender === undefined ){
        //     MessageBarManager.showAlert({
        //         message: I18n.t('userregister.pleaseselectgender', { locale: lang }),
        //         alertType: 'extra',
        //         title:'',
        //         titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //         messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        //     })
        //     return false
        // }
        if (!product_name_in_arabic){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.productname_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!short_description_in_arabic){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.shortdesc_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!detail_description_in_arabic){
            MessageBarManager.showAlert({
                message: I18n.t('vendoraddproduct.detaildesc_ar_err', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        return true
    }
    uploadTocloud(){
        const {
            product_category , productname, product_name_in_arabic,
            short_description_in_arabic, detail_description_in_arabic,
            shortdescription, detaildescription, price,
            discount,final_price, quantityRows,
            Size, quantity, is_feature, Imagepath , special, rows ,sizeRows, removed_images,
            size_id, Quantity, Size_ar, gender
        } = this.state;
        const { u_id, country,lang, product_id} = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        if(this.validate()) {
            let genderty;

            if (gender == undefined) {
                genderty = "";
            } else {
                genderty= gender.label == "Male" ? 1 : 0
            }

            this.setState({
                visibleModal : true
            });
            RNFetchBlob.fetch('POST', Utils.gurl('editProduct'),{
                Authorization : "Bearer access-token",
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            [...Imagepath,
                { name : 'u_id', data: String(u_id)},
                { name : 'product_category', data: String(product_category)},
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
                { name : 'country', data: String(country)},
                { name : 'product_id', data: String(this.props.product_id)},
                { name : 'removed_images', data: removed_images.toString()},
                { name : 'quantity_for_product_size', data: quantityRows.toString()},
                { name : 'size_id', data: size_id.toString()},
                { name : 'size', data: Size_ar.toString()},
                { name : 'quantity', data: Quantity.toString()},
                { name : 'is_feature', data: String(is_feature)},
                { name : 'gender', data: String(genderty)},
            ])
            .uploadProgress((written, total) => {
                console.log('uploaded', Math.floor(written/total*100) + '%')
            })
            .then((res)=>{
                var getdata = JSON.parse(res.data);
                console.log(getdata);
                if(getdata.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('vendoraddproduct.productupdadded', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                    this.setState({
                        visibleModal : false
                    })
                    routes.product()
                }else{
                    MessageBarManager.showAlert({
                        message: I18n.t('vendoraddproduct.updatefail', { locale: lang }),
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
            // .then(()=>routes.product())
            .catch((error, statusCode) => {
                MessageBarManager.showAlert({
                    message: I18n.t('vendoraddproduct.errorwhileUpload', { locale: lang }),
                    alertType: 'extra',
                    title:'',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
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
                    name : 'product_images[]',
                    filename : response.fileName,
                    data: RNFetchBlob.wrap(path),
                    uri: response.uri ,
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
    productCont(){
        const { quantity, sizeRows} = this.state;
        let sizelength = sizeRows.length;
        let Size_ID =[];
        let Quantity =[];
        let Size_ar =[];
        for (var i = 0; i < sizelength; i++) {
            Size_ID.push( sizeRows[i].size_id );
            Quantity.push( sizeRows[i].quantity );
            Size_ar.push( sizeRows[i].size );
        }
        this.setState({
            size_id : Size_ID,
            Quantity : Quantity,
            Size_ar : Size_ar
        })
        // console.warn(Size_ID);
        // console.warn(Quantity);
        // console.warn(Size_ar);
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
        const { imageSelect, quantityRows, sizeRows, languageChoose} = this.state;
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left',
        options = [
            { label:I18n.t('userregister.male', { locale: lang }), value: I18n.t('userregister.male', { locale: lang })},
            { label:I18n.t('userregister.female', { locale: lang }), value: I18n.t('userregister.female', { locale: lang })},
            // { label:I18n.t('userregister.other', { locale: lang }), value: I18n.t('userregister.other', { locale: lang })},
        ];
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';
        let is_feature;
        if(this.state.is_feature === '0' ){
            is_feature = false
        } else {
            is_feature = true
        }
        let sizeArr = [];
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
                <View style={commonStyles.formItems}>
                    {/* --------------------------Product name start-----------*/}
                    {
                        (languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.productnamelbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
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
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
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
                    {/* --------------------------shortdescription start-----------*/}
                    {
                        (languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.shortdesclbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
                                value={this.state.short_description_in_arabic}
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
                                style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
                                value={this.state.shortdescription}
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
                    {/* --------------------------shortdescription ends-----------*/}
                    {/* --------------------------detaildescription start-----------*/}
                    {
                        (languageChoose === 'ar') ?
                        <View style={commonStyles.textField}>
                            <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.detaildesclbl', { locale: languageChoose })}</Text>
                                <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                            </View>
                            <TextInput
                                style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height), textAlign: languageChoose == 'ar'? 'right': 'left', paddingRight:10}]}
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
                            style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height), textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10}]}
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
                {/* --------------------------detaildescription ends-----------*/}
                <View style={commonStyles.textField}>
                    <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                        <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.pricelbl', { locale: languageChoose })}</Text>
                        <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                    </View>
                    <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10, paddingRight:10}]}
                        value={this.state.price}
                        keyboardType={'numeric'}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder={I18n.t('vendoraddproduct.pricelbl', { locale: languageChoose })}
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
                <View style={commonStyles.textField}>
                    <View style={{ width: '100%', flexDirection: languageChoose == 'ar'?'row-reverse': 'row'}}>
                        <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>{I18n.t('vendoraddproduct.sppricelbl', { locale: languageChoose })}</Text>
                        <Text style={[commonStyles.label,{ textAlign: languageChoose == 'ar'? 'right': 'left'}]}>*</Text>
                    </View>
                    <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, textAlign: languageChoose == 'ar'? 'right': 'left', paddingLeft:10, paddingRight:10}]}
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
                        }}
                        />
                    <Text/>
                </View>
                <View style={[commonStyles.feature, { flexDirection: direction}]}>
                    <View style={{ width: '80%', flexDirection: direction}}>
                        <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddproduct.isfeature', { locale: lang })}</Text>
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
                <UpdateQuan
                    lang={lang}
                    sizeRows={sizeRows}
                    callback={this.getSizeandQuan.bind(this)}
                    />
                <View style={{  top: 10, marginBottom : 10 ,flexDirection:direction}}>
                    {
                        Platform.OS === 'ios' ?
                        <TouchableOpacity
                            onPress={this.selectPhotoTapped.bind(this)}>
                            <View style={{ }}>
                                <Feather
                                    name="upload-cloud" size= {30} style={{ padding:20 }}/>
                                <Text>{I18n.t('vendoraddproduct.click', { locale: lang })}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableNativeFeedback
                            onPress={this.selectPhotoTapped.bind(this)}
                            background={TouchableNativeFeedback.SelectableBackground()}>
                            <View style={{ justifyContent: 'center'}}>
                                <Feather
                                    name="upload-cloud" size= {30} style={{ padding:20 }}/>
                                <Text>{I18n.t('vendoraddproduct.click', { locale: lang })}</Text>
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
                <Text style={{color : '#fff', fontWeight:'bold'}}>Edit Product</Text>
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
class UpdateQuan extends Component {
    constructor(props) {
        super(props);
        this.state={
            size : "",
            quantity:"",
            editSizeModal: this.props.editSizeModal,
            sizeRows : this.props.sizeRows
        }
        this.inputs = {};
    }
    focusNextField(id) {
        this.inputs[id].focus();
    }
    concatAndDeDuplicateObjectsDeep = (p, ...arrs) => [ ...new Set( [].concat(...arrs).map(a => JSON.stringify(a)) ) ].map(a => JSON.parse(a))
    editSize(size_id, size, quantity){
      this.setState({
          size_id:size_id,
          size:size,
          quantity:quantity,
          editSizeModal:true
      });
    }
    newSize(){
      this.setState({
          size_id:0,
          size:"",
          quantity:"",
          editSizeModal:true
      });
    }
    updateQuantity(){
        let arr2 = [];
        arr2.push({
            size_id: this.state.size_id,
            size: this.state.size,
            quantity: this.state.quantity
        });
        let arr1 = this.state.sizeRows;
        let newOne = this.concatAndDeDuplicateObjectsDeep('size_id', arr2, arr1 );
        let newsome = newOne.reduce((x, y) => x.findIndex(e => e.size_id==y.size_id) < 0 ? [...x, y]: x, [])
        this.setState({
            editSizeModal : false,
            sizeRows: newsome
        })
        this.props.callback(newsome);
    }
    render(){
        const { lang} = this.props,
        direction = lang === 'ar' ? "row-reverse" : "row",
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        let { sizeRows} = this.state;
        return(
            <View>
                <View>
                    <TouchableOpacity
                                onPress={() => this.newSize()}>
                                <View style={{flexDirection:'row', alignItems:'center', marginRight:10,marginBottom:10}}>
                                    <Text style={{color:'#a9d5d1'}}>{I18n.t('vendoraddproduct.sizequantitybtn', { locale: lang })}</Text>
                                    <Icon style={{padding:5}} name='add' size={25} color="#a9d5d1" />
                                </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection:'row', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Text style={{ alignSelf: 'center'}}>#Id</Text>
                        <Text style={{ alignSelf: 'center'}}>Size</Text>
                        <Text style={{ alignSelf: 'center'}}>Quantity</Text>
                        <Text style={{ alignSelf: 'center'}}>Action</Text>
                    </View>
                    {
                        sizeRows.map((prop, key) => { return (
                            <View style={{flex:1,flexDirection:'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                  <Text style={{ alignSelf: 'center'}}>{prop.size_id} </Text>
                                  <Text style={{ alignSelf: 'center'}}> {prop.size} </Text>
                                  <Text style={{ alignSelf: 'center'}}> {prop.quantity} </Text>
                              <View>
                                <TouchableOpacity
                                onPress={() => this.editSize(prop.size_id, prop.size, prop.quantity)}>
                                    <Icon style={{padding:5}} name='create' size={25} color="#a9d5d1" />
                                </TouchableOpacity>
                              </View>
                            </View>
                        );
                        })
                    }
                </View>
                <Modal isVisible={this.state.editSizeModal}>
                  <View style={{ padding:10, backgroundColor : '#fff', borderRadius:5}}>
                      <Text style={{color :"#a9d5d1", fontWeight : 'bold', bottom : 10, textAlign: 'center', marginTop:10}}>Edit Quantity & Size</Text>
                      <View style={{flexDirection: direction, width: '90%', marginTop:10}}>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>Quantity</Text>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>:</Text>
                      </View>
                        <TextInput
                          style={[commonStyles.inputs, { bottom : 20,  textAlign: textline, width: '90%', marginTop:5, paddingLeft:5}]}
                          value={this.state.quantity}
                          underlineColorAndroid = 'transparent'
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          placeholder="Quantity"
                          maxLength={3}
                          onChangeText={(quantity) => this.setState({quantity})}
                          onSubmitEditing={() => {
                              this.focusNextField('two');
                            }}
                            returnKeyType={ "next" }
                            ref={ input => {
                              this.inputs['one'] = input;
                            }}/>
                  <View style={{flexDirection: direction, width: '90%'}}>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>Size</Text>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>:</Text>
                      </View>
                      <TextInput
                          style={[commonStyles.inputs, {bottom : 20,  textAlign: textline, width: '90%', marginTop:5, paddingLeft:5}]}
                          value={this.state.size}
                          underlineColorAndroid = 'transparent'
                          autoCorrect={false}
                          keyboardType={'default'}
                          placeholder="Size"
                          maxLength={15}
                          returnKeyType={ "done" }
                          ref={ input => {
                              this.inputs['two'] = input;
                          }}
                          onChangeText={(size) => this.setState({size})}
                      />
                  <View style={{flexDirection: direction, justifyContent: 'space-around'}}>
                      <Button title={I18n.t('vendoraddproduct.cancel', { locale: lang })} onPress={()=>this.setState({
                                  editSizeModal : false
                              })} color="#a9d5d1"/>
                      <Button title={I18n.t('vendoraddproduct.submit', { locale: lang })}   color="#a9d5d1"
                          onPress={()=>this.updateQuantity()}
                          // onPress={()=>this.setState({ editSizeModal : false })}
                              />
                  </View>
              </View>
              </Modal>
            </View>
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
export default connect(mapStateToProps)(EditProduct);
