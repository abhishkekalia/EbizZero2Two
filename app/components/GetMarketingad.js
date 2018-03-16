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
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'

class GetMarketing extends Component {
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
            fetch(Utils.gurl('getMarketingAd'), config)
            .then((response) => response.json())
            .then((responseData) => {
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

        } catch (error) {
            console.log(error);
        }
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
                <View style={{alignItems: align, height:59, justifyContent: 'center', backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', borderBottomWidth: StyleSheet.hairlineWidth}}>
                    <Image style={styles.thumb}
                        source={require('../images/logo.png')} />
                </View>
            );
        }
        return (
            <View style={{ borderBottomWidth: 0.5, borderColor: '#CCC'}}>{listView}</View>
        );
    }
    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        return (
            <TouchableOpacity style={[styles.row, { flexDirection: direction}]} onPress={()=> Actions.timeLine({ ad_type:data.ad_type, uri : data.path })}>
                <Image style={styles.thumb} source={{ uri : data.thumbnail_image}}/>
                <View style={styles.OvalShapeView} />
            </TouchableOpacity>
        );
    }
}

var styles =StyleSheet.create({
    list: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 3,
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius : 20,
        zIndex: 1
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
    }
}
export default connect(mapStateToProps)(GetMarketing);
