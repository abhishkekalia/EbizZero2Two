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
    ScrollView
} from 'react-native';
import SelectMultiple from './src/SelectMultiple';
import { Actions } from 'react-native-router-flux'
import CheckBox from 'app/common/CheckBox';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Utils from 'app/common/Utils';

const { width } = Dimensions.get('window')

export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalVisible: true, 
            selected: [],
            button : false,
            search : '',
            category : [],
            rows : []
        }
    } 
    setModalVisible(visible) { 
        this.setState({modalVisible: visible}); 
    }
    onSelectionsChange = (selected) => {
    this.setState({ selected })
    }

    componentDidMount(){
        this.fetchData()
    }

    fetchData(){ 
        let formData = new FormData();
        formData.append('u_id', String(1));
        formData.append('country', String(1)); 

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
            this.setState({
                category:responseData.data.category,
        });
        }).done();
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
        var newArray = this.state.rows.slice(); 
        newArray.push(data.category_id); 
        this.setState({
            rows: newArray
        });

        data.checked = !data.checked;
        let msg=data.checked? 'you checked ':'you unchecked '
        // this.toast.show(msg+data.name);
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
                leftText={leftText}AllShop
                countingItem= {sum}
                icon_name={icon_name}
            />);
    }




    render() {
        // console.warn(JSON.stringify(this.state.row));
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
                    onPress={()=>Actions.filterdBy({ filterdBy : this.state.rows})}>
                        <MaterialIcons name="done" size={20} color="#fff"/>
                    </TouchableHighlight>
                </View>       
            </View>
        );
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