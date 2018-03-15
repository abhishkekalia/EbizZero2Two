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
import {connect} from "react-redux";
import I18n from 'react-native-i18n'
const { width, height } = Dimensions.get('window')
class Notification extends Component {
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
        .done();
    }
    _onRefresh() {
        this.setState({refreshing: true});
        this.fetchData()
        .done();
    }
    async fetchData(){
        try {
            const { country, u_id }= this.props;
            let formData = new FormData();
            formData.append('u_id', String(7));
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
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        let listView = (<View></View>);
        listView = (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)} />
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
        const { lang } = this.props;
        let Status
        if (data.order_status == 0 ) {
            Status = I18n.t('vendorproducts.pending', { locale: lang })
        } else {
            Status = I18n.t('vendorproducts.deliverd', { locale: lang })
        };
        return (
            <TouchableOpacity style={styles.row}>
                    <View style={{ flexDirection : 'row', justifyContent: 'space-between', height: 20, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', borderColor: "#fbcdc5"}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: "#a9d5d1"}}>Order Id</Text>
                            <Text style={{color: "#a9d5d1"}}>:</Text>
                            <Text style={{}}>{data.order_id}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: "#a9d5d1"}}>Order Type</Text>
                            <Text style={{color: "#a9d5d1"}}>:</Text>
                            <Text>{data.type}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:'space-between', flexDirection : 'row',alignItems: 'center', height: 40}}>
                        <View style={{ flexDirection : 'row'}}>
                            <Text style={{color: "#a9d5d1"}}>Delivery Status</Text>
                            <Text style={{color: "#a9d5d1"}}>:</Text>
                            <Text>{Status}</Text>
                        </View>
                        <Text>{data.type}</Text>
                    </View>
            </TouchableOpacity>
        );
    }
    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={{ height: StyleSheet.hairlineWidth, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC'}}/>
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
function mapStateToProps(state) {
    return {
        identity: state.identity,
		lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
    };
}
export default connect(mapStateToProps)(Notification);
