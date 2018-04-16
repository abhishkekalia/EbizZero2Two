import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ListView,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import AddService from "./AddService";
import MyService from "./MyService";
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import Utils from 'app/common/Utils';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import api from 'app/Api/api';
import EventEmitter from "react-native-eventemitter";

const { width, height } = Dimensions.get('window')
class Service extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
            selectedIndices: [0],
            customStyleIndex: 0,
            isLoading: true,
            dataSource : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2 }),
            text: '',
            ShowSearch : false,
            Shortrows : [],
        }
        this.arrayholder = [] ;
    }
    componentDidMount(){
        this.fetchData()
        EventEmitter.removeAllListeners("serviceList");
        EventEmitter.on("serviceList", (value)=>{
            this.fetchData()
        });
    }
    fetchData(){
        const {u_id, country , lang} = this.props;
        align = (lang === 'ar') ?  'right': 'left';
        api.serviceList( u_id, country )
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    Shortrows : responseData.data,
                    isLoading : false
                },()=>{
                        this.arrayholder = responseData.data;
                    }
                );
            }
            else{
                this.setState({
                    isLoading : false
                })
            }
        })
        .catch((errorMessage, statusCode) => {
            console.log(errorMessage);
        })
        .done();
    }
    SearchFilterFunction(text){
        const { lang } =this.props
        const newData = this.arrayholder.filter(function(item){
            const itemData = lang === 'ar'?  item.service_name_in_arabic.toUpperCase() : item.service_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            text: text,
            textInputwidth : "80%"
        })
    }
    removeFilterFunction(){
        const { lang } =this.props
        let text = ""
        const newData = this.arrayholder.filter(function(item){
            // const itemData = item.product_name.toUpperCase()
            const itemData = lang === 'ar'?  item.service_name_in_arabic.toUpperCase() : item.service_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            text: text
        })
    }

    handleSingleIndexSelect = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index,
        });
    }
    handleMultipleIndexSelect = (index) => {
        if (this.state.selectedIndices.includes(index)) {
            this.setState({
                ...this.state,
                selectedIndices: this.state.selectedIndices.filter((i) => i !== index),
            });
        }
        else {
            this.setState({
                ...this.state,
                selectedIndices: [
                    ...this.state.selectedIndices,
                    index,
                ],
            });
        }
    }
    handleCustomIndexSelect = (index) => {
        this.setState({
            ...this.state,
            customStyleIndex: index,
        });
    }
    shortingOrder(){
        const { Shortrows } = this.state;
        this.Ascending()
        .then(()=>{
            let rowRev = Shortrows.reverse()
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rowRev),
                isLoading : false
            })
        })
        .done();
    }
    async Ascending(){
        try {
            const { Shortrows } = this.state;
            this.setState({
                dataSource : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
                isLoading : true
            })
            return true
        } catch (e) {
            console.warn(e);

        }
    }
    render() {
        // console.warn(this.state.dataSource);
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={styles.container}>
                {
                    this.state.customStyleIndex === 0 ?
                    this.state.ShowSearch ?
                    <Animated.View style={{shadowColor: "#000", height: Platform.OS === 'ios' ? 64 : 54, backgroundColor: "#a9d5d1", flexDirection: direction, justifyContent: 'space-between', alignItems: 'center', width: width}}>
                        <View style={{
                                flexDirection: direction,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: Platform.OS === 'ios' ? 14 : 0,
                                // borderWidth: StyleSheet.hairlineWidth,
                                // borderColor: '#fff',
                                // borderRadius: 7
                            }}>
                                <TouchableOpacity style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: "10%",
                                        borderRadius:  7,
                                        backgroundColor: "transparent"
                                    }}
                                    onPress={()=>this.setState({ ShowSearch : false })}
                                    >
                                    <Icon size={20} color="#fff" name="ios-arrow-back"  style={{transform: lang == 'ar'? [{ rotate: '180deg'}] : [{ rotate: '0deg'}]}}/>
                                </TouchableOpacity>
                                <TextInput
                                    style={{ width: "80%", height: 40, alignSelf: 'center', textAlign: textline, color: "#fff", borderWidth: StyleSheet.hairlineWidth, borderColor: '#fff', borderRadius: 20, paddingLeft:15,}}
                                    onChangeText={(text) => this.SearchFilterFunction(text)}
                                    placeholderTextColor="#fff"
                                    value={this.state.text}
                                    controlled={true}
                                    underlineColorAndroid='transparent'
                                    placeholder={I18n.t('vendorproducts.searchHere', { locale: lang })}
                                    tintColor={"rgba(86, 76, 205, 1)"}
                                     />
                                <TouchableOpacity style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: "10%",
                                        borderRadius:  7,
                                        backgroundColor: "transparent"
                                    }} >
                                    {this.state.text.length > 0 ?
                                        <Icon size={25} color="#fff" name="ios-backspace-outline" style={{transform: lang == 'ar'? [{ rotate: '180deg'}] : [{ rotate: '0deg'}]}} onPress={()=>this.removeFilterFunction()}/>
                                        : <Text/>
                                    }
                                </TouchableOpacity>
                        </View>
                    </Animated.View> :
                    <View style={{ shadowColor: "#000",shadowOffset:{height: 0.5}, shadowRadius: 0.5, height: Platform.OS === 'ios' ? 64 : 54, backgroundColor: "#a9d5d1", flexDirection: direction, justifyContent: 'space-between', alignItems: 'center', width: width}}>
                        <View style={{ width:"20%" }}/>
                            <View style={{ width:"60%",justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{ color: "#fff", fontSize: 20, fontWeight: 'bold',paddingTop: Platform.OS === 'ios' ? 7 : 0}}>{I18n.t("vendorservice.serviceTitle", { locale: lang })}</Text>
                            </View>
                            <View style={{ flexDirection:direction, width: "20%",paddingTop: Platform.OS === 'ios' ? 7 : 0}}>
                                <TouchableOpacity style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: "50%",
                                        borderRadius:  7,
                                        backgroundColor: "transparent"
                                    }}
                                    onPress={()=>this.setState({ ShowSearch:true })}>
                                    <Icon size={20} color="#fff" name="md-search" style={{ alignSelf: 'center', margin: 5}} />
                                </TouchableOpacity>
                                <View style={{width: "50%", height: 40, backgroundColor: 'transparent', justifyContent: 'center',alignItems: 'center',}}>
                                    <Material name="short-text" color="#fff" size={30} onPress={()=>this.shortingOrder()}/>
                                </View>
                            </View>
                    </View>

                :
            <View/>
            }
                <SegmentedControlTab
                    values={[ I18n.t('vendorservice.myservice', { locale: lang }),I18n.t('vendoraddservice.addservice', { locale: lang })]}
                    selectedIndex={this.state.customStyleIndex}
                    onTabPress={this.handleCustomIndexSelect}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: '#a9d5d1' }}
                    tabStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                    activeTabStyle={{ backgroundColor: '#fbcdc5' }}
                    tabTextStyle={{ color: '#696969', fontWeight: 'bold' }}
                    activeTabTextStyle={{ color: '#fff' }} />
                {this.state.customStyleIndex === 0 &&
                    <MyService dataSource={this.state.dataSource} isLoading={this.state.isLoading}/>}
                {this.state.customStyleIndex === 1 &&
                    <AddService/>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    tabViewText: {
        color: '#444444',
        fontWeight: 'bold',
        marginTop: 50,
        fontSize: 18
    },
    titleText: {
        color: '#444444',
        padding: 20,
        fontSize: 14,
        fontWeight: '500'
    },
    headerText: {
        padding: 8,
        fontSize: 14,
        color: '#444444'
    },
    tabContent: {
        color: '#444444',
        fontSize: 18,
        margin: 24
    },
    // Seperator: {
    //     marginHorizontal: -10,
    //     alignSelf: 'stretch',
    //     borderTopWidth: 1,
    //     borderTopColor: '#888888',
    //     marginTop: 24
    // }
})


function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
    }
}
export default connect(mapStateToProps)(Service);
