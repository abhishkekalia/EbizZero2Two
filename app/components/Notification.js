import React, { Component ,PropTypes } from 'react';
import {
    ListView,
    TouchableOpacity, 
    StyleSheet,
    Dimensions, 
    Text, 
    View,
    Image ,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
const { width, height } = Dimensions.get('window')


export default class Notification extends Component {
    constructor(props) {
        super(props);        
        this.state={ 
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }), 
            dataSource2: new ListView.DataSource({  rowHasChanged: (row1, row2) => row1 !== row2 }), 
            loaded: false,
            toggle : false,
            refreshing: false,

        }
    }

    componentDidMount(){
        this.fetchData()
    }
    _onRefresh() {
    this.setState({refreshing: true});
            this.fetchData();
    }


    fetchData(){ 
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
    fetch(Utils.gurl('notificationList'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data), 
                loaded: true, 
                refreshing: false
        });
        }).done();
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        let listView = (<View></View>);
            listView = (
                <ListView 
                refreshControl={ 
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh} />
                }
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                renderSeparator={this._renderSeparator}
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
    renderLoadingView() {
        return (
            <ActivityIndicator  
            style={[styles.centering]} //styles.gray]}
            color="#1e90ff" 
            size="large"/>
            );
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        let Status 
        if (data.order_status == 0 ) { 
            Status = 'pending' } else { 
            Status = 'delivered'
        };

         return (
            <TouchableOpacity>
            <View style={styles.row}>
                <View style={{ flexDirection : 'row'}}>
                <Text># {data.order_id}</Text>
                <Text>{data.type}</Text>
                </View>
                <View style={{justifyContent:'space-between', flexDirection : 'row'}}>
                    <View style={{ flexDirection : 'row'}}>
                        <Text>Delivery Status : </Text>
                        <Text>{Status}</Text>
                    </View>
                    <Text>{data.type}</Text>
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