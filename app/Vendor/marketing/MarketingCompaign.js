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
    Alert,
    TouchableWithoutFeedback,
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
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const videoIcon = '../../images/videoIcon.png';
// const INITIAL_STATE = {avatarSource: '', ad_category: ''};
import { Picker } from 'react-native-picker-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class MarketingCompaign extends Component {
    constructor(props) {
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            videoSelect: false,
            thumbnail_image : null,
            thumblinefiletype : null,
            fileType : null,
            avatarSource: null,
            videoSource: null ,
            thumblinename : null,
            Source : '',
            uploadFileName : '',
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
        const { Source, ad_category} = this.state;
        const { lang} = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        if (!Source.length){
            MessageBarManager.showAlert({
                message: I18n.t('venderprofile.imagevideoselection', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!ad_category.length){
            MessageBarManager.showAlert({
                message: I18n.t('venderprofile.categoryerr', { locale: lang }),
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
            image,
            imageSelect ,
            imageURl ,
            avatarSource,
            videoSelect,
            u_id,
            user_type,
            country,
            amount,
            ad_category,
            thumbnail_image,
            thumblinefiletype,
            fileType,
            Source,
            uploadFileName,
            thumblinename,
        } = this.state;
        var isImage;
        const { lang} = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        if(image === 'image') {
            isImage = "1" } else { isImage = "2"}

        if(this.validate()){
            this.setState({
                visibleModal : true
            })
            console.log(thumbnail_image);
            RNFetchBlob.config({
                timeout: 600000
            }).fetch('POST', Utils.gurl('addMarketingAd'),{
                Authorization : "Bearer access-token",
                'Accept': 'application/json',
                'Content-Type': 'application/octet-stream',
            },
            [
                { name: 'path', filename: uploadFileName, type: fileType,  data: RNFetchBlob.wrap(Source) },
                { name : 'thumbnail_image',  filename : thumblinename,  type : thumblinefiletype, data: RNFetchBlob.wrap(thumbnail_image)},
                { name : 'u_id', data: String(u_id)},
                { name : 'country', data: String(country)},
                { name : 'user_type', data: String(user_type)},
                { name : 'ad_type', data: String(isImage)},
                { name : 'ad_category', data: String(ad_category)},
                { name : 'amount', data: String(amount)},
            ])
            .uploadProgress({ interval : 2 },(written, total) => {
                console.log('uploaded', Math.floor(written/total*100) + '%')
            })
            .then((responseData)=>{
                var getdata = JSON.parse(responseData.data);
                if(getdata.status){
                    routes.myAdfaturah({ uri : getdata.data.url, ad_id : getdata.data.ad_id , amount: amount })
                    this.setState({
                        visibleModal : false,
                    })
                }
            })
            .catch((errorMessage, statusCode) => {
                MessageBarManager.showAlert({
                    message: I18n.t('marketing.aduploaderr', { locale: lang }),
                    alertType: 'extra',
                    title:'',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
                this.setState({
                    visibleModal : false,
                })
                console.log("errorMessage:=",errorMessage);
            })
            .done();
        }
    }

    SelectThumbline() {
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
                let source = { uri: response.uri };
                let name = response.fileName
                let url = response.uri
                let path =
                (Platform.OS === 'ios')?
                url.replace(/^file:\/\//, '') : response.uri
                this.setState({
                    avatarSource: source,
                    thumbnail_image : path,
                    thumblinefiletype : 'image/jpg',
                    imageSelect : true,
                    videoSelect : false,
                    thumblinename : name,
                },()=>this.uploadTocloud());
            }
        });
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
                let source = { uri: response.uri };
                let name = response.fileName;
                let url = response.uri
                let path =
                (Platform.OS === 'ios')?
                url.replace(/^file:\/\//, '') : response.uri

                this.setState({
                    avatarSource: source,
                    thumbnail_image : path,
                    imageSelect : true,
                    videoSelect : false,
                    image : 'image',
                    fileType : 'image/jpg',
                    thumblinefiletype : 'image/jpg',
                    Source: path,
                    uploadFileName : name,
                    thumblinename : name,
                    amount : "1"
                },()=>this.uploadTocloud());
            }
        });
    }

    selectVideoTapped() {
        const options = {
            title: 'Video Picker',
            takePhotoButtonTitle: 'Take Video...',
            mediaType: 'video',
            videoQuality: Platform.OS === 'ios' ? 'medium' : 'low',
            durationLimit: 10,
            allowsEditing: true,
            storageOptions: {
                // skipBackup: true
                cameraRoll: true,
                waitUntilSaved: true,
            }
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
                var filename = Date.now().toString();
                // let name = filename + "." + response.uri.split('.')[1];
                let name = filename + "." + (Platform.OS === 'ios' ? (response.uri.split('.')[1]) : (response.path.split('.')[1]));
                let url = response.uri
                let path =
                (Platform.OS === 'ios')?
                url.replace(/^file:\/\//, '') : response.uri
                this.setState({
                    videoSource: path ,
                    videoSelect : true,
                    imageSelect : false,
                    image : 'video',
                    fileType : Platform.OS === 'ios' ? 'video/MOV' : 'video/mp4',
                    uploadFileName : name ,
                    Source: path,
                    amount : "1.5",
                });
                Alert.alert(
                    'Select Thumbline Image',
                    'Please Select Thumbline Image',
                    [{text: 'Cancel', onPress: () => this.onCancelPress(), style: 'cancel'},
                    {text: 'OK', onPress: () => this.SelectThumbline()},
                ],
                { cancelable: false })
            }
        });
    }
    onCancelPress(){
        this.setState({
            avatarSource: require('../../images/videoIcon.png'),
            thumbnail_image : videoIcon,
            thumblinefiletype : 'image/png',
            imageSelect : true,
            videoSelect : false,
            thumblinename : "videoIcon.png",
        });
    }

    onClickBackAction() {
        routes.pop()
    }

    render() {
        const { imageSelect , videoSelect} = this.state;
        borderColorImage= imageSelect ? "#a9d5d1" : '#fbcdc5'
        borderColorVideo= videoSelect ? "#a9d5d1" : '#fbcdc5'
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={[styles.container, { padding : 0}]}>

                {/* <View style={{
                    height:64,
                    backgroundColor:'#a9d5d1',
                }}></View> */}
                
                <View style={{
                    // flex:240,
                    backgroundColor:'#a9d5d1',
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                    width:'100%',
                    height:64,
                    flexDirection:direction,
                    }}>
                    <TouchableWithoutFeedback style={{ backgroundColor:'red'
                            }} onPress={this.onClickBackAction.bind(this)}>
                        <Ionicons name= "ios-arrow-back-outline" color="#fff" size={25} style={ lang == 'ar' ? 
                        { 
                            alignSelf: 'center', 
                            marginTop: Platform.OS === 'ios' ? 14 : 6,
                            transform: [{ rotate: '180deg'}],
                            padding:10,
                        } : 
                        { 
                            alignSelf: 'center',
                            marginTop: Platform.OS === 'ios' ? 14 : 6,
                            padding:10,
                        }}/>
                    </TouchableWithoutFeedback>
                        <Text style={{
                        fontSize:17,
                        color:'white',
                        width:width - 50 - 50,
                        marginTop:Platform.OS === 'ios' ? 20 : 0,
                        justifyContent:'center',
                        textAlign:'center',
                        alignItems:'center',
                        paddingLeft: lang === 'ar' ? 0 : 25,
                        }}>{I18n.t("venderprofile.marketing", { locale: lang })}</Text>
                    <TouchableWithoutFeedback style={{
                            }} onPress={this.uploadTocloud.bind(this)}>
                            
                        <Text style={{
                            backgroundColor : 'transparent', 
                            padding : 5, 
                            borderRadius : 5, 
                            marginBottom: 5,
                            color: '#fff', 
                            borderColor:'#fff', 
                            borderWidth:1,
                            marginTop:Platform.OS === 'ios' ? 20 : 10,
                        }}>{I18n.t('venderprofile.uploadad', { locale: lang })}</Text>
                    </TouchableWithoutFeedback>
                </View>
                
                <KeyboardAwareScrollView>
                    <View style={{
                        padding:10, 
                        flex: 1,
                    }}>
                    {/* <TouchableOpacity style={{ alignItems : align}} onPress={()=>this.uploadTocloud()}>
                        <Text style={{backgroundColor : '#ccc', padding : 10, borderRadius : 5, marginBottom: 5,color: '#fff'}}>{I18n.t('venderprofile.uploadad', { locale: lang })}</Text>
                    </TouchableOpacity> */}
                    
                    <View style={{ flex:1,
                            borderColor : '#ccc',
                            borderWidth : 1,
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            padding : 0
                        }}>
                        <Text style={{ textAlign: 'center', marginTop:20}}>{I18n.t('venderprofile.selectfiletoupload', { locale: lang })}</Text>
                        <View style={{justifyContent : "space-around",flexDirection: direction}}>
                            { this.state.avatarSource === null ?
                                <Feather name="upload-cloud" size= {30} style={{padding :20 }} />
                                :
                                <Image style={styles.avatar} source={this.state.avatarSource} />
                            }
                        </View>
                        <View style={{justifyContent : "space-around",flexDirection: direction, margin:20}}>
                            <Entypo
                                name="image"
                                size= {30}
                                color={borderColorImage}
                                onPress={this.selectPhotoTapped.bind(this)}
                                style={{padding :20 , borderColor : "#bbb", borderWidth : StyleSheet.hairlineWidth, borderRadius : 35,}} />
                            <Feather
                                name="play-circle" onPress={this.selectVideoTapped.bind(this)}
                                color={borderColorVideo}
                                size= {30}
                                style={{padding :20 , borderColor : '#bbb', borderWidth : StyleSheet.hairlineWidth, borderRadius : 35}} />
                        </View>
                        <View style={{ borderWidth : 1, borderColor : '#ccc', margin : 20, borderRadius : 5, height:40, justifyContent:'center'}}>
                            <Picker
                                mode={"dropdown"}
                                selectedValue={this.state.ad_category}
                                onValueChange={(itemValue, itemIndex) => this.setState({ad_category: itemValue})}>
                                <Picker.Item label={I18n.t('venderprofile.selectcategory', { locale: lang })} value="" />
                                <Picker.Item label={I18n.t('venderprofile.adcategory1', { locale: lang })} value="1" />
                                <Picker.Item label={I18n.t('venderprofile.adcategory2', { locale: lang })} value="2" />
                                <Picker.Item label={I18n.t('venderprofile.adcategory3', { locale: lang })} value="3" />
                                <Picker.Item label={I18n.t('venderprofile.adcategory4', { locale: lang })} value="4" />
                            </Picker>
                        </View>
                        <Text style={{ width: width-50 ,alignSelf: 'center', fontSize: 14, textAlign: 'center', margin:20}}>{I18n.t('venderprofile.addesc', { locale: lang })}
                        </Text>
                    </View>
                    <Text style={{ fontSize : 20, textAlign : 'center', color : '#a9d5d1', padding : 10, marginTop:20}}>{I18n.t('venderprofile.suggestion', { locale: lang })}</Text>
                    <Text style={{ fontSize : 12, textAlign : 'center', marginBottom:20}}>
                        {I18n.t('venderprofile.want_to_upload_videos_longer', { locale: lang })}
                    </Text>
                    <View style={styles.cost}>
                        <Text style={{marginBottom:5}} >{I18n.t('venderprofile.costperad', { locale: lang })}</Text>
                        <Text style={{color : '#a9d5d1', fontSize:18}}>{this.state.amount} KWD</Text>
                    </View>
                    <Modal isVisible={this.state.visibleModal}>
                        <View style={{alignItems : 'center', padding:10}}>
                            <CirclesLoader />
                        </View>
                    </Modal>
                    </View>
                </KeyboardAwareScrollView>
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
        borderRadius: 35,
        width: 70,
        height: 70,
        margin:20
    },
    cost : {
        alignItems : 'center',
        borderColor : '#ccc',
        borderTopWidth : 1,
        borderBottomWidth : 1,
        paddingVertical : 15,
        marginHorizontal : -10,
        backgroundColor:'white',
    }

})
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(MarketingCompaign);
