import React, { Component } from 'react';
import {
      ListView,
      TouchableOpacity,
      StyleSheet,
      Text,
      View,
      Picker,
      AsyncStorage,
      ActivityIndicator,
      ScrollView,
      Button,
      RefreshControl
  } from 'react-native';
import { Actions} from "react-native-router-flux";

import Utils from 'app/common/Utils';

export default class ServiceOrder extends Component {
     constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            loaded: false,
            refreshing: false,
            u_id : null,
            country : null,
            status : false
        };
    }

    componentDidMount() {
        this.getKey()
        .then(()=>this.fetchData())
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

     _onRefresh () {
    this.setState({refreshing: true}, ()=> {this.fetchData()});
            
  }

    fetchData (){
        const { u_id,country, } = this.state; 

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

        fetch(Utils.gurl('getbookedServiceForVendor'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded: true,
                    status: responseData.status,
                });
            }else {
                this.setState({
                    status: responseData.status,
                    loaded: true,

                })
            }
        })
        .catch((errorMessage, statusCode) => {
             this.setState({
                loaded     : true,
                status     : false
            });
        })
        .done();        

    }
    noItemFound(){
        return (
            <View style={{ flex:1,  justifyContent:'center', alignItems:'center'}}>
                <Text>You Have No Itmes In Service</Text>
            </View> 
        );
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
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
        <View>
            {listView}
        </View>
 
        );
    }

    renderLoadingView() {
        return (
            <ActivityIndicator  
            style={[styles.centering]}
            color="#1e90ff" 
            size="large"/>
            );
    }
    renderData(data, rowData, sectionID, rowID, index) {
        let color = data.serviceDetail.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.serviceDetail.special_price ? 'line-through' : 'none';

        return (
            <TouchableOpacity  
            style={{ flexDirection : 'column'}} 
            key={rowID} 
            data={rowData} 
            onPress={()=>Actions.servicecustomer({
                title :data.userDetail.fullname,
                addressDetail : data.addressDetail,
            })}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Booking Date: {data.service_datetime}</Text>
                    <Text style={styles.headerText}>Amount : {data.amount}</Text>
                </View>
                <View style={{ flexDirection : 'column', left : 10}} >
                    <View style={styles.row}>
                    <Text style={styles.label}>Service Name : </Text>
                    <Text style={styles.bodyText}>{data.serviceDetail.service_name}</Text>

                    </View>
                    <View style={styles.row}>
                    <Text style={styles.label}>Customer Name : </Text>
                    <Text style={styles.bodyText}>{data.userDetail.fullname}</Text>
                    </View>
                    <View style={styles.row}>
                    <Text style={[styles.label]}>Customer Email : </Text>
                    <Text style={styles.bodyText}>{data.userDetail.email}</Text>
                    </View>
                    <View style={styles.row}>
                    <Text style={styles.label}>Price : </Text>
                    <Text style={styles.bodyText}> {data.serviceDetail.special_price} </Text>
                    <Text style={[styles.bodyText , {color: color, textDecorationLine: textDecorationLine}]}>{data.serviceDetail.price}</Text>
                    </View>
                </View>

            </TouchableOpacity>
            );
    }

    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
        <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}/>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },

    row: {
        flexDirection: 'row',
        // justifyContent: 'center',
        // padding: 10,
        backgroundColor: '#F6F6F6'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#a9d5d1'
    },

    thumb: {
        width   :50,
        height  :50,
    },
    label : {
        color : "#a9d5d1",
        fontSize : 12
    },

    headerText :{
        fontSize: 12,
        color : '#fff'
    },
    bodyText :{
        fontSize: 11,
    },

    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },

    heading: {
        paddingTop : 5,
        paddingBottom : 5,
        backgroundColor : '#fff',
        borderBottomWidth : 3,
        borderBottomColor : '#a9a9a9'
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