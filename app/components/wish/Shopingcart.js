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
    Image 
} from 'react-native';
import Utils from 'app/common/Utils';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBarManager } from 'react-native-message-bar';

const { width, height } = Dimensions.get('window');

export default class Shopingcart extends Component {
    constructor(props) { 
        super(props); 
        this.getKey = this.getKey.bind(this);        
        this.fetchData = this.fetchData.bind(this);

        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
        this.state = { 
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            itemcount : '',
            totalamount : '',
            subtotalamount : '', 
            Quentity : 0,
            u_id: null,
            user_type : null,
            country : null

        }; 
    } 
    componentDidMount(){
        this.getKey()
        .then(()=>this.fetchData())
        .done()
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
        fetch(Utils.gurl('cartList'), config) 
        .then((response) => response.json())
        .then((responseData) => { 
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                itemcount : responseData.itemcount,    
                totalamount : responseData.totalamount,    
                subtotalamount : responseData.subtotalamount, 
                refreshing : false
        });
        })
        .then(()=> this.fetchData())
        .done();
    }

    removeFromCart(cart_id, product_id){
    const { size, color,  } = this.state; 
        const {u_id, country, user_type } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('product_id', String(product_id)); 
        formData.append('cart_id', String(cart_id)); 

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        
        fetch(Utils.gurl('removeFromCart'), config) 
        .then((response) => response.json())
        .then((responseData) => {

            MessageBarManager.showAlert({ 
                message: responseData.data.message, 
                alertType: 'alert', 
                stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                // animationType: 'SlideFromLeft',
            })

            // this.setState({ 
                // imgList: responseData.data.productImages,
                // data : responseData.data
        // });
        })
        .done();
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

    renderHeader(itemcount, totalamount){
        return(
            <View 
                style={{ 
                    flexDirection : "row", 
                    justifyContent: "space-between", 
                    padding : 5,
                    paddingBottom : 0,
                    alignItems:'center', 
                    flex : 0}}> 
                <Text> Items ({itemcount})</Text>
                <Text>Total : ${totalamount}</Text>
            </View>)
    }

    renderFooter(itemcount, totalamount, subtotalamount){
        return(
        <View 
                style={{ 
                    flexDirection : "column", 
                }}> 
                <View 
                    style={{ 
                        flexDirection : "row", 
                        justifyContent: "space-between", 
                        alignItems:'center', 
                        padding : 5, 
                        flex : 0}}> 
                <Text>Items({itemcount})</Text>
                <Text> $ {totalamount}</Text>
                </View>
                <View 
                    style={{ 
                        flexDirection : "row", 
                        justifyContent: "space-between", 
                        alignItems:'center',
                        padding : 5, 
                        flex : 0}}> 
                <Text style={{ color : "#87cefa"}} >Cart SubTotal</Text>
                <Text style={{ color : "#87cefa"}}> $ {subtotalamount}</Text>
                </View>
            </View>

            
        )
    }

    render() {
        const { itemcount, totalamount, subtotalamount } = this.state;
        
        let listView = (<View></View>);
            listView = (
                <ListView
                contentContainerStyle={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
            );
        return (
        <View style={{flex: 1, flexDirection: 'column'}}>
        {this.renderHeader( itemcount,totalamount)}
            {listView}
        {this.renderFooter(itemcount, totalamount, subtotalamount)}

        <View style={{ flexDirection : 'row', justifyContent : 'space-around'}}>
                <TouchableHighlight 
                underlayColor ={"#fff"} 
                style={[styles.shoping]} 
                onPress={()=>console.log("continoue shoping")}>
                <Text>Continoue Shoping</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                underlayColor ={"#fff"} 
                style={[styles.checkout]} 
                onPress={()=> console.log("checkout")}>
                <Text>Proced to Checkout</Text>
                </TouchableHighlight>
            </View>
        </View>
        );
    }
    renderData( data, rowData: string, sectionID: number, rowID: number, index) {
    
        let color = data.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';

        if ( !data.special_price) {
            return (
                <Text> No Item added to your cart </Text>
                );
        }


        let swipeBtns = [{
            text: 'Edit',
            backgroundColor: '#ccc',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {}
         },{
            text: 'Delete',
            backgroundColor: '#deb887',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {  }
         }];
    
        return (
            <View style={{ 
            flexDirection: 'column' ,
            marginTop : 2, 
            borderWidth : 0.5, 
            borderColor : "#ccc", 
            borderRadius : 5}}>
                <View style={{ 
                flexDirection: 'row', 
                backgroundColor : "#fff"}}>
                            
                    <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>
                        <View style={{ flexDirection: 'row'}}>
                            <Image style={[styles.thumb, {margin: 10}]} 
                            source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}/>
                        <View>
                            <TouchableHighlight
                            underlayColor='transparent'
                            onPress={this.viewNote.bind(this, data)} 
                            style={styles.row} >        
                                <Text > {data.product_name} </Text>
                            </TouchableHighlight>
                            <View style={{ flexDirection : "row"}}>
                                <Text> Quentity : </Text>
                                <TouchableOpacity 
                                style={styles.qtybutton} 
                                onPress={(Quentity)=> this.setState({Quentity : this.state.Quentity -1})}>
                                    <Text> - </Text>        
                                </TouchableOpacity>
                                            
                                <Text style={[styles.qtybutton, {color : "#87cefa"}]}> { this.state.Quentity } </Text>
                                            
                                <TouchableOpacity 
                                style={styles.qtybutton} 
                                onPress={(Quentity)=> this.setState({Quentity: this.state.Quentity +1 })}>
                                    <Text> +</Text>        
                                </TouchableOpacity>
                            </View>
                            <Text >US $ : {data.special_price} </Text>
                            <View style={{ flexDirection : "row"}}>
                                <Text style={{fontSize:15, color: color, textDecorationLine: textDecorationLine}}> US $ {data.price}  </Text>
                                <Text>| {data.special_price}</Text>
                            </View>
                                <Text > Total :{data.price} </Text>
                        </View>
                    </View>
                </View>
            </View>
                <View style={styles.bottom}>
                    <TouchableOpacity 
                    onPress={()=> this.removeFromCart(data.cart_id, data.product_id)}
                    style={[styles.wishbutton, {flexDirection : 'row', justifyContent: "center"}]}>
                        <Entypo name="cross" size={20} color="#87cefa"/>
                        <Text style={{ left : 5}}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.wishbutton, {flexDirection : 'row', justifyContent: "center"}]}>
                        <Entypo name="heart-outlined" size={20} color="#87cefa"/> 
                        <Text style={{ left :5}}>Add To wishlist</Text>
                    </TouchableOpacity>
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
        // backgroundColor: '#ccc',
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
    },
    shoping : {
        width : width/2,
        backgroundColor : "#a52a2a",
        alignItems : 'center',
        padding : 10
    },
    checkout : {
        width : width/2,
        backgroundColor : "#87cefa",
        alignItems : 'center',
        padding : 10
     }
})
