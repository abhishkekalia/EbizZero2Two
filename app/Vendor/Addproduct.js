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
    Alert
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
import GetImage from './imageSlider'
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = 'Select Category'

import SelectedImage from './SelectedImage';


export default class AddProduct extends Component { 
    constructor(props) { 
        super(props);
        this.state={
            image: null,
            imageSelect : false,
            avatarSource: null,
            selected: '',
            options : [ 'Cancel', 'Apple', 'Banana', 'Watermelon', 'Durian' ],
            u_id: null,
            user_type : null,
            country : null,
            amount : '1',
            visibleModal: false,
            height : '',
            productname : '',
            detaildescription : '',
            shortdescription : '',
            price : '',
            rows : []       
        }
    this.inputs = {};

    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
  }

    focusNextField(id) { 
        this.inputs[id].focus();
    }

  showActionSheet() {
    this.ActionSheet.show()
  }
 
  handlePress(i) {
    this.setState({
      selected: i
    })
  }

  componentDidMount(){
        this.getKey()
        .then(()=>this.getCategory())
        .done();
    }
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
                        optionsList.push(order.category_name);
                    }

                    this.setState({
                        options : optionsList
                    })
                }
            })
            .done();


    }

    uploadTocloud(source, name){
        // const { image, imageSelect , avatarSource, videoSelect, u_id, user_type, country, amount } = this.state; 
        // var isImage 
        // if(image === 'image') { isImage = "1"} else { isImage = "2"}
        // // if(image === 'image') { path = imageSelect} else { path = videoSelect}

        // let formData = new FormData();
        // formData.append('u_id', String(u_id));
        // formData.append('country', String(country)); 
        // formData.append('user_type', String(user_type)); 
        // formData.append('ad_type', String(isImage)); 
        // formData.append('path', {
        //     uri:  source,
        //     type: 'image/jpg', 
        //     name: name});         
        // formData.append('thumbnail_image', {
        //     uri:  source,
        //     type: 'image/jpg', 
        //     name: name});
        // formData.append('ad_category', String(4)); 
        // formData.append('amount', String(amount)); 

        // const config = { 
        //     method: 'POST', 
        //     headers: { 
        //         'Accept': 'application/json', 
        //         'Content-Type': 'multipart/form-data;',
        //     },
        //     body: formData,
        // } 
        //     fetch(Utils.gurl('addMarketingAd'), config) 
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         routes.myfaturah({ uri : responseData.data.url, order_id : responseData.data.ad_id})

        //         if(responseData.status){
        //             this.setState({
        //                 visibleModal : false});
        //         }
        //     }).done();


        // console.warn(formData);

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
              let source = { uri: response.uri }; 
              let path = response.uri
              let name = response.fileName

                this.setState({
                    avatarSource: source,
                    imageSelect : true,
                    videoSelect : false,
                    image : path,
                    // visibleModal : true
                });
                // this.uploadTocloud(path, name );

            var newStateArray = this.state.rows.slice(); 
            newStateArray.push(source); 
                this.setState({ 
                    rows: newStateArray
                });
            }
        });
    }
// createArray(){
//     for (var i = 0; i < this.state.rows.length; i++) {
//     var data = this.state.rows.map(function(item) {
//   return {
//     label: item.uri
//   };
// });    }

// console.warn(data);
// }
    render() {
        // console.warn(this.state.rows);
        const { imageSelect} = this.state; 
        borderColorImage= imageSelect ? "#a9d5d1" : '#f53d3d'    

        return (
            <ScrollView contentContainerStyle={commonStyles.container} keyboardShouldPersistTaps={'handled'}>
                <View style={commonStyles.ImageAdd}>
                    <Text style={{color: borderColorImage}}>Select Product Image</Text>  
                    <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius : 40}}>
                        <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="upload-cloud" size= {30} style={{padding :20 }} /> 
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#ccc', top: 10}}>
                        { this.state.avatarSource === null ? <Feather onPress={this.selectPhotoTapped.bind(this)} 
                            name="image" size= {30} style={{padding :20 }} /> :
                                <SelectedImage 
                                productImages={this.state.rows} 
                                />
                            }

                    </View>
                    <TouchableOpacity style={commonStyles.addCat} onPress={this.showActionSheet}>
                        <Text>{ this.state.selected ? this.state.options[this.state.selected] : "Add Product category"}</Text>
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
                            autoCorrect={false}
                            placeholder="Special Price"
                            maxLength={7}
                            onSubmitEditing={() => { 
                                this.focusNextField('six');
                            }}
                            returnKeyType={ "next" }
                            ref={ input => { 
                                this.inputs['five'] = input;
                            }}

                            onChangeText={(special) => this.setState({special})}
                        />
                    </View>
                    <View style={commonStyles.textField}>
                    <Text style={commonStyles.label}>Quantity *</Text>
                    </View>
                    <View style={commonStyles.textField}>
                    <Text style={commonStyles.label}>Size *</Text>

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
