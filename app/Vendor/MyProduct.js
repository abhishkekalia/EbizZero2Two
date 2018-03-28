import React, { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    ListView,
    Text,
    View,
    Image,
    Platform,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ScrollView
    // AsyncStorage,
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window')

class MyProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2 }),
            Shortrows : [],
            u_id : null,
            country : null,
            text: '',
            productnames: []
        }
        this.arrayholder = [] ;
    }
    componentDidMount(){
        // this.getKey()
        // .then( ()=>this.fetchData())
        this.fetchData()
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton, left :  this._renderLeftButton});
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow () {
        routes.refresh ({hideTabBar: true})
    }
    _keyboardDidHide () {
        routes.refresh ({hideTabBar: false})
    }
    _renderLeftButton = () => {
         return(
             <Text style={{color : '#fff'}}></Text>
         );
     };
    _renderRightButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };
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
    fetchData(){
        const {u_id, country } = this.props;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData
        }
        fetch(Utils.gurl('productList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            let data = responseData.data,
            length = data.length,
            productname = [],
            name,
            shortname

            for (let i = 0; i < length; i++) {
                name = data[i].product_name
                shortname = name.charAt(0).toUpperCase();
                productname.push(shortname);
            }
            if(responseData.status){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    Shortrows : responseData.data,
                    isLoading : false,
                    productnames: productname
                },()=>{
                    this.arrayholder = responseData.data ;
                });
            }
            else{
                this.setState({
                    isLoading : false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    SearchFilterFunction(text){
        const { lang } =this.props
        const newData = this.arrayholder.filter(function(item){
            const itemData = lang === 'ar'?  item.product_name_in_arabic.toUpperCase() : item.product_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            text: text
        })
    }
    removeFilterFunction(){
        const { lang } =this.props
        let text = ""
        const newData = this.arrayholder.filter(function(item){
            const itemData = lang === 'ar'?  item.product_name_in_arabic.toUpperCase() : item.product_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            text: text
        })
    }

    ListViewItemSeparator = () => {
        return (
            <View style={{ height: StyleSheet.hairlineWidth, width: "100%"}}/>
        );
    }
    Description (product_name, productImages ,short_description, detail_description, price ,special_price){
        routes.vendordesc(
            {
                title: product_name,
                product_name : product_name,
                productImages : productImages,
                short_description : short_description,
                detail_description : detail_description,
                price : price,
                special_price : special_price,
            }
        )
    }
    // renderProductnames(){
    //                 {this.state.letters.map((letter, index) => this._renderRightLetters(letter, index))}
    //     return this.state.productnames.map((data, index) => this._renderRightLetters(letter, index)))
    // }
    _scrollTo(index, letter) {
        // this.refs.toast.close();
        let position = 0;
        for (let i = 0; i < index; i++) {
            // position += totalheight[i]
        }
        // this._listView.scrollTo({y: 250});
        // this.refs.toast.show(letter, DURATION.LENGTH_SHORT);
    }

    _renderRightLetters(letter, index) {
      return (
        <TouchableOpacity key={'letter_idx_' + index} activeOpacity={0.6} onPress={() => {
          this._scrollTo(index, letter)
      }} style={{ width: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: "#a9d5d1"}}>{letter}</Text>
        </TouchableOpacity>
      );
    }
    noItemFound(){
        const { lang} = this.props;
        return (
            <View style={{ justifyContent:'center', alignItems:'center'}}>
                <Text>{I18n.t('home.noitem', { locale: lang })}</Text>
            </View>
        );
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
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        let asce = this.state.productnames.sort((a, b)=>{return a});
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        let listView = (<View></View>);
            listView = (
                <ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource}
                    renderSeparator= {this.ListViewItemSeparator}
                    renderRow={this.renderData.bind(this)}/>
            );
            let data = (this.state.dataSource.getRowCount() < 1) ? this.noItemFound() :listView
            return (
                <View style={{ flex: 1}}>
                    <View style={{
                            flexDirection: direction,
                            justifyContent: 'space-between',
                            marginTop: 5,
                        }}>
                        <View style={{
                                flexDirection: direction,
                                justifyContent: 'space-between',
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 7
                            }}>
                            <View style={{width: 40, height: 40, backgroundColor: 'transparent', justifyContent: 'center',alignItems: 'center',}}>
                            <Icon size={20} color="#ccc" name="md-search" style={{ alignSelf: 'center', margin: 5}} onPress={()=>this.removeFilterFunction()}/>
                            </View>
                            <TextInput
                                style={[styles.TextInputStyleClass, {width: "65%", alignSelf: 'center', textAlign: textline}]}
                                onChangeText={(text) => this.SearchFilterFunction(text)}
                                value={this.state.text}
                                controlled={true}
                                underlineColorAndroid='transparent'
                                placeholder={I18n.t('vendorproducts.searchHere', { locale: lang })}
                                />
                            <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 35,
                                    borderRadius:  7,
                                    backgroundColor: "transparent"
                                }} >
                                <Icon size={25} color="#a9d5d1" name="ios-backspace-outline" style={{transform: lang == 'ar'? [{ rotate: '180deg'}] : [{ rotate: '0deg'}]}} onPress={()=>this.removeFilterFunction()}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: 40, height: 40, backgroundColor: 'transparent', justifyContent: 'center',alignItems: 'center',}}>
                            <Material name="short-text" color="#a9d5d1" size={30} onPress={()=>this.shortingOrder()}/>
                        </View>
                    </View>
                    <View style={{ flexDirection: direction}}>
                        {data}
                        <ScrollView style={{marginBottom: 50}}>
                            { (this.state.dataSource.getRowCount() > 0 ) ? this.state.productnames.map((data, index) => this._renderRightLetters(data, index)) : undefined}
                        </ScrollView>
                    </View>
                </View>
            );
        }
        renderData(data: string, sectionID: number, rowID: number, index) {
            let color = data.special_price ? '#a9d5d1' : '#000';
            let textDecorationLine = data.special_price ? 'line-through' : 'none';
            const { lang, country, u_id } =this.props,
            textline = lang == 'ar'? 'right': 'left';
            let direction = (lang === 'ar') ? 'row-reverse' :'row',
            align = (lang === 'ar') ?  'right': 'left',
            product_name = (lang == 'ar')? data.product_name_in_arabic : data.product_name,
            short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
            detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
            price = (lang == 'ar')? data.price_in_arabic : data.price,
            special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
            return (
                <View style={{
                        width : width-30,
                        flexDirection: 'column' ,
                        marginTop : 2,
                        borderWidth : 1,
                        borderColor : "#ccc",
                        borderRadius : 5,
                        overflow: 'hidden'
                    }}>
                    <Header
                        product_category= {data.product_category}
                        u_id={this.state.u_id}
                        country={this.state.country}
                        lang={lang}
                        />
                    <TouchableOpacity style={{
                            flexDirection: direction,
                            backgroundColor : "#fff",
                            borderBottomWidth : StyleSheet.hairlineWidth,
                            borderColor : "#ccc",
                        }}
                        onPress={()=>routes.editproduct({
                            u_id : this.state.u_id,
                            country : this.state.country,
                            product_id: data.product_id,
                            product_category:data.product_category,
                            product_name: data.product_name,
                            detail_description: data.detail_description,
                            short_description: data.short_description,
                            product_name_in_arabic: data.product_name_in_arabic,
                            short_description_in_arabic: data.short_description_in_arabic,
                            detail_description_in_arabic: data.detail_description_in_arabic,
                            price: price,
                            special_price: special_price,
                            quantity: data.quantity,
                            size: data.size,
                            discount: data.discount,
                            final_price: data.final_price,
                            is_feature: data.is_feature,
                            productImages: data.productImages
                        })}>
                        <Image style={[styles.thumb, {margin: 10}]}
                            resizeMode={"stretch"}
                            source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}
                            />
                        <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>
                            <Text style={ { color:'#222',fontWeight :'bold', marginTop: 10, textAlign: textline}} >  {product_name} </Text>
                            <Text style={{ fontSize : 12, color : '#222',  textAlign: textline}} > {short_description} </Text>
                            <View style={{ flexDirection : direction}}>
                                <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> {I18n.t('vendorproducts.quantity', { locale: lang })}</Text>
                                <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> :</Text>
                                <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> {data.quantity} </Text>
                            </View>
                            <View style={{ flexDirection : "column", justifyContent : 'space-between'}}>
                                <View style={{ flexDirection : direction}}>
                                    <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}} >{I18n.t('vendorproducts.price', { locale: lang })} </Text>
                                    <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}} >: </Text>
                                    <Text style={{ color: '#222', fontSize:12,  textAlign: textline}}> {data.price} KWD</Text>
                                </View>
                                <View style={{ flexDirection : direction}}>
                                    <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>{I18n.t('vendorproducts.special_price', { locale: lang })}</Text>
                                    <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>:</Text>
                                    <Text style={{ color: '#222', fontSize:12, textAlign: textline}}> {data.special_price} KWD</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection : direction}}>
                                <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>{I18n.t('vendorproducts.status', { locale: lang })}</Text>
                                <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>:</Text>
                                <Text style={{color: '#222',fontSize:12, textAlign: textline}}>{data.is_approved ? I18n.t('vendorproducts.aproved', { locale: lang }) : I18n.t('vendorproducts.pending', { locale: lang })} </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Footer calllback={()=>this.Description(product_name, data.productImages ,
                            short_description, detail_description, price ,special_price)}
                            u_id={this.state.u_id}
                            country={country}
                            is_active = {data.is_active}
                            product_id= {data.product_id}
                            calldata = {()=>this.fetchData()}
                            lang={lang}/>
                    </View>
                );
            }
        }

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            product_category : [],
            isLoading : true
        }
    }

    componentDidMount(){
        this.fetchData();
    }
    search = (nameKey, myArray)=>{
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].category_id === nameKey) {
                return myArray[i].category_name;
            }
        }
    }
    fetchData(){
        const {u_id, country } = this.props;
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
        fetch(Utils.gurl('getFilterMenu'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    product_category: responseData.data.category,
                });
            }
            else{
                this.setState({
                    isLoading : false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    render() {
        let product_id = this.props.product_category
        let product = this.state.product_category
        let resultObject = this.search(product_id, product);
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor:'#ccc', flexDirection: direction}}>
                <Text style={{ color : '#fbcdc5', padding: 10, textAlign: textline}}>{I18n.t('vendorproducts.categories', { locale: lang })}</Text>
                <Text style={{ color : '#fbcdc5', alignSelf: 'center'}}>:</Text>
                <Text style={{padding: 10, color:"#222", textAlign: textline}}>{ this.state.product_category ? resultObject: undefined}
                </Text>
            </View>
        );
    }
}

class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {
            is_active : this.props.is_active
        }
    }
    productActiveDeactive(product_id, approv_code){
        const {u_id, country } = this.props;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('active_flag', String(approv_code));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('productActiveDeactive'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.props.calldata();
            }
            else{
                this.props.calldata();
            }
        })
        .catch((error) => {
            MessageBarManager.showAlert({
                message: "error while update data",
                alertType: 'warning',
                title:''
            })
        })
        .done();
    }
// componentWillReceiveProps(is_approved){
//     this.setState({
//         is_approved : this.props.is_approved
//     })
// }

    render(){
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        let approved
        let approv_code
        if(this.props.is_active === '1'){
            approved = I18n.t('vendorproducts.deactivate', { locale: lang });
            approv_code = '0'
        }else {
            approved = I18n.t('vendorproducts.activate', { locale: lang });
            approv_code = '1'
        }
        return(
            <View style={[styles.bottom, { flexDirection: direction}]}>
                <TouchableOpacity
                    style={[styles.lowerButton,{ backgroundColor : '#a9d5d1'}]}
                    onPress={this.props.calllback}>
                    <Text style={{ color :'#fff', fontSize: 12, textAlign: textline}}>{I18n.t('vendorproducts.preview', { locale: lang })}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.lowerButton, { backgroundColor : '#fbcdc5'}]}
                    onPress={()=>this.productActiveDeactive(this.props.product_id, approv_code)}>
                    <Text style={{ color :'#fff', fontSize : 12, textAlign: textline}}>{approved}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding : 10
    },
    row: {
        flexDirection: 'row',
    },
    countryIcon: {
        width : 40,
        height:40,
        padding :10
    },
    lowerButton :{
        // alignItems : 'center',
        borderWidth : 0.5,
        borderColor : "#ccc",
        padding : 5,
        borderRadius : 5
    },
    thumb: {
        width   : "20%",
        height  :width/5 ,
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
    bottom : {
        justifyContent : 'space-between',
        backgroundColor : "transparent",
        padding : 5
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
    },
    TextInputStyleClass:{
        height: 40,
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 7 ,
        backgroundColor : "transparent"
    }
});

function mapStateToProps(state) {
    return {
        identity: state.identity,
		lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
    }
}
export default connect(mapStateToProps)(MyProduct);
