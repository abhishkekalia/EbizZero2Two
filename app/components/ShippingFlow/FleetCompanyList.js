import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ListView,
    ScrollView,
    Dimensions,
    AsyncStorage,
    Image,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';

import {connect} from 'react-redux';
import api from "app/Api/api";
import {Actions as routes} from "react-native-router-flux";

const { width, height } = Dimensions.get('window');

class FleetCompanyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            fleetCompanyList: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.fleetCompanyFilter("148");
    }

    fleetCompanyFilter(order_id){
        let pickUp_latitude = "22.966425",
        pickUp_longitude = "72.615933",
        min_price = "0",
        max_price = "5000";

        api.fleetCompanyFilter(order_id, pickUp_latitude, pickUp_longitude, min_price, max_price)
        .then((responseData)=> {
            if(responseData.response.status === "200"){
                AsyncStorage.setItem('fleetCompanydetail', JSON.stringify(responseData.response.data));
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.response.data),
                    fleetCompanyList: responseData.response.data,
                    isLoading: false
                });
            }
            else {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows([]),
                    fleetCompanyList: [],
                    isLoading: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows([]),
                fleetCompanyList: [],
                isLoading: false
            })
        })
        .done();
    }

    render() {
        const { lang } = this.props;
        return(
            <View>
                <View style={{
                    flexDirection: lang === 'en' ? 'row' : 'row-reverse',
                    // marginTop:5,
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    height: 40,
                    alignItems: 'center',
                }}>
                    <Text style={{
                        width: 45,
                        marginLeft: 10,
                    }}>From</Text>
                    <Text>:</Text>
                    <Text style={{
                        marginHorizontal: 5,
                    }}>Ahmedabad, Gujarat, India</Text>
                </View>
                <View style={{
                    flexDirection: lang === 'en' ? 'row' : 'row-reverse',
                    // marginTop:5,
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    height: 40,
                    alignItems: 'center',
                }}>
                    <Text style={{
                        width: 45,
                        marginLeft: 10,
                    }}>To</Text>
                    <Text>:</Text>
                    <Text style={{
                        marginHorizontal: 5,
                    }}>Ahmedabad, Gujarat, India</Text>
                </View>
                {this.state.fleetCompanyList.length > 0 ? <ListView
                    contentContainerStyle={{
                        flexDirection: 'column',
                        padding : 10
                    }}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderfleet.bind(this)}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                /> : 
                    <View style={{
                        // justifyContent:'center',
                        alignItems:'center',
                        // backgroundColor:'red',
                    }}>
                        <Text style={{
                            margin:10, 
                            marginTop:50,
                            fontSize:15,
                        }}>There is no any company found</Text>
                    </View>
                }

                {this.state.isLoading ? <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1}}>
                    <ActivityIndicator
                        // style={[styles.centering]}
                        color="#a9d5d1"
                        size="large"/>
                    </View> : undefined}
            </View>
        )
    }

    renderfleet( data, rowData: string, sectionID: number, rowID: number, index) {
        console.log("data", data);
        var lang = this.props.lang
        return (
            <TouchableWithoutFeedback onPress={this.onPressCompany.bind(this,data)}>
                <View style={{
                        flexDirection: lang === 'en' ? 'row' : 'row-reverse',
                        marginTop : 2,
                        backgroundColor: "#fff",
                        borderWidth : StyleSheet.hairlineWidth,
                        borderColor : "#ccc",
                        borderRadius : 5}
                    }>
                    <Image style={{
                            margin: 10,
                            width: 50,
                            height: 50,
                            resizeMode: 'center'
                        }}
                        source={{ uri : data.image ? data.image : null}}
                    />
                    <View style={{
                        flexDirection:'column',
                        // backgroundColor:'red',
                        width:width-90
                    }}>
                        <Text style={{
                            margin:5,
                            fontSize:18,
                            textAlign: lang === 'en' ? 'left' : 'right'
                        }}>{data.name}</Text>
                        <View style={{
                            flexDirection: lang === 'en' ? 'row' : 'row-reverse',
                        }}>
                            <Text style={{
                                margin:5,
                                fontSize:12,
                                textAlign: lang === 'en' ? 'left' : 'right'
                            }}>Shipping Charge</Text>
                            <Text style={{
                                marginVertical:5,
                                fontSize:12,
                            }}>:</Text>
                            <Text style={{
                                margin:5,
                                fontSize:12,
                                textAlign: lang === 'en' ? 'left' : 'right'
                            }}>{data.price}</Text>
                            <Text style={{
                                marginVertical:5,
                                fontSize:12,
                                textAlign: lang === 'en' ? 'left' : 'right'
                            }}>KWD</Text>
                        </View>
                    </View>
                    {/* <Text onPress={()=> this.conformOrder()} style={{ fontSize:15, color:'#696969', marginBottom:5}}> {JSON.stringify(data)}</Text> */}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    onPressCompany(data) {
        console.log("onPressCompany FleetCompanyList")
        routes.fleetCompanyDetail({
			'companyDetail':data
		})
    }
}

function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
        isGuest: state.auth.isGuest,
    }
}
export default connect(mapStateToProps)(FleetCompanyList);