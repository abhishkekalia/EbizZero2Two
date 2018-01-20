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

export default class OrderList extends Component<{}> {
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
        fetch(Utils.gurl('userOrderList'), config)
     
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
    
                dataBlob[order.order_id] = order.inserted_date;

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
        .catch((error) => {
          console.log(error);
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
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.text}>{sectionData}</Text>
                <Text style={styles.text}>#{sectionID}</Text>
            </View>
        ); 
    }
};

Object.assign(OrderList.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableOpacity 
                style={{ padding : 10}}  
                // onPress={() => this.onPressRow(rowData, sectionID)}
                >
                    <View style={styles.rowStyle}>
                        <View style={{ flexDirection : 'column'}}>
                            <Text style={styles.rowText}>Product ID </Text>
                            <Text style={styles.rowText}>#{rowID.order_id} </Text>
                        </View>
                        <View style={{ flexDirection : 'column'}}>
                            <Text style={styles.rowText}>Product Name </Text> 
                            <Text style={styles.rowText}>{rowID.product_name} </Text>
                    </View> 
                    <View style={{ flexDirection : 'column'}}>
                        <Text style={styles.rowText}>Quantity</Text> 
                        <Text style={styles.rowText}>{rowID.quantity} </Text> 
                    </View>
                    <View style={{ flexDirection : 'column'}}>
                        <Text style={styles.rowText}>Order Status</Text> 
                        <Text style={styles.rowText}>{ rowID.order_status ? 'pending' : 'paid'} </Text> 
                    </View>
                    <View style={{ flexDirection : 'column'}}>
                        <Text style={styles.rowText}>price</Text> 
                        <Text style={styles.rowText}>{rowID.price} </Text> 
                    </View>
                     </View>
                </TouchableOpacity>
            );
        },
        onPressRow : function (rowData, sectionID) {
            var buttons = [
                {
                    text : 'Cancel'
                },
                {
                    text    : 'OK',
                    onPress : () => this.createCalendarEvent(rowData, sectionID)
                }
            ]
            Alert.alert('User\'s Email is ' + rowData.email, null, null);
        }

    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
        paddingVertical: 20,
        // paddingLeft: 16,
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: '#E0E0E0',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    rowText: {
        fontSize: 12
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
    }
});
