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
import SelectMultiple from './src/SelectMultiple';
import { Actions } from 'react-native-router-flux'
import CheckBox from 'app/common/CheckBox';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Utils from 'app/common/Utils';
import EventEmitter from "react-native-eventemitter";

const { width } = Dimensions.get('window')

export default class Filter extends Component {
    constructor(props) {
        super(props);
        console.log("this.props.selectedRows:=")
        console.log("this.props.selectedRows:=",this.props.selectedRows)

        this.state = { 
            modalVisible: true, 
            selected: [],
            button : false,
            search : '',
            category : [],
            rows : this.props.selectedRows,
            status : false,
            u_id: null,
            user_type : null,
            country : null,
        }
    } 
    setModalVisible(visible) { 
        this.setState({modalVisible: visible}); 
    }
    onSelectionsChange = (selected) => {
        this.setState({ selected })
    }

    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
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

    fetchData(){
        const {u_id, country, } = this.state; 
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
            }

            this.setState({
                // category:responseData.data.category,
                category : arrData,
                status : responseData.status
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
        var index = this.state.rows.indexOf(data.category_id); 
        if (index > -1) {
           var newArray =  this.state.rows.splice(index, 1);
            this.setState({
                rows: newArray
            });
        }
    }
    renderCheckBox(data) {
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
            />);
    }

    render() {
        let border = this.state.button ? 1 : undefined;
        let borderleft = this.state.button ? 2 : 5;
        let bcolor = this.state.button ? "#ccc" : "orange";
        let bgColor = this.state.button ? "#ccc" : "#87cefa"
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{ 
                        width: width/3, 
                        borderColor : "#ccc", 
                        borderWidth : 0.5}} >
                        <TouchableHighlight 
                        underlayColor ={"#fff"} 
                        style={[ 
                            styles.category, { 
                                borderWidth: border, 
                                borderLeftWidth : borderleft ,
                                borderColor : bcolor, 
                            }]} onPress={() => this.setState({
                            button : !this.state.button
                        })} >
                        <Text style={{color : bgColor}}>Category</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{flex : 1, padding : 10}}>
                        <TextInput
                        style={{height: 40, borderWidth : 0.5, borderColor : '#ccc',borderRadius : 10}}
                        placeholder="Search by Category"
                        underlineColorAndroid = 'transparent'
                        onChangeText={(search) => this.setState({search})}/>

                       <ScrollView>
                    {this.renderView()}
                </ScrollView>

                    </View>
                </View>
                <View style={{padding : 10}}>
                    <TouchableHighlight 
                    underlayColor ={"#fff"} 
                    style={[styles.apply]} 
                    // onPress={()=>Actions.homePage({ filterdBy : this.state.rows})}>
                    onPress={this.applyCategory.bind(this)}>
                        <MaterialIcons name="done" size={20} color="#fff"/>
                    </TouchableHighlight>
                </View>       
            </View>
        );
    }

    applyCategory() {
        console.log("applyCategory call")
        EventEmitter.emit("applyCategoryFilter",this.state.rows)
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