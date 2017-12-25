import React, { Component } from 'react';
import { 
    Text, 
    View, 
    TouchableHighlight, 
    StyleSheet, 
    ListView,
    TouchableOpacity,
    ScrollView, 
    Dimensions, 
    TextInput,
    AsyncStorage,
    Image ,
    RefreshControl,
    ActivityIndicator

} from 'react-native';
import Swipeout from 'react-native-swipeout';
import Utils from 'app/common/Utils';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Actions } from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from 'react-native-picker-dropdown';
import  Countmanager  from './Countmanager';

const { width, height } = Dimensions.get('window');

export default class WishList extends Component {
    constructor(props) { 
        super(props); 
        this.getKey = this.getKey.bind(this);        
        this.fetchData = this.fetchData.bind(this);
        this.state = { 
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}), 
            status : false,
            u_id: null,
            country : null,
            loaded: false,
            toggle : false,
            refreshing: false,        
        }; 
    } 
    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
        .done()
    }

    
    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

    fetchData(){ 
        const {u_id, country, user_type } = this.state;
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

        fetch(Utils.gurl('wishlist'), config) 
        .then((response) => response.json())
        .then((responseData) => {

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                status : responseData.status,
                refreshing : false
        });
        }).done();
    }

    addtoCart(count, product_id){
        const { size, color,  } = this.state; 
        const {u_id, country, user_type } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('product_id', String(product_id)); 
        formData.append('size', String(size)); 
        formData.append('color', String(color)); 
        formData.append('quantity', String(count)); 

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        
        fetch(Utils.gurl('addTocart'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                MessageBarManager.showAlert({ 
                    message: responseData.data.message, 
                    alertType: 'alert', 
                    stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                })
                Actions.shopingCart();
            }else {
                MessageBarManager.showAlert({ 
                    message: responseData.data.message, 
                    alertType: 'alert', 
                    stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                })

            }

        })
        .then(()=> this.fetchData())
        .done();
    }

    removeWishlist(product_id){
        const {u_id, country, user_type } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));  
        formData.append('product_id', String(product_id));

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        } 

        fetch(Utils.gurl('removeFromWishlist'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                this.fetchData()
            }
        })
        .then(()=> this.fetchData())
        .done();
    }
    editWishlist(product_id){
        const { size, color, u_id, country, } = this.state; 
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));  
        formData.append('product_id', String(product_id));
        formData.append('size', String(size)); 
        formData.append('color', String(color)); 

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        } 

        fetch(Utils.gurl('editWishlist'), config) 
        .then((response) => response.json())
        .then((responseData) => {

            MessageBarManager.showAlert({ 
                    message: responseData.data.message, 
                    alertType: 'alert', 
                    stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                })
        }).done();
    }

    viewNote(rowData) {
        // this.props.navigator.push({
        //   title: 'The Note',
        //   component: ViewNote,
        //   passProps: {
        //     noteText: rowData,
        //     noteId: this.noteId(rowData),
        //   }
        // });
    } 
   
    updateState = () => {
      this.setState({
          Quentity: !this.state.Quentity
      });
  }
    noItemFound(){
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text> No Item added to your wishlist </Text>
                <TouchableOpacity onPress={()=>this.fetchData()}><Text>Tap Here To Load wishlist</Text></TouchableOpacity>
               </View> );
    }

    render() {
        if (!this.state.status) {
            return this.noItemFound();
        } 
        let listView = (<View></View>);
            listView = (
                <ListView
                refreshControl={ 
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.fetchData} />
                }
                contentContainerStyle={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
            );
        return (
        <View>
            {listView}
        </View>
        );
    }
    renderData( data, rowData: string, sectionID: number, rowID: number, index) {
        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';


        let swipeBtns = [{
            text: 'Edit',
            backgroundColor: '#ccc',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {this.editWishlist(data.product_id)}
         },{
            text: 'Delete',
            backgroundColor: '#deb887',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {this.removeWishlist(data.product_id)}
         }];

        return (
            <View style={{ 
                flexDirection: 'column' ,
                marginTop : 2, 
                borderWidth : 0.5, 
                borderColor : "#ccc", 
                borderRadius : 5, 
            }}>
                <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'> 
                    
                        <View style={{ 
                            flexDirection: 'row', 
                            // justifyContent : 'space-around', 
                            backgroundColor : "#fff"}}>
                            
                            <Image style={[styles.thumb, {margin: 10}]} 
                            source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}
                            />
    
                                <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>  
                                    <TouchableHighlight
                                        underlayColor='transparent'
                                        onPress={this.viewNote.bind(this, data)} 
                                        style={styles.row} >
                                        
                                        <Text > {data.product_name} </Text>
                                    
                                    </TouchableHighlight>
                                        <Text style={{ fontSize : 10, color : '#ccc'}} > {data.short_description} </Text>

                                        <View style={{ flexDirection : "row"}}>
                                            <Text> Quentity :  </Text>
                                        <Countmanager  
                                        quantity={data.quantity} 
                                        // updateState={this.updateState} 
                                        u_id={this.state.u_id} 
                                        product_id={data.product_id} 
                                        updatetype={"0"} 
                                        country={this.state.country} 
                                        />
                                        </View>
                                        <Text > {data.product_name} </Text>
                                        <Text > {this.state.color} </Text>
                                        <Text > {this.state.size} </Text>

                                        <Text >US $ : {data.special_price} </Text>
                                        <View style={{ flexDirection : "row"}}>
                                        <Text style={{fontSize:15, color: color, textDecorationLine: textDecorationLine}}> US $ {data.price}  </Text>
                                        <Text>| {data.special_price}</Text>
                                        </View>
                                        <Text > Total :{data.price} </Text>
                                        <View >
                                        <SelectItem size={data.size} color={data.color} />

                                    </View>
                                      </View>
                               </View>                             
                </Swipeout>
                
                <View style={styles.bottom}>
                        <TouchableOpacity style={[styles.wishbutton, {flexDirection : 'row', justifyContent: "center"}]}>
                        <SimpleLineIcons name="share-alt" size={20} color="#a9d5d1"/>
                            <Text style={{ left : 5}}>Share WishList</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.wishbutton, {flexDirection : 'row', justifyContent: "center"}]} 
                        onPress={()=>this.addtoCart(data.quantity[sectionID], data.product_id)}>
                            <FontAwesome name="opencart" size={20} color="#a9d5d1"/> 
                            <Text style={{ left :5}}>Move to Cart</Text>
                        </TouchableOpacity>
                </View>
            </View>
        )
    }
}


class SelectItem extends Component{
        constructor(props) { 
        super(props); 
        this.state = { 
            size: this.props.size, 
            color: this.props.color, 
        }; 
    } 
    
    render(){
        // console.warn(this.props.size);
        return(
        <View style={{ flexDirection:'row'}}> 
            <View style={{width: width/3, height: 40, backgroundColor: '#fff'}}> 
                <Picker
                mode="dropdown"
                style={{
                    backgroundColor: 'transparent'
                    }}
                selectedValue={this.state.size}
                onValueChange={(itemValue, itemIndex) => this.setState({size: itemValue})}>
                    <Picker.Item label="Select Size" value="" />
                    <Picker.Item label="Small" value="small" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="Large" value="large" />
                </Picker>
            </View>
            <View style={{width: width/3, height: 40, backgroundColor: '#fff'}}> 
                <Picker 
                mode="dropdown"
                selectedValue={this.state.color} 
                onValueChange={(itemValue, itemIndex) => this.setState({color: itemValue})}>
                    <Picker.Item label="Select color" value="" />
                    <Picker.Item label="Red" value="red" />
                    <Picker.Item label="Yellow" value="yellow" />
                    <Picker.Item label="Pick" value="pink" />
                </Picker>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        // flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        padding : 10 
    },

    row: {
        flexDirection: 'row',
        // justifyContent: 'center',
        // padding: 10,
        // backgroundColor: '#F6F6F6',
        marginTop : 1
    },
    qtybutton: {
        paddingLeft: 10,
        paddingRight: 10,

        alignItems: 'center',
        borderWidth : 1,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        // shadowOffset:{width:2,height:4}
    },
        countryIcon: {
        // borderRightWidth: 1, 
        // borderColor: '#CCC',
        width : 40,
        height:40,
        padding :10
    },


    wishbutton :{
        alignItems : 'center', 
        width : width/2-10,
        // borderBottomLeftRadius : 10, 
        // borderBottomRightRadius : 10, 
        borderWidth : 0.5, 
        borderColor : "#ccc",
        padding : 5

    },

    thumb: {
        width   : width/5,
        height  :width/4 ,
    },

    textQue :{
        flex: 1,
        fontSize: 18,
        fontWeight: '400',
        left : 5
    },

    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    bottom : {
        borderBottomLeftRadius : 10, 
        borderBottomRightRadius : 10, 
        flexDirection : 'row',
        justifyContent : 'space-around',
        backgroundColor : "#fff"
    },

    headline: {
        paddingTop : 10,
        paddingBottom : 10,
        marginLeft : 15,
        fontSize    : 15,
        color       : "#000",
        fontWeight  : 'bold'
    },
    detail: {
        padding : 10,
        backgroundColor : '#fff',
        minHeight : 500,
        fontWeight : 'bold'
    }
})
