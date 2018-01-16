import React, { Component } from 'react';
import { 
    StyleSheet, 
    ActivityIndicator, 
    ListView, 
    Text, 
    View, 
    Image, 
    Platform,
    Dimensions,
    TouchableOpacity, 
    AsyncStorage, 

} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Utils from 'app/common/Utils';

 const { width, height } = Dimensions.get('window')

export default class FeaturedProduct extends Component {
   constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id : null,
            country : null,
            status : false
        }
    }
 
    GetItem (flower_name) {
        alert(flower_name); 
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
        fetch(Utils.gurl('featureItemList'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                isLoading : false,
                status : responseData.status
                });
            }
            else{
                this.setState({
                isLoading : false,
                status : responseData.status

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
    noItemFound(){
        return (
            <View style={{ flex:1,  justifyContent:'center', alignItems:'center'}}>
                <Text>You Have No Featured Product</Text>
            </View> 
        );
    }


    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                  <ActivityIndicator />
                </View>
            );
        }
        if (!this.state.status) {
            return this.noItemFound();
        }

        let listView = (<View></View>);
            listView = (
               <ListView
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
    renderData(data: string, sectionID: number, rowID: number, index) {
        let color = data.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';

        return (
            <View style={{ 
            width : width-30,
            flexDirection: 'column' ,
            marginTop : 2, 
            borderWidth : 1, 
            borderColor : "#ccc", 
            borderRadius : 2
        }}>
                <Header product_id= {data.product_id}/>
                <TouchableOpacity style={{ 
                flexDirection: 'row', 
                backgroundColor : "#fff",
                borderBottomWidth : 1, 
                borderColor : "#ccc", 
                }}>
                    <Image style={[styles.thumb, {margin: 10}]} 
                    source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}
                    />  
                    <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>  
                        <Text style={[styles.row, { color:'#000',fontWeight :'bold'}]} > {data.product_name} </Text>
                        <Text style={{ fontSize : 10, color : '#ccc'}} > {data.short_description} </Text>

                        <View style={{ flexDirection : "row", justifyContent : 'space-around'}}>
                            <Text style={{color : '#f53d3d'}}> Price :</Text>
                            <Text > {data.special_price} KWD </Text>
                            <Text style={{color : color, textDecorationLine: textDecorationLine}}> {data.price} KWD </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Footer calllback={()=>this.Description(data.product_name, data.productImages ,
                    data.short_description, data.detail_description, data.price ,data.special_price)}
                    start_date = {data.start_date}/>
            </View>
        );
    }
}

class Header extends Component{
  render() {

    return (
      <View style={[styles.row, { borderBottomWidth: 0.5, borderColor:'#ccc'}]}>
      <Text style={{ color : '#f53d3d', paddingLeft: 10}}>Product Id : </Text>
        <Text style={styles.welcome}>{this.props.product_id }</Text>
      </View>
    );
  }
}

class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
// componentWillReceiveProps(){
    // this.setState({
    // })
// }

    render(){
        return(
        <View style={styles.bottom}>
                    <TouchableOpacity 
                    style={[styles.lowerButton,{ backgroundColor : '#a9d5d1'}]} 
                    onPress={this.props.calllback}>
                        <Text style={{ color :'#fff', fontSize: 12}}>Preview</Text>
                    </TouchableOpacity>
                    <View >
                        <Text style={{ color :'#000', fontSize : 12}}>Display Date : {this.props.start_date}</Text>
                    </View>
                </View>
        )
    }
}
const styles = StyleSheet.create({ 
    container: {
        flexDirection: 'column',
        padding : 10 
    },

    row: {
        flexDirection: 'row',
        marginTop : 1
    },
    qtybutton: {
        paddingLeft: 10,
        paddingRight: 10,

        alignItems: 'center',
        borderWidth : 0.5,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
        countryIcon: {
        width : 40,
        height:40,
        padding :10
    },


    lowerButton :{
        // alignItems : 'center', 
        borderWidth : 0.5, 
        borderColor : "#ccc",
        padding : 5,
        borderRadius : 5
    },

    thumb: {
        width   : "20%",
        height  :width/5 ,
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
        flexDirection : 'row',
        justifyContent : 'space-between',
        backgroundColor : "#fff",
        padding : 5
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
});