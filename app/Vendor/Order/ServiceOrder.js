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
import I18n from 'react-native-i18n';
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
        console.log("Request getbookedServiceForVendor:=",config)
        fetch(Utils.gurl('getbookedServiceForVendor'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("getbookedServiceForVendor responseData:=",responseData)
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
        const { lang} = this.props;
        return (
            <View style={{ flex:1,  justifyContent:'center', alignItems:'center'}}>
                <Text>{I18n.t('home.noitem', { locale: lang })}</Text>
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
        <View style={{marginBottom : 60}}>
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
        console.log("service data:=",data)
        let color = data.serviceDetail.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.serviceDetail.special_price ? 'line-through' : 'none';

        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left',
        service_name = lang == 'ar'? data.serviceDetail.service_name_in_arabic: data.serviceDetail.service_name;
        return (
            <TouchableOpacity
            style={{ flexDirection : 'column', backgroundColor: "#fff"}}
            key={rowID}
            data={rowData}
            onPress={()=>Actions.servicecustomer({
                title :data.userDetail.fullname,
                addressDetail : data.addressDetail,
            })}>
                <View style={{ height : 40,
                            // justifyContent: 'space-around',
                            alignItems : 'center',
                            backgroundColor: '#fff',
                            borderWidth :StyleSheet.hairlineWidth,
                            borderColor : '#fbcdc5',
                            flexDirection: direction, 
                            marginHorizontal:10, 
                            marginTop:5,
                            paddingLeft:5,
                            borderColor:'#ccc',
                            borderTopLeftRadius:5,
                            borderTopRightRadius:5,
                        }}>
                    <View style={{flexDirection: direction, backgroundColor: '#fff'}}>
                        <Text style={[styles.labelHeader,{ textAlign: textline}]}>{I18n.t('serviceorder.bookingdt', { locale: lang })}</Text>
                            <Text style={styles.labelHeader}> : </Text>
                        <Text style={styles.bodyTextHeader}>{data.service_datetime}</Text>
                    </View>
                    {/* <View style={{flexDirection: direction, backgroundColor: '#fff'}}>
                        <Text style={[styles.label,{ textAlign: textline}]}>{I18n.t('serviceorder.amount', { locale: lang })}</Text>
                        <Text style={styles.label}> : </Text>
                        <Text style={styles.bodyText}>{data.amount}</Text>
                    </View> */}
                </View>
                <View style={lang == 'ar'? { 
                            // right : 10,
                            // marginTop:5, 
                            borderColor:'#ccc', 
                            borderWidth:1,
                            paddingHorizontal:10,
                            marginHorizontal:10,
                        } : 
                        { 
                            // left : 10, 
                            marginHorizontal:10, 
                            // marginTop:5, 
                            borderColor:'#ccc', 
                            borderWidth:1,
                            paddingHorizontal:10,
                            borderTopWidth:0,
                            borderBottomLeftRadius:5,
                            borderBottomRightRadius:5,
                        }}>
                    <View style={{flexDirection: direction, backgroundColor: '#fff', marginTop:10}}>
                        <Text style={[styles.label,{ textAlign: textline}]}>{I18n.t('serviceorder.servicenm', { locale: lang })}</Text>
                            <Text style={styles.label}> : </Text>
                        <Text style={styles.bodyText}>{service_name}</Text>
                    </View>
                    <View style={{flexDirection: direction, backgroundColor: '#fff', marginTop:10}}>
                        <Text style={[styles.label,{ textAlign: textline}]}>{I18n.t('serviceorder.customername', { locale: lang })}</Text>
                        <Text style={styles.label}> : </Text>
                        <Text style={styles.bodyText}>{data.userDetail.fullname}</Text>
                    </View>
                    <View style={{flexDirection: direction, backgroundColor: '#fff', marginTop:10}}>
                        <Text style={[styles.label,{ textAlign: textline}]}>{I18n.t('serviceorder.customeremail', { locale: lang })}</Text>
                        <Text style={styles.label}> : </Text>
                        <Text style={styles.bodyText}>{data.userDetail.email}</Text>
                    </View>
                    <View style={{flexDirection: direction, backgroundColor: '#fff', marginTop:10, marginBottom:10}}>
                        <Text style={[styles.label,{ textAlign: textline}]}>{I18n.t('serviceorder.price', { locale: lang })}</Text>
                        <Text style={styles.label}> : </Text>
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
        height : 40,
        justifyContent: 'space-around',
        alignItems : 'center',
        backgroundColor: '#fff',
        borderWidth :StyleSheet.hairlineWidth,
        borderColor : '#fbcdc5'
    },

    thumb: {
        width   :50,
        height  :50,
    },
    label : {
        color : "#a9d5d1",
        fontSize : 14,
        fontWeight:'bold',
    },
    labelHeader : {
        color : "#a9d5d1",
        fontSize : 16,
        fontWeight:'bold',
    },

    headerText :{
        fontSize: 12,
        color : '#696969'
    },
    bodyText :{
        fontSize: 14,
    },
    bodyTextHeader :{
        fontSize: 16,
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
