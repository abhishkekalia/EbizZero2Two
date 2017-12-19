import React, { Component ,PropTypes } from 'react';
import {
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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
const { width, height } = Dimensions.get('window')


export default class Searchproduct extends Component {
    constructor(props) {
        super(props);
        this.getKey = this.getKey.bind(this);             
        this.state = { 
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id: null,
            country : null ,
            user_type: null
        }
    }
    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
        .done()
    }

    blur() {
        const {dataSource } = this.state;
        dataSource && dataSource.blur();
    }

    focus() {
        const {dataSource } = this.state;
        dataSource && dataSource.focus();
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
        const { filterdBy, vendor } = this.props;
        const {u_id, country, user_type } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(user_type));
        formData.append('country', String(country)); 
        formData.append('category_id', String([2,3])); 
        formData.append('vendor_id', String  (vendor)); 

    const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
    fetch(Utils.gurl('filterProducts'), config) 
        .then((response) => response.json())
        .then((responseData) => {
        // console.warn(JSON.stringify(responseData))

        if(responseData.status){
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                refreshing : false
            });
        } else {
            console.warn(responseData.data.message)
        }
        }).done();
    }

    render() {

        let listView = (<View></View>);
            listView = (
                <ListView
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
        let url = data.productImages ? data.productImages[0].image : null;
        
        let heartType

        if (data.is_feature == 0) {
            heartType = 'ios-heart-outline'; 
        } else {
            heartType = 'ios-heart' ;
        }
        return (
            <View style={styles.row} > 
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    <IconBadge
                        MainElement={ 
                            <Image style={styles.thumb} 
                                source={{ uri : url }}/>                        }
                        BadgeElement={
                            <Text style={{color:'#FFFFFF', fontSize: 10, position: 'absolute'}}>{data.discount} %off</Text>
                        }
                        IconBadgeStyle={{
                            width:50,
                            height:16,
                            top : width/3-10,
                            left: 0,
                            position : 'absolute',
                            backgroundColor: '#87cefa'}}
                    />
                    <EvilIcons style={{ position : 'absolute', left : 0}} 
                        name="share-google" 
                        size={20} 
                        color="#ccc" 
                        onPress={()=> this.sharing(data.product_id)}/>

                    <TouchableOpacity 
                    onPress={()=> this.addtoWishlist(data.product_id)}
                    style={{ 
                        left : width/3-35, 
                        position : 'absolute',
                        width : 50,
                        height :50
                    }}
                    >
                        <Ionicons  
                        name={heartType} 
                        size={20} 
                        color="#87cefa" 
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={{ padding :5}}>
                <TouchableOpacity  style={styles.name} onPress={()=>Actions.deascriptionPage({product_id : data.product_id})}>

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
        padding : 10
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
        width : width/3 -7,
        // padding: 5,
        margin: 3,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius : 5
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
        height: width/3,
        borderTopLeftRadius : 5,
        borderTopRightRadius : 5

        // position : "absolute"
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
});