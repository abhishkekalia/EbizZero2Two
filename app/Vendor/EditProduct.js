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
            rows : [] ,
            Imagepath : [],
            is_feature : this.props.is_feature ,
            removed_images : [],
            selSize:[]
        }
        this.inputs = {};
        this.handlePress = this.handlePress.bind(this)
    // this.editSize = this.editSize.bind(this);
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
    }
    componentWillMount() {
        // routes.refresh({ right: this._renderRightButton, left :  this._renderLeftButton });
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
        const { productname,
            shortdescription, detaildescription, price,
            discount,final_price, quantityRows,
            Size, quantity, is_feature, Imagepath , special, rows ,sizeRows} = this.state;

            let path = rows.length
            if(path < 1){
                MessageBarManager.showAlert({
                    message: "Plese Select At Lest Single Image",
                    alertType: 'warning',
                    title:''
                })
                return false
            }
            if (!productname.length){
                MessageBarManager.showAlert({
                    message: "Plese Insert Product Name",
                    alertType: 'warning',

                    title:''
                })
                return false
            }
            if (!shortdescription.length){
                MessageBarManager.showAlert({
                    message: "Plese Insert Short Description Of Product",
                    alertType: 'warning',
                    title:''
                })
                return false
            }
            if (!detaildescription.length){
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
            if (!special){
                MessageBarManager.showAlert({
                    message: "Plese Insert special Price",
                    alertType: 'warning',
                    title:''
                })
                return false

            }
            if ( special > price){
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
            const {
                product_category , productname,
                shortdescription, detaildescription, price,
                discount,final_price, quantityRows,
                Size, quantity, is_feature, Imagepath , special, rows ,sizeRows, removed_images} = this.state;

                const { u_id, country } = this.props;
                if(this.validate()) {
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
                        { name : 'country', data: String(country)},
                        { name : 'product_category', data: String(product_category)},
                        { name : 'product_name', data: String(productname)},
                        { name : 'short_description', data: String(shortdescription)},
                        { name : 'detail_description', data: String(detaildescription)},
                        { name : 'price', data: String(price)},
                        { name : 'special_price', data: String(special)},
                        { name : 'discount', data: String(10)},
                        { name : 'final_price', data: String(special)},
                        { name : 'product_id', data: String(this.props.product_id)},
                        { name : 'removed_images', data: removed_images.toString()},
                        { name : 'quantity', data: quantityRows.toString()},
                        { name : 'size_id', data: sizeRows.toString()},
                        { name : 'size', data: sizeRows.toString()},
                        { name : 'quantity', data: sizeRows.toString()},
                        { name : 'is_feature', data: String(is_feature)},
                        { name : 'gender', data: String(1)},
                    ])
                    .uploadProgress((written, total) => {
                        console.log('uploaded', Math.floor(written/total*100) + '%')
                    })
                    .then((res)=>{

                        var getdata = JSON.parse(res.data);
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
                    .then(()=>routes.product())
                    .catch((errorMessage, statusCode) => {
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
    productCont(){
        Keyboard.dismiss();

        const { quantity, Size} = this.state;

        var newStateArray = this.state.quantityRows.slice();
        var newsizeArray = this.state.sizeRows.slice();

        newStateArray.push(quantity);
        newsizeArray.push(Size);
        this.setState({...INITIAL_STATE,
            quantityRows: newStateArray,
            sizeRows: newsizeArray,
            additional : false
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
    // renderSizeTable(){
    //   render() {
    //     // const {Size} = this.state;
    //     return (
    //       <Text style={[commonStyles.label,{ textAlign: textline}]}> this.state.Size </Text>
    //     )
    //   }
    //
    // }
    editSize(selSizeData){
      this.setState({
        selSize:selSizeData,
        editSizeModal:true
      });
    }

    render() {
        const { imageSelect, quantityRows, sizeRows} = this.state;

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
            is_feature = false} else { is_feature = true}

        let sizeArr = [];
        const size = this.state.sizeRows;
        var selSize= this.state.selSize;



        return (
            <ScrollView
            contentContainerStyle={commonStyles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>

                <View style={commonStyles.formItems}>
                    <View style={commonStyles.textField}>
                        <View style={{ width: '100%', flexDirection: direction}}>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddproduct.productnamelbl', { locale: lang })}</Text>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>*</Text>
                        </View>
                        <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, textAlign: textline}]}
                        value={this.state.productname}
                        // onFocus={()=>this.hidetab()}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Product name"
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
                    <View style={commonStyles.textField}>
                        <View style={{ width: '100%', flexDirection: direction}}>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddproduct.shortdesclbl', { locale: lang })}</Text>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>*</Text>
                        </View>
                        <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, textAlign: textline}]}
                        value={this.state.shortdescription}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Short Description "
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
                    <View style={commonStyles.textField}>
                        <View style={{ width: '100%', flexDirection: direction}}>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddproduct.detaildesclbl', { locale: lang })}</Text>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>*</Text>
                        </View>
                        <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height), textAlign: textline}]}
                        value={this.state.detaildescription}
                        numberOfLines={3}
                        multiline
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Detail Description "
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
                    <View style={commonStyles.textField}>
                        <View style={{ width: '100%', flexDirection: direction}}>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddproduct.pricelbl', { locale: lang })}</Text>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>*</Text>
                        </View>
                        <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, textAlign: textline}]}
                        value={this.state.price}
                        keyboardType={'numeric'}
                        underlineColorAndroid = 'transparent'
                        autoCorrect={false}
                        placeholder="Price "
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
                        <View style={{ width: '100%', flexDirection: direction}}>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>{I18n.t('vendoraddproduct.sppricelbl', { locale: lang })}</Text>
                            <Text style={[commonStyles.label,{ textAlign: textline}]}>*</Text>
                        </View>
                        <TextInput
                        style={[commonStyles.inputusername, { borderRadius : 5, textAlign: textline}]}
                        value={this.state.special}
                        underlineColorAndroid = 'transparent'
                        keyboardType={'numeric'}
                        autoCorrect={false}
                        placeholder="Special Price"
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
                    <View>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <View style={{padding:5}}>
                                <Text> #Id</Text>
                            </View>
                            <View style={{padding:5}}>
                                <Text> Size </Text>
                            </View>
                            <View style={{padding:5}}>
                                <Text> Quantity </Text>
                            </View>

                        </View>
                      {size.map((prop, key) => {
                        return (

                          <View style={{flex:1,flexDirection:'row'}}>
                                  <View style={{padding:5}}>
                                      <Text> {prop.size_id} </Text>
                                  </View>
                                  <View style={{padding:5}}>
                                      <Text> {prop.size} </Text>
                                  </View>
                                  <View style={{padding:5}}>
                                      <Text> {prop.quantity} </Text>
                                  </View>
                                  <View>
                                    <TouchableOpacity
                                    onPress={() => this.editSize(prop)}>
                                        <Icon style={{padding:5}} name='create' size={25}  />
                                    </TouchableOpacity>
                                  </View>
                              </View>
                        );
                     })}
                    </View>

                    <View style={{  top: 10, marginBottom : 10 ,flexDirection:direction}}>
                    {Platform.OS === 'ios' ?
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
            <View>
              <Modal isVisible={this.state.editSizeModal}>
                  <View style={{ padding:10, backgroundColor : '#fff'}}>
                      <Text style={{color :"#a9d5d1", fontWeight : 'bold', bottom : 10, textAlign: 'center'}}>Edit Quantity & Size</Text>
                      <View style={{flexDirection: direction, width: '90%'}}>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>Quantity</Text>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>:</Text>
                      </View>
                        <TextInput
                          style={[commonStyles.inputs, { bottom : 20,  textAlign: textline, width: '90%'}]}
                          value={this.state.selSize.quantity}
                          underlineColorAndroid = 'transparent'
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          placeholder="Quantity"
                          maxLength={3}
                          onChangeText={(quantity) => this.setState({
                            selSize:{
                                    size:this.state.selSize.size,
                                    quantity:quantity
                            }
                          })}
                          onSubmitEditing={() => {
                              this.focusNextField('two');
                            }}
                            returnKeyType={ "next" }
                            ref={ input => {
                              this.inputs['one'] = input;
                            }}

                              />
                  <View style={{flexDirection: direction, width: '90%'}}>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>Size</Text>
                          <Text style={{color :"#a9d5d1" ,bottom : 10}}>:</Text>
                      </View>
                      <TextInput
                          style={[commonStyles.inputs, {bottom : 20,  textAlign: textline, width: '90%'}]}
                          value={this.state.selSize.size}
                          underlineColorAndroid = 'transparent'
                          autoCorrect={false}
                          keyboardType={'default'}
                          placeholder="Size"
                          maxLength={15}

                          returnKeyType={ "done" }
                          ref={ input => {
                              this.inputs['two'] = input;
                          }}
                          onChangeText={(Size) => this.setState({
                            selSize:{
                                    size:Size,
                                    quantity:this.state.selSize.quantity

                            }
                          })}
                      />
                  <View style={{flexDirection: direction, justifyContent: 'space-around'}}>
                      <Button title="Cancel" onPress={()=>this.setState({
                                  editSizeModal : false
                              })} color="#a9d5d1"/>
                      <Button title={I18n.t('vendoraddproduct.submit', { locale: lang })}   color="#a9d5d1"  onPress={()=>this.setState({ editSizeModal : false })}
                              />
                  </View>
              </View>
              </Modal>
            </View>

            </ScrollView>
        )
    }
}
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(EditProduct);
