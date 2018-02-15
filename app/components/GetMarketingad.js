import React, { Component ,PropTypes } from 'react';
import {
    ListView,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';

export default class GetMarketing extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id: null,
            country : null,
            status : false
        }
    }
    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
        .done()
    }
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
        const { u_id,  country } = this.state;
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
    fetch(Utils.gurl('getMarketingAd'), config)
        .then((response) => response.json())
        .then((responseData) => {
          // console.warn(responseData);
            if(responseData.status){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    refreshing : false,
                    status : responseData.status
                });
            }else {
                this.setState({
                    status : responseData.status
                });
            }
        })
        .catch((error) => {
            this.setState({
                status : responseData.status
            });
        })
        .done();
    }
    render() {
        let listView = (<View></View>);
                listView = (
                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderData.bind(this)}
                    contentContainerStyle={styles.list}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets={true}
                    removeClippedSubviews={true}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator = {false}
                    alwaysBounceHorizontal= {true}
                    bouncesZoom={false}
                    />
                );
        if ( this.state.dataSource.getRowCount() < 1 ) {
            return (
            <View style={{ height:59, justifyContent: 'center', backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', borderBottomWidth: StyleSheet.hairlineWidth}}>
                <Text style={{ fontSize: 15, fontWeight:'bold' }}>  No Advertise For You</Text>
                </View>
            );
        }

        return (
        <View style={{ borderBottomWidth: 0.5, borderColor: '#CCC' , height: 50}}>{listView}</View>
        );
    }
    renderData(data, rowData: string, sectionID: number, rowID: number, index) {

        return (
            <TouchableOpacity style={styles.row} onPress={()=> Actions.timeLine({
                    uri : data.path })}>
                        <Image style={styles.thumb}
                        source={{ uri : data.path}}
                        />
            </TouchableOpacity>
        );
    }
}

var styles =StyleSheet.create({
    list: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        },
    row: {
        // flex: 1,
        // borderRadius : 40,
        // padding: 5,
        // borderWidth: 1,
        // borderColor: '#CCC'
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 3,
    },

    thumb: {
        width: 40,
        height: 40,
        borderRadius : 40
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    }
});
