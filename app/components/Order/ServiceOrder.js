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
        this.setState({
            refreshing: true
        }, ()=> {this.fetchData()
        });
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
        fetch(Utils.gurl('getbookedServiceForUser'), config)
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
            console.log(errorMessage);
        })
        .done();
    }
    noItemFound(){
        const { lang} = this.props;
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
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
        let { lang } = this.props;
        let direction = lang == 'ar'? 'row-reverse': 'row';
        let color = data.serviceDetail.special_price ? '#000' : '#000';
        let textDecorationLine = data.serviceDetail.special_price ? 'line-through' : 'none';
        return (
            <TouchableOpacity
                style={{ flexDirection : 'column'}}
                key={rowID}
                data={rowData}
                onPress={()=>Actions.serviceusr({
                    title :data.addressDetail.fullname,
                    addressDetail : data.addressDetail,
                    lang:lang
                })}>
                <View style={[styles.header,{ flexDirection: direction}]}>
                    <View style={{ flexDirection: direction}}>
                        <Text style={[styles.headerText, {color: '#fbcdc5'}]}>{I18n.t('userorderhistory.bookingdt', { locale: lang })}</Text>
                        <Text style={[styles.headerText, {color: '#fbcdc5'}]}>: </Text>
                        <Text style={[styles.headerText, {color: '#fbcdc5'}]}>{data.service_datetime}</Text>
                    </View>
                    <View style={{ flexDirection: direction}}>
                        <Text style={[styles.headerText, {color: '#a9d5d1'}]}>{I18n.t('userorderhistory.amount', { locale: lang })}</Text>
                        <Text style={[styles.headerText, {color: '#a9d5d1'}]}>:</Text>
                        <Text style={[styles.headerText, {color: '#a9d5d1'}]}>{data.amount}</Text>
                    </View>
                </View>
                <View style={{ flexDirection : 'column', paddingLeft:10, paddingTop:5, paddingBottom:5, backgroundColor: '#F6F6F6'}} >
                    <View style={{flexDirection: direction, paddingTop:1}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.servicename', { locale: lang })}</Text>
                            <Text style={styles.label}>: </Text>
                        <Text style={styles.bodyText}>{data.serviceDetail.service_name}</Text>
                    </View>
                    <View style={{flexDirection: direction, paddingTop:1}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.customeremail', { locale: lang })}</Text>
                            <Text style={styles.label}>: </Text>
                        <Text style={styles.bodyText}>{data.serviceDetail.short_description}</Text>
                    </View>
                    <View style={{flexDirection: direction, paddingTop:1}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.price', { locale: lang })}</Text>
                        <Text style={styles.label}>: </Text>
                        <Text style={styles.bodyText}> {data.serviceDetail.special_price} </Text>
                        <Text style={[styles.bodyText , {color: color, textDecorationLine: textDecorationLine}]}>{data.serviceDetail.price}</Text>
                        <Text style={styles.label}> KWD </Text>
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
                    backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC'
                }
            }/>
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
    header: {
        padding:5,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#fbcdc5'
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
