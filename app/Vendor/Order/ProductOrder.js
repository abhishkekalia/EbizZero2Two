import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    Alert,
} from 'react-native';
import Utils from 'app/common/Utils';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import I18n from 'react-native-i18n';
import {connect} from "react-redux";

class ProductOrder extends Component{
     constructor(props) {
        super(props);
        this.state = this.getInitialState();
        // this.bindMethods();
    }
    // bindMethods() {
    //     if (!this.bindableMethods) {
    //         return;
    //     }
    //
    //     for (var methodName in this.bindableMethods) {
    //         this[methodName] = this.bindableMethods[methodName].bind(this);
    //     }
    // }

    getInitialState() {
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }
        return {
            loaded : false,
            status : false,
            dataSource : new ListView.DataSource({
                u_id                    : null,
                country                 : null,
                getSectionData          : getSectionData,
                getRowData              : getRowData,
                rowHasChanged           : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            })
        }
    }
    componentWillMount() {
        routes.refresh({ right: undefined , left : undefined});
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
    changeorderstatus(order_id, status){
        // this.setState({
        //     loaded: false,
        //     dataSource : new ListView.DataSource({
        //         u_id                    : null,
        //         country                 : null,
        //         getSectionData          : null,
        //         getRowData              : null,
        //         rowHasChanged           : (row1, row2) => row1 !== row2,
        //         sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        //     })
        // })
        let formData = new FormData();
        formData.append('order_id', String(order_id));
        formData.append('status', String(status));
        const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
        fetch(Utils.gurl('changeorderstatus'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.fetchData()
            }else {
                this.fetchData()
            }
        })
        .catch((errorMessage, statusCode) => {
             this.setState({
                loaded     : true,
            });
        })
        .done();
    }
    fetchData () {
        const { u_id,country, } = this.props;
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
        fetch(Utils.gurl('orderList'), config)
            .then((response) => response.json())
            .then((responseData) => {
            
                console.log("responseData:=",responseData)
            var orders = responseData.data,
                length = orders.length,
                dataBlob = {},
                sectionIDs = [],
                rowIDs = [],
                order,
                orderLength,
                i,
                j;
            for (i = 0; i < length; i++) {
                order = orders[i];
                sectionIDs.push(order.order_id);
                dataBlob[order.order_id] = order.order_id;

                orderDetail = order.orderDetail;
                orderLength = orderDetail.length;

                rowIDs[i] = [];

                for(j = 0; j < orderLength; j++) {
                    // orderDetail = orderDetail[j];
                    rowIDs[i].push(orderDetail[j].product_id);
                    dataBlob[order.order_id + ':' + orderDetail[j].product_id ] = orderDetail[j];
                }
            }

            console.log("Data:=dataBlob:=",dataBlob,"sectionIDs:=",sectionIDs,"rowIDs:=",rowIDs)

            if (responseData.status) {
                // this.setState({
                //     dataSource : this.state.dataSource.cloneWithRowsAndSections({}, [], []),
                //     loaded     : true,
                //     status     : responseData.status
                // });
                this.setState({
                    dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                    loaded     : true,
                    status     : responseData.status
                });
            }else {
                this.setState({
                    loaded     : true,
                    status     : responseData.status
                });
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
            <View style={{ flex:1,  justifyContent:'center', alignItems:'center'}}>
                <Text>{I18n.t('home.noitem', { locale: lang })}</Text>
            </View>
        );
    }

    render() {
        let listView = (<View></View>);
            listView = (
                <ListView
                dataSource = {this.state.dataSource}
                style      = {styles.listview}
                renderRow  = {this.renderRow.bind(this)}
                renderSectionHeader = {this.renderSectionHeader.bind(this)}
                enableEmptySections = {true}
                automaticallyAdjustContentInsets={false}
                renderSeparator={this._renderSeparator}
                showsVerticalScrollIndicator={false}
            />
    );

        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.status) {
            return this.noItemFound();
        }
        return (
            <View style={[styles.container, {padding : 5}]}>
                {listView}
            </View>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.centering]}
                    color="#a9d5d1"
                    size="large"/>
            </View>
        );
    }
    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
        <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : StyleSheet.hairlineWidth,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}/>
        );
    }

    renderSectionHeader(sectionData, sectionID) {
        console.log("Header:=sectionData:=",sectionData,"sectionID:=",sectionID)
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={[styles.section, { flexDirection: direction, flexDirection:'row', marginLeft:5, marginRight:5, marginTop:5, borderTopLeftRadius:3, borderTopRightRadius:3}]}>
                {/* <View style={{flexDirection :direction}}>
                    <Text style={styles.label}>{I18n.t('productorder.vendorid', { locale: lang })}</Text>
                    <Text style={styles.label}>:</Text>
                    <Text style={styles.text}>{sectionData}</Text>
                </View> */}
                <View style={{flexDirection :direction, marginLeft:5}}>
                    <Text style={styles.label}>{I18n.t('productorder.orderid', { locale: lang })}</Text>
                    <Text style={styles.label}>:</Text>
                    <Text style={styles.text}>{sectionID}</Text>
                </View>
            </View>
        );
    }
    renderRow (rowData, sectionID, rowID) {
        console.log("Row:=rowData:=",rowData,"sectionID:=",sectionID,"rowID:=",rowID)
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        product_name = lang == 'ar'? rowData.product_name_in_arabic: rowData.product_name;
        let label,
        ord_status;
        if(rowData.order_status === '1'){
            label = I18n.t('vendorproducts.pending', { locale: lang });
            ord_status = 0;
        }
        else if(rowData.order_status === '0'){
            label = I18n.t('vendorproducts.deliverd', { locale: lang });
            ord_status = 1;
        }
        return (
            <View style={styles.row}>
                
                <View style={{ flexDirection : direction}}>
                <Text style={[styles.rowText, {color : '#222', textAlign: textline, alignSelf: 'center', fontSize:18, marginTop:5, marginLeft:10}]}>{product_name} </Text>
                </View>
                <View style={{ flexDirection : direction, backgroundColor:'#fff', marginTop:5, marginLeft:10}}>
                    <Text style={[styles.label,{fontSize:14}]}>{I18n.t('productorder.productid', { locale: lang })} </Text>
                        <Text style={[styles.label,{fontSize:14}]}> : </Text>
                    <Text style={[styles.rowText, { alignSelf: 'center',fontSize:14}]}>{rowData.product_id} </Text>
                </View>
                <View style={{ flexDirection : direction, marginTop:5, marginLeft:10}}>
                    <Text style={[styles.rowText, { color : '#a9d5d1',  textAlign: textline, alignSelf: 'center',fontSize:14}]}>{I18n.t('productorder.qty', { locale: lang })}</Text>
                    <Text style={[styles.rowText, { color : '#a9d5d1', textAlign: textline, alignSelf: 'center',fontSize:14}]}> : </Text>
                    <Text style={[styles.rowText, { color : '#ccc',  textAlign: textline, alignSelf: 'center',fontSize:14}]}>{rowData.quantity} </Text>
                </View>
                <View style={{ flexDirection : direction, marginTop:5, marginLeft:10}}>
                    <Text style={[styles.rowText, {color : '#fbcdc5', textAlign: textline, alignSelf: 'center',fontSize:14}]}>{I18n.t('productorder.price', { locale: lang })}</Text>
                    <Text style={[styles.rowText, {color : '#fbcdc5', textAlign: textline, alignSelf: 'center',fontSize:14}]}> : </Text>
                    <Text style={[styles.rowText, {fontSize:14}]}>{rowData.price} </Text>
                </View>
                <View style={{ flexDirection : direction, marginTop:5, marginLeft:10}}>
                    <Text style={[styles.rowText, {color : '#fbcdc5', textAlign: textline, alignSelf: 'center',fontSize:14}]}>{I18n.t('productorder.specialprice', { locale: lang })}</Text>
                    <Text style={[styles.rowText, {color : '#fbcdc5', textAlign: textline, alignSelf: 'center',fontSize:14}]}> : </Text>
                    <Text style={[styles.rowText, {fontSize:14}]}>{rowData.special_price} </Text>
                </View>
                <View style={[styles.footer, { flexDirection: direction, marginTop:5, backgroundColor:'rgba(247,245,246,1)', height:35, marginLeft:0}]}>
                    <View style={{ flexDirection : direction}}>
                        <Text style={[styles.rowText, {color : '#fbcdc5', textAlign: textline, alignSelf: 'center', marginLeft:10} ]}>{I18n.t('productorder.orderstatus', { locale: lang })} </Text>
                            <Text style={[styles.rowText, {color : '#fbcdc5', textAlign: textline, alignSelf: 'center'} ]}>:</Text>
                        <TouchableOpacity style={{
                                height:'100%', 
                                // backgroundColor:'red', 
                                justifyContent:'center'
                            }} onPress={()=>this.changeorderstatus(rowData.order_id, ord_status)}>
                            <Text style={
                                [styles.rowText, { 
                                    color : '#a9d5d1', 
                                    textAlign: textline, 
                                    alignSelf: 'center', 
                                    // backgroundColor:'yellow',
                                    // height:'100%',
                                    textAlign:'center'
                                }]}>{label} </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                            flexDirection : direction,
                            alignItems:'center',
                        }}>
                        <Text style={[styles.rowText, , {color : '#fbcdc5'}]}>{I18n.t('productorder.orderdate', { locale: lang })}</Text>
                        <Text style={[styles.rowText, , {color : '#fbcdc5'}]}> : </Text>
                        <Text style={styles.rowText}>{ rowData.order_date} </Text>
                    </View>
                </View>
            </View>
        );
    }
};
var styles = StyleSheet.create({
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    label : {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fbcdc5'
    },
    text: {
        color: '#696969',
        paddingHorizontal: 8,
        fontSize: 16
    },
    rowStyle: {
        flex : 1,
            flexDirection: 'column' ,
            marginTop : 2,
            borderWidth : 1,
            borderColor : "#ccc",
            borderRadius : 2
    },
    footer : {
        justifyContent : 'space-between',
        borderWidth : StyleSheet.hairlineWidth,
        borderColor : 'rgba(228,229,228,1)',
        borderWidth: 1,
        borderBottomLeftRadius:3,
        borderBottomEndRadius:3,
        // marginBottom:5,
        // borderRadius : 2
    },
    rowText: {
        fontSize: 12,
        color: '#696969'
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 5,
        backgroundColor: '#fff',
        borderWidth :StyleSheet.hairlineWidth,
        borderColor : 'rgba(228,229,228,1)'
    },
     container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'transparent'
    },

    row: {
        flexDirection: 'column',
        justifyContent: 'center',
        // padding: 5,
        backgroundColor: '#fff',
        borderColor:'rgba(228,229,228,1)',
        borderWidth:1,
        marginLeft:5,
        marginRight:5,
        borderWidth: 1,
        borderBottomLeftRadius:3,
        borderBottomEndRadius:3,
    },

    thumb: {
        width   :50,
        height  :50,
    },

    textQue :{
        flex: 1,
        fontSize: 18,
        fontWeight: '400',
        left : 5
    },
    centering : {
        flex : 1,
        justifyContent  :'center',
        alignItems : 'center'
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

function mapStateToProps(state) {
	return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
	};
}
export default connect(mapStateToProps)(ProductOrder);
