import React, { Component ,PropTypes } from 'react';
import {
    ListView,
    TouchableOpacity, 
    StyleSheet,
    Dimensions,
    AsyncStorage, 
    Text, 
    View,
    Image 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
const { width, height } = Dimensions.get('window')


export default class AllItem extends Component {
    constructor(props) {
        super(props);        
        this.state={ 
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }), 
            dataSource2: new ListView.DataSource({  rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id: null,
            country : null
        }
    }

    // static propTypes = { 
    //     container_id:   React.PropTypes.string.isRequired,
    //     type: React.PropTypes.string.isRequired,
    //     fetchData:   React.PropTypes.func.isRequired 
    // };

    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
    }

    blur() {
        const {dataSource } = this.state;
        dataSource && dataSource.blur();
    }

    focus() {
        const {dataSource } = this.state;
        dataSource && dataSource.focus();
    }

    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }


    fetchData(){ 
        const {u_id, country } = this.state; 
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
    fetch(Utils.gurl('allProductItemList'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                refreshing : false
        });
        }).done();
    }

    render() {

        let listView = (<View></View>);
            listView = (
                <ListView
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
            );
        return (
        <View>
        {listView}
        </View>
        );
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
            let color = data.special_price ? '#C5C8C9' : '#000';
            let textDecorationLine = data.special_price ? 'line-through' : 'none';
        return (
            <TouchableOpacity style={styles.row} onPress={Actions.deascriptionPage}> 
                <IconBadge
                    MainElement={ 
                        <Image style={styles.thumb} 
                                source={{ uri : data.productImages[0] ? data.productImages[0].image : null }}/>                        }
                    BadgeElement={
                      <Text style={{color:'#FFFFFF', fontSize: 10}}>{data.discount} %off</Text>
                    }
                    IconBadgeStyle={{
                        width:50,
                        height:16,
                        top : height/5-10,
                        left: 0,
                        backgroundColor: '#87cefa'}}/>
                <Text style={styles.name}>{data.product_name}</Text>
                <Text style={styles.description}>{data.short_description}</Text>
                <View style={{
                    flex: 0, 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    top : 5}}> 
                    <Text style={styles.special_price}>{data.special_price}Aed</Text>
                    <Text style={{fontSize:10, color: color, textDecorationLine: textDecorationLine}}>{data.price}Aed</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

var styles =StyleSheet.create({
    list: {
        // borderWidth: 1, 
        // borderColor: '#CCC',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    name : {
        fontSize : 10,
        top : 5

    },
    description : {
        fontSize : 7,
        top : 5
    },
    special_price : {
        fontSize : 10,
        fontWeight : 'bold'
    },

    row: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        width : width/3 -7,

        padding: 5,
        margin: 3,
      borderWidth: 1,
        borderColor: '#CCC'
    },

    thumb: {
        width: width/3-20,
        height: height/5
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    }
});