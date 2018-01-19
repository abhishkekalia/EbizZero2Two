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
import {Actions as routes} from "react-native-router-flux";

const { width, height } = Dimensions.get('window')

export default class Service extends Component {
   constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id : null,
            country : null
        }
    }
 
    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton });    
    }
    _renderRightButton = () => {
        return null
    };
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

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
            }
        fetch(Utils.gurl('serviceList'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                isLoading : false
                });
            }
            else{
                this.setState({
                isLoading : false
                })
            }
        }).done();
    }

    ListViewItemSeparator = () => {
        return (
            <View
              style={{
                height: .5,
                width: "100%",
                backgroundColor: "#CCC",
              }}
            />
        );
    }

    Description (product_name, productImages ,short_description, detail_description, price ,special_price){
        routes.vendordesc({ 
            title: product_name,
            product_name : product_name,
            productImages : productImages,
            short_description : short_description,
            detail_description : detail_description,
            price : price,
            special_price : special_price,
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                  <ActivityIndicator />
                </View>
            );
        }
        let listView = (<View></View>);
            listView = (
               <ListView
                contentContainerStyle={styles.list}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                dataSource={this.state.dataSource}
                renderSeparator= {this.ListViewItemSeparator} 
                renderRow={this.renderData.bind(this)}/>
            );
        return (
        <View style={{paddingBottom : 53}}>
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
                    onPress={()=> this.Description(data.service_name, data.serviceImages ,
                    data.short_description, data.detail_description, data.price ,data.special_price)}>
                        <Image style={styles.thumb} 
                            source={{ uri : data.serviceImages[0] ? data.serviceImages[0].image : null }}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{ padding :15}}>
                <TouchableOpacity  style={styles.name} 
                // onPress={()=>Actions.deascriptionPage({ product_id : data.product_id, is_wishlist : data.is_wishlist })}
                >

                <Text style={{fontSize : 13, color :'#000', fontFamily : 'halvetica' }}>{data.service_name}</Text>
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
        width : width/2-20,
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
        width : width/2 -6,
        // padding: 5,
        margin: 3,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius : 5,
    },
    button: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth : 0.5,
        borderColor : '#CCC'
    },

    thumb: {
        width: width/3-10,
        height: width/3+30,
        resizeMode : 'center',
        top : 15
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
});