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

export default class ProductOrder extends Component<{}> {
     constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.bindMethods();
    }

    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }   

        for (var methodName in this.bindableMethods) {
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }

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
        fetch(Utils.gurl('orderList'), config)
            .then((response) => response.json())
            .then((responseData) => {
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
                dataBlob[order.order_id] = order.vendor_id;

                orderDetail = order.orderDetail;
                orderLength = orderDetail.length;
                
                rowIDs[i] = [];

                for(j = 0; j < orderLength; j++) {
                    // orderDetail = orderDetail[j];
                    rowIDs[i].push(orderDetail[j]);
                    dataBlob[orderDetail] = orderDetail;
                }
            }

            if (responseData.status) {
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
                <Text>You Have No Itmes In Ordered</Text>
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

        return this.renderListView();
    }

    renderLoadingView() {
        return (
                <View style={styles.container}>
                    <ActivityIndicator
                        animating={!this.state.loaded}
                        style={[styles.activityIndicator, {height: 80}]}
                        size="large"
                    />
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

    renderListView() {
        return (
            <View style={[styles.container, {padding : 5}]}>
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                    renderSectionHeader = {this.renderSectionHeader}
                    enableEmptySections = {true} 
                    automaticallyAdjustContentInsets={false} 
                    renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.text}>Vendor Id :{sectionData}</Text>
                <Text style={styles.text}>order_id :#{sectionID}</Text>
            </View>
        ); 
    }
};

Object.assign(ProductOrder.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
            let label,
            ord_status;
            if(rowID.order_status === '1'){ 
                label = 'Pending';
                ord_status = 0;
            } 
            else if(rowID.order_status === '0'){
            label = 'Complete';
            ord_status = 1;
        }
            return (
                <View style={styles.row}>
                    <View style={{ flexDirection : 'row'}}>
                        <Text style={[styles.rowText, { color : '#a9d5d1'}]}>Product ID : </Text>

                        <Text style={styles.rowText}># {rowID.product_id} </Text>
                    </View>
                    <View style={{ flexDirection : 'row'}}>
                        <Text style={[styles.rowText, {color : '#222'} ]}>{rowID.product_name} </Text>
                    </View> 
                    <View style={{ flexDirection : 'row'}}>
                        <Text style={[styles.rowText, { color : '#a9d5d1'}]}>Qty :</Text> 
                        <Text style={[styles.rowText, { color : '#ccc'}]}>{rowID.quantity} </Text> 
                    </View>
                    <View style={{ flexDirection : 'row'}}>

                        <Text style={[styles.rowText, {color : '#fbcdc5'}]}>Price: </Text> 
                        <Text style={styles.rowText}>{rowID.price} </Text> 
                    </View>
                    <View style={{ flexDirection : 'row'}}>
                        <Text style={[styles.rowText, {color : '#fbcdc5'}]}>Special Price: </Text> 
                        <Text style={styles.rowText}>{rowID.special_price} </Text> 
                    </View>
                    <View style={styles.footer}>
                        <View style={{ flexDirection : 'row'}}>

                            <Text style={[styles.rowText, {color : '#fbcdc5'} ]}>Order Status : </Text>
                            <TouchableOpacity onPress={()=>this.changeorderstatus(rowID.order_id, ord_status )}> 
                            <Text style={[styles.rowText, { color : '#a9d5d1'}]}>{label} </Text>
                            </TouchableOpacity> 
                        </View>
                        <View style={{ flexDirection : 'row'}}>

                            <Text style={[styles.rowText, , {color : '#fbcdc5'}]}>Order Date : </Text> 
                            <Text style={styles.rowText}>{ rowID.order_date} </Text> 
                        </View>
                    </View>
                </View>
            );
        }
    }
});

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
    text: {
        color: 'white',
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
        flexDirection : 'row', 
        justifyContent : 'space-around', 
        borderWidth : StyleSheet.hairlineWidth, 
        borderColor : '#ccc',
        borderRadius : 2
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
        backgroundColor: '#a9d5d1'
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
        padding: 10,
        backgroundColor: '#F6F6F6'
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
