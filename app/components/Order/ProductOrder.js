import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    Alert,
    Modal,
    Platform,
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
class ProductOrder extends Component{
     constructor(props) {
        super(props);
        this.state = {
            ...this.getInitialState(),
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
        },
        this.bindMethods();
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
        console.log("Request userOrderList:=",config)
        fetch(Utils.gurl('userOrderList'), config)
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
        const { lang} = this.props;
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>{I18n.t('home.noitem', { locale: lang })}</Text>
            </View>
        );
    }
    render() {
        const { lang } =this.props;
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.status) {
            return this.noItemFound();
        }
        let listView = (<View></View>);
        listView = (
            <ListView
                dataSource = {this.state.dataSource}
                style      = {styles.listview}
                renderRow  = {this.renderRow.bind(this)}
                renderSectionHeader = {this.renderSectionHeader.bind(this)}
                enableEmptySections = {true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
            />
        );
        return (
            <View style={[styles.container, {padding : 5}]}>
                {listView}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.visibleMap}
                    onRequestClose={() => this.setState({ visibleMap :false})}>
                    <View style={{ position: 'absolute', zIndex: 1,backgroundColor: "transparent", justifyContent: 'center', height: 30, width: "90%", alignSelf: 'center', marginTop: Platform.OS === 'ios' ? 20 : 10}}>
                        <Icon onPress ={()=>this.setState({ visibleMap :false})} name="close-circle" size={25} color= {Platform.OS === 'ios' ? "black" : "#fff" }  style={ lang === 'ar'?{alignSelf: 'flex-start'} :{alignSelf: 'flex-end'}} on/>
                    </View>
                    <View style={{ flex : 1, justifyContent: 'center', zIndex: 0}}>
                    <MapView
                        initialRegion={{
                            latitude: LATITUDE,
                            longitude: LONGITUDE,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }}
                        style={StyleSheet.absoluteFill}
                        ref={c => this.mapView = c}
                        onPress={this.onMapPress}>
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
                                // onReady={(result) => {
                                    //   this.mapView.fitToCoordinates(result.coordinates, {
                                    //     edgePadding: {
                                    //       right: (width / 20),
                                    //       bottom: (height / 20),
                                    //       left: (width / 20),
                                    //       top: (height / 20),
                                    //     }
                                    //   });
                                    // }}
                                    onError={(errorMessage) => {
                                        // console.log('GOT AN ERROR');
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
                <View style={styles.container}>
                    <ActivityIndicator
                        animating={!this.state.loaded}
                        style={[styles.activityIndicator, {height: 80}]}
                        size="large"
                    />
            </View>
        );
    }
    renderSectionHeader(sectionData, sectionID) {
        let { lang } = this.props;
        let direction = lang == 'ar'? 'row-reverse': 'row';
        console.log("Product Order renderSectionHeader:=sectionData",sectionData,"sectionID:=",sectionID)
        return (
            <View style={{
                // justifyContent: 'space-between',
                // alignItems: 'flex-start',
                padding: 5,
                backgroundColor: '#fff',
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#fbcdc5',
                borderColor: '#ccc',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                marginTop: 5,
                // flexDirection: direction
            }}>
                <View style={{flexDirection: direction}}>
                    <Text style={[styles.text,{ color: '#fbcdc5', fontWeight:'bold'}]}>{I18n.t('userorderhistory.orderdt', { locale: lang })}</Text>
                    <Text style={[styles.text,{ color: '#fbcdc5'}]}> : </Text>
                    <Text style={[styles.text,{ color: '#696969'}]}>{sectionData}</Text>
                </View>
                <View style={{flexDirection: direction, marginTop:5}}>
                    <Text style={[styles.text,{ color: '#a9d5d1', fontWeight:'bold'}]}>{I18n.t('userorderhistory.orderid', { locale: lang })}</Text>
                    <Text style={[styles.text,{ color: '#a9d5d1'}]}> : </Text>
                    <Text style={[styles.text,{ color: '#696969'}]}>{sectionID}</Text>
                </View>
            </View>
        );
    }
    renderRow(rowData, sectionID, rowID) {
        let { lang } = this.props;
        let direction = lang == 'ar'? 'row-reverse': 'row';
        console.log("Product Order renderRow:=",rowID)
        return (
            <TouchableOpacity
                style={{ padding : 10, paddingTop:5, borderWidth:1, borderColor:'#ccc', borderTopWidth:0}}
                onPress ={()=>this.setState({
                    visibleMap :true
                })}
                >
                <View style={[styles.rowStyle, {flexDirection: 'column'}]}>
                    <View style={{ flexDirection : direction,  alignItems: 'center', marginTop:0}}>
                        {/* <Text style={styles.label}>{I18n.t('userorderhistory.productnm', { locale: lang })}</Text>
                            <Text style={styles.rowText}> : </Text> */}
                        <Text style={{
                            fontSize: 17,
                            color: '#696969',
                            fontWeight: 'bold',

                        }}>{ lang === 'ar' ? rowID.product_name_in_arabic : rowID.product_name} </Text>
                    </View>

                    <View style={{ flexDirection : direction,  alignItems: 'center', marginTop:5}}>
                        {/* <Text style={styles.label}>{I18n.t('userorderhistory.productnm', { locale: lang })}</Text>
                            <Text style={styles.rowText}> : </Text> */}
                        <Text style={{
                            fontSize: 13,
                            color: '#696969',

                        }}>{ lang === 'ar' ? rowID.short_description_in_arabic : rowID.short_description} </Text>
                    </View>
                    
                    <View style={{ flexDirection : direction,  alignItems: 'center',marginTop: 5}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.productid', { locale: lang })}</Text>
                            <Text style={styles.rowText}> : </Text>
                            <Text style={styles.rowText}>{rowID.product_id} </Text>
                    </View>
                    <View style={{ flexDirection : direction,  alignItems: 'center', marginTop:5}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.quantity', { locale: lang })}</Text>
                            <Text style={styles.rowText}> : </Text>
                        <Text style={styles.rowText}>{rowID.quantity} </Text>
                    </View>
                    <View style={{ flexDirection : direction,  alignItems: 'center', marginTop:5}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.orderstatus', { locale: lang })}</Text>
                            <Text style={styles.rowText}> : </Text>
                        <Text style={styles.rowText}>{ rowID.order_status ? 'pending' : 'paid'} </Text>
                    </View>
                    <View style={{ flexDirection : direction, alignItems: 'center', marginTop:5}}>
                        <Text style={styles.label}>{I18n.t('userorderhistory.price', { locale: lang })}</Text>
                            <Text style={styles.rowText}> : </Text>
                        <Text style={styles.rowText}>{rowID.price} </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
};

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
        // paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    text: {
        fontSize: 14
    },
    rowStyle: {
        // paddingVertical: 5,
        paddingTop:5,
        // borderTopColor: 'white',
        // borderLeftColor: 'white',
        // borderRightColor: 'white',
        // borderBottomColor: '#E0E0E0',
        // borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
    },
    rowText: {
        fontSize: 12,
        color: '#696969'
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    label : {
      color : "#fbcdc5",
      fontSize : 13,
      fontWeight : 'bold',
    },
    section: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 5,
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#fbcdc5',
        borderColor: '#ccc',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginTop: 5,
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
export default connect(mapStateToProps)(ProductOrder);
