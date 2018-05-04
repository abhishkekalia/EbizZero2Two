import React, { Component ,PropTypes } from 'react';
import {
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    View,
    Image,
    RefreshControl,
    Modal,
    ActivityIndicator
} from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
import {connect} from "react-redux";
import I18n from 'react-native-i18n';
// import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 22.966425;
const LONGITUDE = 72.615933;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            dataSource2: new ListView.DataSource({  rowHasChanged: (row1, row2) => row1 !== row2 }),
            loaded: false,
            toggle : false,
            refreshing: false,
            visibleMap: false,
            coordinates: [
              {
                latitude: 22.966425,
                longitude: 72.615933,
              },
              {
                latitude: 22.996170,
                longitude: 72.599584,
              },
            ],
        }
        this.mapView = null;
    }
    onMapPress = (e) => {
      this.setState({
        coordinates: [
          ...this.state.coordinates,
          e.nativeEvent.coordinate,
        ],
      });
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
            console.log("notificationList:= Request",config)
            fetch(Utils.gurl('notificationList'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("notificationList:= Response",responseData)
                if(responseData.status){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                        loaded: true,
                        refreshing: false
                    });
                }else{
                    this.setState({
                        loaded: true,
                        refreshing: false
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        } catch (error) {
            console.log(error);
        }
    }
    noItemFound(){
        const {lang} = this.props;
        let side = lang === "ar" ? "right" : "left";
        return (
            <View style={{ flexDirection:'column', justifyContent:'flex-start', alignItems:'center', flex:1}}>
                <Text style={{
                    marginBottom:40,
                    marginTop:40,
                    color: "gray",
                }}> {I18n.t('notification.nonotification', { locale: lang })} </Text>
                <Image source={require("app/images/notification_img.png")} style={{width: 80, height: 80}}/>
                <Text style={{ 
                    color: "#fbcdc5", 
                    alignSelf: 'center',
                    marginTop:40,
                }}> {I18n.t('notification.notifyonce', { locale: lang })} </Text>
            </View>
        );
    }

    render() {
        const {lang} = this.props;
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
        let data = (this.state.dataSource.getRowCount() < 1) ? this.noItemFound() : listView;
        return (
            <View style={{flex:1}}>
                {data}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.visibleMap}
                    onRequestClose={() => this.setState({ visibleMap :false})}>
                    <View style={{ position: 'absolute', zIndex: 1,backgroundColor: "transparent", justifyContent: 'center', height: 30, width: "90%", alignSelf: 'center', marginTop: 10}}>
                        <Icon onPress ={()=>this.setState({ visibleMap :false})} name="close" size={25} color="#fff" style={ lang === 'ar'?{alignSelf: 'flex-start'} :{alignSelf: 'flex-end'}} on/>
                    </View>
                    <View style={{ flex : 1, justifyContent: 'center', zIndex: 0}}>
                        <MapView
                            initialRegion={{
                                latitude: LATITUDE,
                                longitude: LONGITUDE,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            style={StyleSheet.absoluteFill}
                            ref={c => this.mapView = c}
                            onPress={this.onMapPress}
                            >
                            {this.state.coordinates.map((coordinate, index) =>
                                <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} >
                                    <FontAwesome name="car" size={15} color="#FFCC7D"/>
                                </MapView.Marker>
                            )}
                            {(this.state.coordinates.length >= 2) && (
                                <MapViewDirections
                                    origin={this.state.coordinates[0]}
                                    waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): null}
                                    destination={this.state.coordinates[this.state.coordinates.length-1]}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={5}
                                    strokeColor="#a9d5d1"
                                    onStart={(params) => {
                                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                    }}
                                    onError={(errorMessage) => {
                                        console.log('GOT AN ERROR');
                                    }}
                                    />
                            )}
                        </MapView>
                    </View>
                </Modal>
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
        console.log(data);
        const { lang } = this.props,
        direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left';
        let Status
        if (data.order_status == 0 ) {
            Status = I18n.t('vendorproducts.pending', { locale: lang })
        } else {
            Status = I18n.t('vendorproducts.deliverd', { locale: lang })
        };
        return (
            <View style={styles.row}>
                <View style={{ flexDirection : 'column', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: direction}}>
                        <Text style={{color: "#a9d5d1", textAlign: align}}>{I18n.t('notification.product_id', { locale: lang })}</Text>
                        <Text style={{color: "#a9d5d1", alignSelf: 'center'}}> : </Text>
                        <Text style={{ textAlign: align}}>{data.product_id}</Text>
                    </View>
                    <View style={{flexDirection: direction}}>
                        <Text style={{color: "#a9d5d1", textAlign: align}}>{I18n.t('notification.orderId', { locale: lang })}</Text>
                        <Text style={{color: "#a9d5d1", alignSelf: 'center'}}> : </Text>
                        <Text style={{ textAlign: align}}>{data.order_id}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress ={()=>this.setState({
                        visibleMap :true
                    })}
                    style={{justifyContent:'space-between', flexDirection : 'column'}}>
                    <View style={{ flexDirection : direction}}>
                        <Text style={{color: "#a9d5d1", textAlign: align}}>{I18n.t('notification.deliveryStatus', { locale: lang })}</Text>
                        <Text style={{color: "#a9d5d1", alignSelf: 'center'}}> : </Text>
                        <Text style={{ textAlign: align}}>{Status}</Text>
                    </View>
                    <View style={{ flexDirection : direction}}>
                        <Text style={{color: "#a9d5d1", textAlign: align}}>{I18n.t('notification.orderType', { locale: lang })}</Text>
                        <Text style={{color: "#a9d5d1" , alignSelf: 'center'}}> : </Text>
                        <Text  style={{ textAlign: align}}>{data.type}</Text>
                    </View>
                </TouchableOpacity>
            </View>
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
