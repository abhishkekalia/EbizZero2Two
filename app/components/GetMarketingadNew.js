import React, { Component ,PropTypes } from 'react';
import {
    ListView,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
const { width, height } = Dimensions.get('window')

class GetMarketingadNew extends Component {
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
        this.fetchData()
        .then(()=>console.log("load success"))
        .done();
    }
    // async getKey() {
    //     try {
    //         const value = await AsyncStorage.getItem('data');
    //         var response = JSON.parse(value);
    //         this.setState({
    //             u_id: response.userdetail.u_id ,
    //             country: response.userdetail.country
    //         });
    //     } catch (error) {
    //         console.log("Error retrieving data" + error);
    //     }
    // }
    async fetchData(){
        try {
            const { u_id,  country } = this.props;
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
            // MarketinAdsByCat
            fetch(Utils.gurl('MarketinAdsByCat'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("getMarketingAd Response:=",responseData)
                if(responseData.status){
                    var arrAds = []  //responseData.data
                    // arrAds = this.appendDummyData(arrAds)

                    arrAds[0] = {'index':1, 'data': responseData.data.Products, 'title':'Product', 'arabicTitle':'منتجات'}
                    arrAds[1] = {'index':2, 'data': responseData.data.Services, 'title':'Service', 'arabicTitle':'خدمات'}
                    arrAds[2] = {'index':3, 'data': responseData.data.Accessories, 'title':'Accessories', 'arabicTitle':'أكسسوارات'}
                    arrAds[3] = {'index':4, 'data': responseData.data.External, 'title':'External', 'arabicTitle':'اخر'}
                    
                    this.setState({
                        // dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                        dataSource: this.state.dataSource.cloneWithRows(arrAds),
                        refreshing : false,
                        status : responseData.status
                    });
                }else {
                    var arrAds = []
                    arrAds[0] = {'index':1, 'data': [], 'title':'Product', 'arabicTitle':'منتجات'}
                    arrAds[1] = {'index':2, 'data': [], 'title':'Service', 'arabicTitle':'خدمات'}
                    arrAds[2] = {'index':3, 'data': [], 'title':'Accessories', 'arabicTitle':'أكسسوارات'}
                    arrAds[3] = {'index':4, 'data': [], 'title':'External', 'arabicTitle':'اخر'}
                    // arrAds = this.appendDummyData(arrAds)
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(arrAds),
                        status : responseData.status
                    });
                }
            })
            .catch((error) => {
                console.log("error:=",error)
                this.setState({
                    status : false
                });
            })
            .done();

        } catch (error) {
            console.log(error);
        }
    }

    appendDummyData(arrData) {
        var arrDataTmp = arrData
        if (arrDataTmp.length < 4) {
            console.log("Below 4")
            if (arrDataTmp.length == 3) {
                arrDataTmp.push({'dummy':1})
            }
            else if (arrDataTmp.length == 2) {
                arrDataTmp.push({'dummy':1})
                arrDataTmp.push({'dummy':2})
            }
            else if (arrDataTmp.length == 1) {
                arrDataTmp.push({'dummy':1})
                arrDataTmp.push({'dummy':2})
                arrDataTmp.push({'dummy':3})
            }
            else if (arrDataTmp.length == 0) {
                arrDataTmp.push({'dummy':1})
                arrDataTmp.push({'dummy':2})
                arrDataTmp.push({'dummy':3})
                arrDataTmp.push({'dummy':4})
            }
        }   
        return arrDataTmp
    }

    render() {
        let {country, u_id, deviceId, lang} = this.props,
        align = (lang === 'ar') ?  'flex-end': 'flex-start',
        direction = (lang === 'ar') ?  'row-reverse': 'row';
        let listView = (<View></View>);
        listView = (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                contentContainerStyle={[styles.list, { flexDirection: direction}]}
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
                <View style={{alignItems: align, height:59, justifyContent: 'center', backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', borderBottomWidth: StyleSheet.hairlineWidth}}>
                    <Image style={styles.thumb}
                        source={require('../images/logo.png')} />
                </View>
            );
        }
        return (
            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#CCC'}}>{listView}</View>
        );
    }

    

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        let {lang} = this.props,
        direction = (lang === 'ar') ?  'row-reverse': 'row';
        console.log("GetMarketing:=data:=",data,"rowData:=",rowData)
        var thumUrl = data.data.length > 0 ? (data.data[0].thumbnail_image ? data.data[0].thumbnail_image : "null") : ""
        console.log("thumUrl:=",thumUrl)
        return (
            data.data.length > 0 ? 
            <TouchableOpacity style={[styles.row, 
                { 
                    flexDirection: direction, 
                    width: width/4, 
                    // backgroundColor:'blue',
                    // borderWidth:1, 
                    // borderColor:'gray'
                }]} 
            onPress={()=> Actions.timeLineNew({ ad_type:data.data[0].ad_type, uri : data.data[0].path, arrAdvertise:data.data, index:data.index})}>
                <View style={{
                    // backgroundColor:'red',
                    justifyContent:'center',
                    alignItems:'center',
                    width: width/4, 
                }}>
                    <Image style={{
                            width: 40,
                            height: 40,
                            borderRadius : 20,
                            zIndex: 1,
                            margin: 5,
                            borderColor:'gray',
                            borderWidth:0.5,
                            // backgroundColor:'green',
                        }} 
                        source= {thumUrl === 'null' ? require('../images/no-image.jpg') : { uri : data.data[0].thumbnail_image}}                      
                    />
                    <Text>{lang === 'en' ? data.title : data.arabicTitle}</Text>
                </View>
            </TouchableOpacity>
            : <View style={{
                width: width/4,
                justifyContent:'center',
                alignItems: 'center',
                // backgroundColor:'red',
            }}>  
                <View style={{
                    height:40,
                    width:40, 
                    // backgroundColor: data.index % 2 == 0 ? 'black' : 'white', 
                    borderRadius:20, 
                    margin:5,
                    // borderColor:'gray',
                    // borderWidth:0.5,
                }}>
                    <Image style={{
                        width: 40,
                        height: 40,
                        borderRadius : 20,
                        zIndex: 1,
                        // margin: 5,
                        borderColor:'gray',
                        borderWidth:0.5,
                    }}
                        source={ data.index % 2 == 0 ?  require('../images/logo_black.png') : require('../images/logo.png') } />
                </View> 
               <Text>{lang === 'en' ? data.title : data.arabicTitle}</Text> 
            </View>
        );
    }
}

var styles =StyleSheet.create({
    list: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 3,
        justifyContent:'center',
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius : 20,
        zIndex: 1,
        margin: 5,
        borderColor:'gray',
        borderWidth:0.5,
    },
    OvalShapeView: {
        // marginTop: -10,
        zIndex: 0,
        width: 20,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 20,
        transform: [
            {scaleX: 2}
        ]
    },
    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
    inputExample: {
       borderColor: '#9b9b9b',
       backgroundColor: 'white',
       borderWidth: 1,
       borderStyle: 'solid',
       height: 50,
   },
   inputTop: {
       borderTopLeftRadius: 6,
       borderTopRightRadius: 6,
       borderBottomLeftRadius: 0,
       borderBottomRightRadius: 0,
   },
   inputBottom: {
       borderTopLeftRadius: 0,
       borderTopRightRadius: 0,
       borderBottomLeftRadius: 6,
       borderBottomRightRadius: 6,
       marginBottom: 60
   },
});
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
        isGuest: state.auth.isGuest,
    }
}
export default connect(mapStateToProps)(GetMarketingadNew);
