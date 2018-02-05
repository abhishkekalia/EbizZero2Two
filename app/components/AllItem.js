import React, { Component ,PropTypes } from 'react';
import {
    ActivityIndicator, 
    FlatList,
    ListView,
    TouchableOpacity, 
    StyleSheet,
    Dimensions,
    AsyncStorage, 
    Text, 
    View,
    Image 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Editwish from './wish/Editwish';
import { Card } from "react-native-elements";

const { width, height } = Dimensions.get('window')

export default class AllItem extends Component {
    constructor(props) {
        super(props);        
        this.state={ 
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }), 
            dataSource2: new ListView.DataSource({  rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id: null,
            country : null
        }
    }

    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
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
        const {u_id, country } = this.state; 
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('category_id', String(this.props.product_category)); 

    const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
    fetch(Utils.gurl('moreProduct'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                refreshing : false
                });
            }
            else{
                this.setState({
                refreshing : false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();

    }
    moveToDesc(title, product_id, is_wishlist){
        Actions.deascriptionPage({ 
            title: title, 
            product_id : product_id , 
            is_wishlist : is_wishlist,
        })
    }

    render() {

        let listView = (<View></View>);
            listView = (
                <ListView
                horizontal
                contentContainerStyle={styles.list}
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

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        let color = data.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        
       return (
            <View style={styles.row} > 
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    
                            <TouchableOpacity 
                            onPress={()=> this.moveToDesc(data.product_name, data.product_id, null) }
                            // onPress={()=>Actions.deascriptionPage({ title: data.product_id, product_id : data.product_id , is_wishlist : data.is_wishlist, toggleWishList: toggleWishList})}
                            >
                            <Image style={styles.thumb} 
                                source={{ uri : data.productImages[0] ? data.productImages[0].image : null }}/>
                                </TouchableOpacity>
                </View>
                
                <View style={{ padding :15}}>
                <TouchableOpacity  style={styles.name} 
                // onPress={()=>Actions.deascriptionPage({ product_id : data.product_id, is_wishlist : data.is_wishlist })}
                >

                <Text style={{fontSize : 13, color :'#000'}}>{data.product_name}</Text>
                </TouchableOpacity>

                <Text style={styles.description}>{data.short_description}</Text>
                <View style={{
                    flex: 0, 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    top : 5
                }}> 
                    <Text style={styles.special_price}>{data.special_price} Aed</Text>
                    <Text style={{fontSize:10, color: color, textDecorationLine: textDecorationLine}}>{data.price} Aed</Text>
                </View>
                </View>
            </View>
        );
    }
}

var styles =StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    list: {
        // borderWidth: 1, 
        // borderColor: '#CCC',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    name : {
        top : 5
    },
    description : {
        fontSize : 7,
        top : 5
    },
    special_price : {
        fontSize : 10,
        fontWeight : 'bold'
    },
    footer : {
        width : width/3-20,
        alignItems : 'center',
        padding : 10,
        borderTopWidth : 0.5, 
        borderColor :'#ccc',
        borderLeftWidth : 0.5
    },
    allshop :{ 
        flex:1, 
        justifyContent : "space-around", 
        flexDirection: 'row', 
        borderWidth : 0.5, 
        borderColor: "#ccc", 
        alignItems: 'center'
    },

    row: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width : width/3 -6,
        // padding: 5,
        margin: 3,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius : 5,
    },
    button: {
        width: width/3,
        marginBottom: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth : 0.5,
        borderColor : '#CCC'
    },

    thumb: {
        width: width/4-10,
        height: width/4+30,
        resizeMode : 'center',
        top : 15
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
     contentContainer: {  }
});