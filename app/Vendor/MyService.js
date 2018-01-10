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

export default class MyService extends Component {
   constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
        }
    }
 

    componentDidMount() {
        this.fetchData();
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton });    
    }
    _renderRightButton = () => {
        return null
    };

    fetchData(){ 
        const {u_id, country } = this.state; 
        let formData = new FormData();
        formData.append('u_id', String(4));
        formData.append('country', String(1)); 

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
                        type : 'service', 
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
        return (
            <View style={{ 
            width : width-30,
            flexDirection: 'column' ,
            marginTop : 2, 
            borderWidth : 1, 
            borderColor : "#ccc", 
            borderRadius : 2
        }}>
                <Header service_type= {data.service_type}/>
                <TouchableOpacity style={{ 
                flexDirection: 'row', 
                backgroundColor : "#fff",
                borderBottomWidth : 1, 
                borderColor : "#ccc", 
                }}>
                    <Image style={[styles.thumb, {margin: 10}]} 
                    source={{ uri : data.serviceImages[0] ? data.serviceImages[0].image : null}}
                    />  
                    <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>  
                        <Text style={[styles.row, { color:'#000',fontWeight :'bold'}]} > {data.service_name} </Text>
                        <Text style={{ fontSize : 10, color : '#ccc'}} > {data.short_description} </Text>
                        <View style={{ flexDirection : "row", justifyContent : 'space-around'}}>
                            <Text style={{color : '#f53d3d'}} >Special Price : </Text>
                            <Text > {data.special_price} KWD</Text>
                            <Text style={{color : '#f53d3d'}}> Price :</Text>
                            <Text > {data.price} KWD</Text>
                        </View>
                        <View style={{ flexDirection : "row"}}>
                           <Text style={{color : '#f53d3d'}}> Status : </Text>
                           <Text > {data.is_approved ? 'approved' : 'pending'} </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Footer calllback={()=>this.Description(data.service_name, data.serviceImages ,
                    data.short_description, data.detail_description, data.price ,data.special_price)}
                    is_approved = {data.is_approved}
                    product_id= {data.product_id}
                    calldata = {()=>this.fetchData()}/>
            </View>
        );
    }
}

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading : true
        }
    }

  render() {
    return (
      <View style={[styles.row, { borderBottomWidth: 0.5, borderColor:'#ccc'}]}>
      <Text style={{ color : '#f53d3d', paddingLeft: 10}}>Category : </Text>
        <Text style={styles.welcome}>{ this.props.service_type ? this.props.service_type: undefined}
        </Text>
      </View>
    );
  }
}

class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {
            is_approved : this.props.is_approved
        }
    }
    productActiveDeactive(product_id, approv_code){ 
        const {u_id, country } = this.state; 
        let formData = new FormData();
        formData.append('u_id', String(2));
        formData.append('country', String(1)); 
        formData.append('product_id', String(product_id)); 
        formData.append('active_flag', String(approv_code)); 

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
            }
        fetch(Utils.gurl('productActiveDeactive'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.props.calldata();
            }
            else{
                this.props.calldata();
            }
        }).done();
    }
componentWillReceiveProps(){
    this.setState({
        is_approved : this.props.is_approved
    })
}

    render(){
         let approved
        let approv_code
        if(this.state.is_approved === '1'){
            approved = "Deactivate";
            approv_code = '0'
        }else {
            approved = "Activate";
            approv_code = '1'

        }
        return(
        <View style={styles.bottom}>
                    <TouchableOpacity 
                    style={[styles.lowerButton,{ backgroundColor : '#a9d5d1'}]} 
                    onPress={this.props.calllback}>
                        <Text style={{ color :'#fff', fontSize: 12}}>Preview</Text>
                    </TouchableOpacity>
                    
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
        backgroundColor : "transparent",
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