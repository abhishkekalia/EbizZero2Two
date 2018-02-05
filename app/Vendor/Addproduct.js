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

import RNFetchBlob from 'react-native-fetch-blob';
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = 'Select Category'

import SelectedImage from './SelectedImage';

const { width, height } = Dimensions.get('window');

const INITIAL_STATE = { quantity: '',  Size: ''}
export default class AddProduct extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            avatarSource: null,
            product_category: '',
            options : ['0','1'],
            u_id: null,
            user_type : null,
            country : null,
            visibleModal: false,
            additional: false,
            height : '',
            productname : '',
            detaildescription : '',
            shortdescription : '',
            price : '',
            special : '',
            quantity : '',
            Size : '',
            quantityRows : [],
            sizeRows : [],
            rows : [] ,
            Imagepath : [],
            is_feature : 0      
        }
    this.inputs = {};
    this.chips = {};


    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
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
                        options : optionsList
                    })
                }
            })
            .catch((errorMessage, statusCode) => {
            })

            .done();
    }
    validate(){
        const { product_category , productname, 
            shortdescription, detaildescription, price, 
            discount,final_price, quantityRows, 
            Size, quantity, is_feature, Imagepath , special, rows ,sizeRows} = this.state; 

        let path = Imagepath.length
        if(path < 1){
            MessageBarManager.showAlert({
                message: "Plese Select At Lest Single Image",
                alertType: 'warning',
                })      
            return false
            }
        if (!product_category){
        } 
        if (!productname.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Product Name",
                alertType: 'warning',
                })      
            return false
        } 
        if (!shortdescription.length){
            MessageBarManager.showAlert({
                message: "Plese Insert Short Description Of Product",
                alertType: 'warning',
                })      
            return false
        }    
        if (!detaildescription.length){
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
        if (!special){
            MessageBarManager.showAlert({
                message: "Plese Insert special Price",
                alertType: 'warning',
                })      
            return false
             
        }
        if ( special > price){
            MessageBarManager.showAlert({
                message: "Special Price cannot be greater than Price",
                alertType: 'warning',
                })      
            return false
        }
        if (!quantityRows.length > 0){
            MessageBarManager.showAlert({
                message: "Plese Enter Quantity of Items",
                alertType: 'warning',
                })      
            return false
             
        } 
        if (!sizeRows.length > 0){
            MessageBarManager.showAlert({
                message: "Plese Enter Size of Items",
                alertType: 'warning',
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
            Size, quantity, is_feature, Imagepath , special, rows ,sizeRows, u_id, country} = this.state;
        if(this.validate()) { 
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
            { name : 'product_category', data: String(product_category)}, 
            { name : 'product_name', data: String(productname)}, 
            { name : 'short_description', data: String(shortdescription)}, 
            { name : 'detail_description', data: String(detaildescription)}, 
            { name : 'price', data: String(price)}, 
            { name : 'special_price', data: String(special)}, 
            { name : 'discount', data: String(10)}, 
            { name : 'final_price', data: String(special)}, 
            { name : 'quantity', data: quantityRows.toString()}, 
            { name : 'size', data: sizeRows.toString()}, 
            { name : 'is_feature', data: String(is_feature)}, 
            ])
            .uploadProgress((written, total) => {
            console.log('uploaded', Math.floor(written/total*100) + '%') 
            })
            .then((res)=>{ 
                this.setState({
                    visibleModal : false
                })
            })
            .catch((errorMessage, statusCode) => {
                MessageBarManager.showAlert({
                message: errorMessage,
                alertType: 'warning',
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
                let path = response.uri
                tempImg = path.replace(/^file:\/\//, '');

                let source = { 
                    name : 'product_images[]', 
                    filename : response.fileName, 
                    data: RNFetchBlob.wrap(tempImg), 
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
    render() {
        const { imageSelect, quantityRows, sizeRows} = this.state; 
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';
        
        let is_feature;
        if(this.state.is_feature === '0' ){ is_feature = false} else { is_feature = true}

        return (
            <ScrollView 
            contentContainerStyle={commonStyles.container} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
                <View style={commonStyles.ImageAdd}>
                    <Text style={{color: borderColorImage, marginBottom : 10}}>Select Product Image</Text>  
                    <Text style={{color: "#696969", fontSize:12, marginBottom : 5}}>Click On Image To Upload Product Picture</Text>  
                    <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#a9d5d1'}}>
                        <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="upload-cloud" size= {30} style={{padding :30, marginBottom:20 }} /> 
                    </View>
                    <View style={{  top: 10, flexDirection:'row'}}>
                        { this.state.avatarSource === null ? undefined :
                            <SelectedImage 
                            productImages={this.state.rows} 
                            />
                        }
                    </View>
                    <TouchableOpacity style={commonStyles.addCat} onPress={this.showActionSheet}>
                        <Text>{ this.state.product_category ? this.state.options[this.state.product_category] : "Add Product category"}</Text>
                        <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={title}
                        options={this.state.options}
                        cancelButtonIndex={CANCEL_INDEX}
                        // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handlePress}/>
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.formItems}> 
                    <View style={commonStyles.textField}>
                        <Text style={commonStyles.label}>Name *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
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
                        <Text style={commonStyles.label}>Short Description *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
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
                        <Text style={commonStyles.label}>Detail Description  *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5, height: Math.max(35, this.state.height)}]}
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
                        <Text style={commonStyles.label}>Special Price *</Text>
                        <TextInput 
                        style={[commonStyles.inputusername, { borderRadius : 5}]}
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
                    <View style={commonStyles.feature}>
                        <Text style={commonStyles.label}>Product Is Feature *</Text>
                        <Switch
                        value={is_feature}
                        onValueChange={(val) => 
                            this.setState({ is_featuronSubmitEditinge : val ? "2" : "0"})
                        }
                        disabled={false}
                        activeText={'On'}
                        inActiveText={'Off'}
                        backgroundActive={'green'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'#30a566'}
                        circleInActiveColor={'#000000'}/>

                    </View>
                    <Text style={commonStyles.label}>
                        Please enter size,quantity inputs respectively.ex Size: 8yr,10yr,12yr Quantity: 50,120,100
                    </Text>
                    <View style={commonStyles.chip}> 
                        <View>
                            <View style={commonStyles.textField}>
                                <Text style={commonStyles.label}>Quantity *</Text>
                                <Text style={{ color : '#000', left : 20 }}>{quantityRows.toString()}</Text>
                            </View>
                            <View style={commonStyles.textField}>
                                <Text style={commonStyles.label}>Size *</Text>
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
                            <Text style={{fontSize : 12}}>Add Quantity & Size</Text>
                        </TouchableOpacity> 
                    </View>
                </View>

                    <Modal isVisible={this.state.additional}>
                    <View style={{alignItems : 'center', padding:10, backgroundColor : '#fff'}}>
                        <Text style={{color :"#a9d5d1", fontWeight : 'bold', bottom : 10}}>Please Enter Quantity and Size Of Items</Text> 
                        <Text style={{color :"#a9d5d1" , width : width/2,bottom : 10}}>Quantity :</Text> 
                        <TextInput
                            style={[commonStyles.inputs, { bottom : 20}]}
                            value={this.state.quantity}
                            underlineColorAndroid = 'transparent'
                            autoCorrect={false}
                            keyboardType={'numeric'}
                            placeholder="Quantity"
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
                        <Text style={{color :"#a9d5d1", width : width/2, bottom : 10}}>Size :</Text> 
                        <TextInput
                            style={[commonStyles.inputs, {bottom : 20}]}
                            value={this.state.Size}
                            underlineColorAndroid = 'transparent'
                            autoCorrect={false}
                            keyboardType={'default'}
                            placeholder="Size"
                            maxLength={15}
                            onSubmitEditing={() => { 
                            }}
                            returnKeyType={ "next" }
                            ref={ input => { 
                                this.inputs['two'] = input;
                            }}
                            onChangeText={(Size) => this.setState({Size})}
                        />
                        
                        <Button title="submit" onPress={()=>this.productCont()} color="#a9d5d1"/>                    
                </View>
            </Modal>
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                    <CirclesLoader />
                    
                </View>
            </Modal>
            <KeyboardSpacer/>

            </ScrollView>
        )
    }
}
