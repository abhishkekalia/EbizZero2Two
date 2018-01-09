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
import RNFetchBlob from 'react-native-fetch-blob';
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = 'Select Category'

import SelectedImage from './SelectedImage';
// const slideAnimation = new SlideAnimation({
//   slideFrom: 'bottom',
// });

const { width, height } = Dimensions.get('window');


export default class AddProduct extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            avatarSource: null,
            product_category: '',
            options : [],
            u_id: null,
            user_type : null,
            country : null,
            visibleModal: false,
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
        routes.refresh({ right: this._renderRightButton });    
    }
   _renderRightButton = () => {
        return(
            <TouchableOpacity onPress={() => this.uploadTocloud() } style={commonStyles.submit} >
            <Text style={{color : '#fff'}}>ADD</Text>
            </TouchableOpacity>
        );
    };

    // _handleIconTouch = () => {
    //     console.warn('Touched!');
    // }


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
            .done();


    }
    validate(){
        const { u_id, product_category , productname, 
            shortdescription, detaildescription, price, 
            special, discount,final_price, quantityRows, 
            country, size, is_feature } = this.state;

        if (!product_category.length){
        MessageBarManager.showAlert({
            message: "Plese Select Category",
            alertType: 'alert',
            })      
        return false
    } 
    
    
        return true;
    }

    uploadTocloud(){
        const { u_id, product_category , productname, 
            shortdescription, detaildescription, price, 
            special, discount,final_price, quantityRows, 
            country, size, is_feature, Imagepath , rows ,sizeRows} = this.state; 

        // let formData = new FormData();
        // formData.append('u_id', String(u_id));
        // formData.append('country', String(country)); 
        // formData.append('product_category', String(product_category)); 
        // formData.append('product_name', String(productname)); 
        // formData.append('short_description', String(shortdescription)); 
        // formData.append('detail_description', String(detaildescription)); 
        // formData.append('price', String(price)); 
        // formData.append('special_price', String(special)); 
        // formData.append('discount', String(10)); 
        // formData.append('final_price', String(special)); 
        // formData.append('quantity', quantityRows); 
        // formData.append('size', sizeRows); 
        // formData.append('is_feature', String(is_feature)); 
        // formData.append('product_images[]', { 
        //     name : 'avatar-foo', 
        //     filename : 'avatar-foo.png', 
        //     type:'image/foo', 
        //     data: RNFetchBlob.wrap(Imagepath)
        // });         

        // const config = { 
        //     method: 'POST', 
        //     headers: { 
        //         Authorization : "Bearer access-token",
        //         'Accept': 'application/json', 
        //         'Content-Type': 'multipart/form-data;',
        //     },
        //     body: formData,
        // } 
        //    RNFetchBlob.fetch(Utils.gurl('productAdd'), config) 
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         console.warn(responseData)

        //         // if(responseData.status){
        //         //     this.setState({
        //         //         visibleModal : false});
        //         // }
        //     }).done();


        let form = new FormData()
        form.append('u_id', String(2));
        form.append('country', String(1)); 
        form.append('product_category', String("product_category")); 
        form.append('product_name', String("productname")); 
        form.append('short_description', String("shortdescription")); 
        form.append('detail_description', String("detaildescription")); 
        form.append('price', String(125)); 
        form.append('special_price', String(120)); 
        form.append('discount', String(10)); 
        form.append('final_price', String(100)); 
        form.append('quantity', String(125)); 
        form.append('size', String("2yr")); 
        form.append('is_feature', String("0")); 





        // RNFetchBlob.fetch('POST', Utils.gurl('productAdd'),{ 
        //     Authorization : "Bearer access-token", 
        //     'Accept': 'application/json', 
        //     'Content-Type': 'multipart/form-data;',
        // },
        // [{
        //     name : 'product_images[]', 
        //     filename : 'profile.jpg', 
        //     data: RNFetchBlob.wrap(Imagepath[0]),
        // },
        // {},])
        // .uploadProgress((written, total) => {
        // console.log('uploaded', written/total)
        // })
        // .then((res)=> console.warn(res))
        // .done();
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
                // console.warn(response.data)
                let source = { uri: response.uri , name: response.fileName, type: 'image/jpg'}; 
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
            newPathArray.push(uri); 
                this.setState({ 
                    rows: newStateArray,
                    Imagepath: newPathArray
                });
            }
        });
    }
    productCont(){
        this.popupDialog.dismiss();

        Keyboard.dismiss();
        
        const { quantity, Size} = this.state;

        var newStateArray = this.state.quantityRows.slice(); 
        var newsizeArray = this.state.sizeRows.slice(); 

        newStateArray.push(quantity); 
        newsizeArray.push(Size); 
        this.setState({
            quantityRows: newStateArray,
            sizeRows: newsizeArray
        });
    }
    render() {
        const { imageSelect} = this.state; 
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d';
        var textQuantity = this.state.quantityRows.map((title)=> <Text style={{color : '#000', fontSize: 14, fontWeight :"200" }}>{title} , </Text>)
        var textSize = this.state.sizeRows.map((title)=> <Text style={{color : '#000', fontSize: 14, fontWeight :"200" }}>{title} , </Text>)
        
        let is_feature;
        if(this.state.is_feature === '0' ){ is_feature = false} else { is_feature = true}

        return (
            <ScrollView 
            contentContainerStyle={commonStyles.container} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
                <View style={commonStyles.ImageAdd}>
                    <Text style={{color: borderColorImage}}>Select Product Image</Text>  
                    <View style={{ borderWidth: 1, borderColor: 'transparent', borderRadius : 40}}>
                        <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="upload-cloud" size= {30} style={{padding :20 }} /> 
                    </View>
                    <View style={{  top: 10, flexDirection:'row'}}>
                        { this.state.avatarSource === null ? <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="image" size= {30} style={{padding :20, borderWidth: 1, borderColor: '#ccc', }} /> :
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
                        value={is_feature }
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
                    <Text style={commonStyles.label}>
                        Please enter size,quantity inputs respectively.ex Size: 8yr,10yr,12yr Quantity: 50,120,100
                    </Text>
                    <View style={commonStyles.chip}> 
                        <View>
                            <View style={commonStyles.textField}>
                                <Text style={commonStyles.label}>Quantity *</Text>
                                <View style={{ flex:1, flexDirection : 'row', }}> 
                                    {textQuantity}
                                </View>
                            </View>
                            <View style={commonStyles.textField}>
                                <Text style={commonStyles.label}>Size *</Text>
                                <View style={{ flex:1, flexDirection : 'row', }}>
                                    {textSize}
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={{
                            backgroundColor : '#ccc',
                            padding : 10,
                            borderRadius : 3,
                            top : 5
                        }}
                        onPress={() => {
                          this.popupDialog.show();
                        }}>
                            <Text style={{fontSize : 12}}>Add Quantity & Size</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
                <PopupDialog 
                        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                        containerStyle ={{ 
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex :1
                            // width : width,
                            // height :height/1.6
                        }}>
                        <View style={{ 
                            // flexDirection: 'column', 
                            // justifyContent: 'center', 
                            alignItems: 'center'
                        }} > 
                        <Text style={{color :"#a9d5d1", fontWeight : 'bold',}}>Please Enter Quantity and Size Of Items</Text> 
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
                    </PopupDialog>
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                    <CirclesLoader />
                    
                </View>
            </Modal>

            </ScrollView>
        )
    }
}
