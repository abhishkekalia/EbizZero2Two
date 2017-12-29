import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
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
            dataSource : new ListView.DataSource({
                getSectionData          : getSectionData,
                getRowData              : getRowData,
                rowHasChanged           : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            })
        }
    }
    
    componentDidMount() {
        this.fetchData();
    }

    fetchData () {
        let formData = new FormData();
        formData.append('u_id', String(8));
        formData.append('country', String(1)); 

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
                users,
                orderLength,
                product_name,
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
                    orderDetail = orderDetail[j];
                    rowIDs[i].push(orderDetail);

                    dataBlob[orderDetail] = orderDetail;
                }
            }

            this.setState({
                dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                loaded     : true
            });

        }).done();        
    }    

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
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
            <View style={styles.container}>
               
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                    renderSectionHeader = {this.renderSectionHeader}
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
            // console.warn(rowID);
            return (
                <TouchableOpacity  
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
        padding: 6,
        backgroundColor: '#ccc'
    }
});
