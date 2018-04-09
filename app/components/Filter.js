import React, { Component } from 'react'
import {
    Modal,
    Text,
    Dimensions,
    TouchableHighlight,
    StyleSheet,
    View,
    Button ,
    TextInput,
    AsyncStorage,
    ScrollView
} from 'react-native';
import {connect} from "react-redux";
import SelectMultiple from './src/SelectMultiple';
import { Actions } from 'react-native-router-flux'
import CheckBox from 'app/common/CheckBox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import EventEmitter from "react-native-eventemitter";
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

import I18n from 'react-native-i18n'
const { width } = Dimensions.get('window')
class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            selected: [],
            button : false,
            search : '',
            category : [],
            rows : this.props.selectedRows,
            selGender : this.props.selGender,
            selType : this.props.selType,
            status : false,
            u_id: null,
            user_type : null,
            country : null,
            filterMenuResponse: [],
            selectedIndexOfFilter: 1,
            arrGender : [],
            arrType : [{
                "type_id": "1",
                "count": 60,
                "name": "Product"
            }],
        }
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    onSelectionsChange = (selected) => {
        this.setState({ selected })
    }
    refresh = ()=> {
        this.fetchData()
    }
    componentDidMount(){
        // this.getKey()
        // .then( ()=>this.fetchData())
        // .done();
        this.fetchData()
        EventEmitter.removeAllListeners("refreshFilterOption");
        EventEmitter.on("refreshFilterOption", (value)=>{
            // this.state.rows = []
            // this.state.selGender = []
            // this.state.selType = []
            this.setState({
                rows:[],
                category: [],
                selGender:[],
                selType:[],
                selectedIndexOfFilter:1
            })
            this.refresh()
        });
    }
    // async getKey() {
    //     try {
    //         const value = await AsyncStorage.getItem('data');
    //         var response = JSON.parse(value);
    //         this.setState({
    //             u_id: response.userdetail.u_id ,
    //             country: response.userdetail.country ,
    //         });
    //     } catch (error) {
    //         console.log("Error retrieving data" + error);
    //     }
    // }
    fetchData() {
        const {u_id, country, } = this.props;
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
                var arrData = responseData.data.category
                console.log("selGender:=",this.state.rows);
                console.log("arrData:=",arrData);
                if (this.state.rows.length > 0) {
                    for (var i = 0; i < arrData.length; i++) {
                        let indexOfObj = this.state.rows.indexOf(arrData[i].category_id)
                        console.log("indexOfObj:=",indexOfObj)
                        if (indexOfObj > -1) {
                            arrData[i].checked = true
                        }
                        else {
                            arrData[i].checked = false
                        }
                    }
                } else {
                    for (var i = 0; i < arrData.length; i++) {
                        arrData[i].checked = false
                    }
                }
                var arrGenderData = responseData.data.gender
                console.log("arrGenderData:=",arrGenderData);
                console.log("selGender:=",this.state.selGender);
                if (this.state.selGender.length > 0) {
                    for (var i = 0; i < arrGenderData.length; i++) {
                        let indexOfObj = this.state.selGender.indexOf(arrGenderData[i].gender)
                        console.log("indexOfObj:=",indexOfObj)
                        if (indexOfObj > -1) {
                            arrGenderData[i].checked = true
                        }
                        else {
                            arrGenderData[i].checked = false
                        }
                    }
                } else {
                    for (var i = 0; i < arrGenderData.length; i++) {
                        arrGenderData[i].checked = false
                    }
                }
                var arrTypeData = responseData.data.type
                console.log("arrTypeData:=",arrTypeData);
                if (this.state.selType.length > 0) {
                    for (var i = 0; i < arrTypeData.length; i++) {
                        let indexOfObj = this.state.selType.indexOf(arrTypeData[i].type_id)
                        console.log("indexOfObj:=",indexOfObj)
                        if (indexOfObj > -1) {
                            arrTypeData[i].checked = true
                        }
                        else {
                            arrTypeData[i].checked = false
                        }
                    }
                }
                else {
                    for (var i = 0; i < arrTypeData.length; i++) {
                        arrTypeData[i].checked = false
                    }
                }
                this.setState({
                    category : arrData,
                    status : responseData.status,
                    filterMenuResponse : responseData.data,
                    arrGender : arrGenderData,
                    arrType : arrTypeData
                });
            }else{
                this.setState({
                    status : responseData.status
                });
            }
        })
        .catch((error) => {
            this.setState({
                status : false
            });
        })
        .done();
    }
    renderView() {
        if (!this.state.category || this.state.category.length === 0)return;
        var len = this.state.category.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.category[i])}
                        {this.renderCheckBox(this.state.category[i + 1])}
                    </View>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.category[len - 2]) : null}
                    {this.renderCheckBox(this.state.category[len - 1])}
                </View>
            </View>
        )
        return views;
    }
    renderGenderView() {
        if (!this.state.arrGender || this.state.arrGender.length === 0)return;
        var len = this.state.arrGender.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBoxGender(this.state.arrGender[i])}
                        {this.renderCheckBoxGender(this.state.arrGender[i + 1])}
                    </View>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBoxGender(this.state.arrGender[len - 2]) : null}
                    {this.renderCheckBoxGender(this.state.arrGender[len - 1])}
                </View>
            </View>
        )
        return views;
    }
    renderTypeView() {
        // if (!this.state.arrType || this.state.arrType.length === 0)return;
        // var len = this.state.arrType.length;
        // var views = [];
        // for (var i = 0, l = len - 2; i < l; i += 2) {
        //     views.push(
        //         <View key={i}>
        //             <View style={styles.item}>
        //                 {this.renderCheckBoxType(this.state.arrType[i])}
        //                 {this.renderCheckBoxType(this.state.arrType[i + 1])}
        //             </View>
        //         </View>
        //     )
        // }
        // views.push(
        //     <View key={len - 1}>
        //         <View style={styles.item}>
        //             {len % 2 === 0 ? this.renderCheckBoxType(this.state.arrType[len - 2]) : null}
        //             {this.renderCheckBoxType(this.state.arrType[len - 1])}
        //         </View>
        //     </View>
        // )
        // console.warn(this.state.arrType);
        return this.state.arrType.map((data) => {
            return (
                <RadioButton value={data.type_id} >
                    <Text>{data.name}</Text>
                </RadioButton>
            )
        })
    }
    renderFilterContainerView () {
        if (this.state.selectedIndexOfFilter == 1) {
            return(
                <ScrollView style={{flex : 1}}>
                    {this.renderView()}
                </ScrollView>
            );
        }
        else if (this.state.selectedIndexOfFilter == 2) {
            return(
                <ScrollView  style={{flex : 1, }}>
                    {this.renderGenderView()}
                </ScrollView>
            );
        }
        else if (this.state.selectedIndexOfFilter == 3) {
            return(
                <ScrollView  style={{flex : 1, }}>
                    <RadioGroup
                        size={24}
                        thickness={1}
                        color='#a9d5d1'
                        selectedIndex={0}
                        onSelect = {(index, value) =>this.onSelect(index, value)}>
                        {this.renderTypeView()}
                    </RadioGroup>
                </ScrollView>
            );
        }
    }
    onClick(data) {
        data.checked = !data.checked;
        data.checked? this.check(data): this.unCheck(data)
    }
    check (data){
        var newStateArray = this.state.rows.slice();
        newStateArray.push(data.category_id);
        this.setState({
            rows: newStateArray
        });
    }
    unCheck(data){
        var my_array = this.state.rows;
        var start_index = this.state.rows.indexOf(data.category_id);
        var number_of_elements_to_remove = 1;
        var removed_elements = my_array.splice(start_index, number_of_elements_to_remove);
            this.setState({
                rows: my_array
            });
    }
    renderCheckBox(data) {
        const {lang} = this.props;
        var leftText = data.category_name;
        var sum = data.count;
        var icon_name = data.icon_name;
        return (
            <CheckBox
                style={{flex: 1, padding: 5, borderTopWidth : 1, borderColor : '#ccc'}}
                onClick={()=>this.onClick(data)}
                isChecked={data.checked}
                leftText={leftText}
                countingItem= {sum}
                icon_name={icon_name}
                lang={lang}
                />
        );
    }

    //Gender
    onClickGender(data) {
        data.checked = !data.checked;
        data.checked? this.checkGender(data): this.unCheckGender(data)
    }
    checkGender (data){
        var newStateArray = this.state.selGender.slice();
        newStateArray.push(data.gender);
        this.setState({
            selGender: newStateArray
        });
    }
    unCheckGender(data){
        var my_array = this.state.selGender;
        var start_index = this.state.selGender.indexOf(data.gender);
        var number_of_elements_to_remove = 1;
        var removed_elements = my_array.splice(start_index, number_of_elements_to_remove);
        this.setState({
            selGender: my_array
        });
    }
    renderCheckBoxGender(data) {
        const {lang} = this.props;
        var leftText = data.name;
        var sum = data.count;
        var icon_name = data.icon_name;
        return (
            <CheckBox
                style={{flex: 1, padding: 5, borderTopWidth : 1, borderColor : '#ccc'}}
                onClick={()=>this.onClickGender(data)}
                isChecked={data.checked}
                leftText={leftText}
                countingItem= {sum}
                icon_name={icon_name}
                lang={lang}
                />
        );
    }
    // onClickType(data) {
    //     data.checked = !data.checked;
    //     data.checked? this.checkType(data): this.unCheckType(data)
    // }
    // checkType (data){
    //     var newStateArray = this.state.selType.slice();
    //     newStateArray.push(data.type_id);
    //     this.setState({
    //         selType: newStateArray
    //     });
    // }
    // unCheckType(data){
    //     var my_array = this.state.selType;
    //     var start_index = this.state.selType.indexOf(data.type_id);
    //     var number_of_elements_to_remove = 1;
    //     var removed_elements = my_array.splice(start_index, number_of_elements_to_remove);
    //     this.setState({
    //         selType: my_array
    //     });
    // }
    onSelect(index, value){
        this.setState({
            selType: value
        });
    }
    renderCheckBoxType(data) {
        const {lang} = this.props;
        var leftText = data.name;
        var sum = data.count;
        var icon_name = data.icon_name;
        return (
            <CheckBox
                style={{flex: 1, padding: 5, borderTopWidth : 1, borderColor : '#ccc'}}
                onClick={()=>this.onClickType(data)}
                isChecked={data.checked}
                leftText={leftText}
                countingItem= {sum}
                icon_name={icon_name}
                lang={lang}
                />
        );
    }
    render() {
        const {lang} = this.props;
        var borderCat = undefined;
        var borderGen = undefined;
        var borderType = undefined;

        let borderleftCat = 2
        let bcolorCat = "#ccc"
        let bgColorCat = "#ccc"

        let borderleftGen = 2 ;
        let bcolorGen = "#ccc";
        let bgColorGen = "#ccc";

        let borderleftType = 2;
        let bcolorType = "#ccc";
        let bgColorType = "#ccc";

        if (this.state.selectedIndexOfFilter == 1) {
            borderleftCat = 5;
            bcolorCat = "orange";
            bgColorCat = "#87cefa"
        }
        else if (this.state.selectedIndexOfFilter == 2) {
            borderleftGen = 5;
            bcolorGen = "orange";
            bgColorGen = "#87cefa"
        }
        else if (this.state.selectedIndexOfFilter == 3) {
            borderleftType = 5;
            bcolorType = "orange";
            bgColorType = "#87cefa"
        }
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: lang == 'ar' ? 'row-reverse': 'row' ,justifyContent: 'space-between'}}>
                    <View style = { {flexDirection: 'column', borderColor : "#ccc", borderLeftWidth : StyleSheet.hairlineWidth, borderRightWidth : StyleSheet.hairlineWidth  }}>
                        <View style={{
                                width: width/3,
                                borderColor : "#ccc",
                            }}>
                            <TouchableHighlight
                                underlayColor ={"#fff"}
                                style={[
                                    styles.category,  lang == 'ar' ?
                                    {
                                        borderWidth: borderCat,
                                        borderRightWidth : borderleftCat ,
                                        borderColor : bcolorCat,
                                    }:{
                                        borderWidth: borderCat,
                                        borderLeftWidth : borderleftCat ,
                                        borderColor : bcolorCat,
                                    }
                                ]}
                                onPress={() => this.setState({
                                    button : !this.state.button,
                                    selectedIndexOfFilter : 1
                                })} >
                                <Text style={{color : bgColorCat}}>{I18n.t('filter.category', { locale: lang })}</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{
                                width: width/3,
                                borderColor : "#ccc",
                            }}>
                            <TouchableHighlight
                                underlayColor ={"#fff"}
                                style={[
                                    styles.category, lang == 'ar' ? {
                                        borderWidth: borderGen,
                                        borderColor : bcolorGen,
                                        borderRightWidth : borderleftGen ,
                                    } : {
                                        borderWidth: borderGen,
                                        borderColor : bcolorGen,
                                        borderLeftWidth : borderleftGen ,
                                    }
                                ]}
                                onPress={() => this.setState({
                                    button : !this.state.button,
                                    selectedIndexOfFilter : 2
                                })} >
                                <Text style={{color : bgColorGen}}>{I18n.t('filter.gender', { locale: lang })}</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{
                                width: width/3,
                                borderColor : "#ccc",
                            }} >
                            <TouchableHighlight
                                underlayColor ={"#fff"}
                                style={[
                                    styles.category, lang == 'ar' ? {
                                        borderWidth: borderType,
                                        borderRightWidth : borderleftType ,
                                        borderColor : bcolorType,
                                    }: {
                                        borderWidth: borderType,
                                        borderLeftWidth : borderleftType ,
                                        borderColor : bcolorType,
                                    }
                                ]}
                                onPress={() => this.setState({
                                    button : !this.state.button,
                                    selectedIndexOfFilter : 3
                                })} >
                                <Text style={{color : bgColorType}}>{I18n.t('filter.type', { locale: lang })}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    {this.renderFilterContainerView()}
                </View>
                <View style={{padding : 10}}>
                    <TouchableHighlight
                        underlayColor ={"#fff"}
                        style={[styles.apply]}
                        onPress={this.applyCategory.bind(this)}>
                        <MaterialIcons name="done" size={20} color="#fff"/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
    applyCategory() {
        var obj = {
            selCategory:this.state.rows,
            selGender:this.state.selGender,
            selType:this.state.selType
        }
        EventEmitter.emit("applyCategoryFilter",obj)
        Actions.pop()
    }
}
const styles = StyleSheet.create({
    category: {
        padding : 10,
     },
     apply : {
        backgroundColor : "orange",
        alignItems : 'center',
        padding : 10
     }
})

function mapStateToProps(state) {
	return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
	};
}

export default connect(mapStateToProps)(Filter);
