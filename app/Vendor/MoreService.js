import React, { Component ,PropTypes } from 'react';
import {
    // ActivityIndicator,
    // FlatList,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    // AsyncStorage,
    Text,
    View,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
// import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
const { width, height } = Dimensions.get('window')

export default class MoreService extends Component {
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
        this.fetchData()
    }

    // async getKey() {
    //     try {
    //         const value = await AsyncStorage.getItem('data');
    //         var response = JSON.parse(value);
    //         this.setState({
    //             u_id: response.userdetail.u_id ,
    //             country: response.userdetail.country
    //         });
    //     } catch (error) {
    //         console.log("Error retrieving data" + error);
    //     }
    // }


    fetchData(){
        const { service_type_id, vendor_id, lang, country, u_id, deviceId } = this.props;
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        // formData.append('country', String(country));
        formData.append('service_type_id', String(service_type_id));
        formData.append('vendor_id', String(vendor_id));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("Request moreServiceNew:=",config)
        fetch(Utils.gurl('moreServiceNew'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Response moreServiceNew:=",responseData)
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
        const { lang , deviceId, country, u_id} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row';

        let listView = (<View></View>);
        listView = (
            <ListView
            horizontal
            contentContainerStyle={[styles.list, { flexDirection: direction}]}
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
        console.log("MoreService data:=",data)
        let color = data.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        const { lang , deviceId, country, u_id} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',

        service_name = (lang == 'ar')? data.service_name_in_arabic : data.service_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
        return (
            <View style={styles.row}>
                <View style={{flexDirection: direction, justifyContent: "center", overflow:'hidden', paddingTop:10}}>
                <TouchableOpacity
                            onPress={()=> this.Description(data.service_id, service_name, data.serviceImages, short_description, detail_description, price ,special_price, data.is_wishlist)}>
                        <Image style={[styles.thumb, { alignSelf: 'center',}]}
                            source={{ uri : data.serviceImages[0] ? data.serviceImages[0].image : null }}
                            resizeMode = 'stretch'
                            // resizeMethod='scale'
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ padding :10,paddingTop:0}}>
                <TouchableOpacity  style={styles.name}
                // onPress={()=>Actions.deascriptionPage({ product_id : data.product_id, is_wishlist : data.is_wishlist })}
                >
                    <Text style={{fontSize : 13, color :'#000'}}>{service_name}</Text>
                </TouchableOpacity>
                <Text style={styles.description}>{short_description}</Text>
                <View style={{ flex: 0, flexDirection: direction, justifyContent: 'space-between', top : 5}}>
                    <View style={{flexDirection: direction}}>
                        <Text style={[styles.special_price, {textAlign:align}]}>{special_price}</Text>
                        <Text style={[styles.special_price, {textAlign:align}]}>KWD</Text>
                    </View>
                    <View style={{flexDirection: direction}}>
                        <Text style={{fontSize:10, color: color, textDecorationLine: textDecorationLine, textAlign: align}}>{price}</Text>
                        <Text style={{fontSize:10, color: color, textDecorationLine: textDecorationLine, textAlign: align}}>KWD</Text>
                    </View>
                </View>
                </View>
            </View>
        );
    }
    Description( service_id, product_name, productImages , short_description, detail_description, price ,special_price, is_wishlist){
        Actions.vendordesc({
            is_user : true,
            service_id : service_id,
            title: product_name,
            product_name : product_name,
            productImages : productImages,
            short_description : short_description,
            detail_description : detail_description,
            price : price,
            special_price : special_price,
            is_wishlist : is_wishlist,
        })
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
        flexWrap: 'wrap',
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    name : {
        top : 0
    },
    description : {
        fontSize : 10,
        top : 3
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
        backgroundColor: '#fff'
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
        width: width/3-15,
        height: width/4+30,
        top : 0
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
     contentContainer: {  }
});
