import React, { Component } from 'react';
import {
      Image,
      ListView,
      TouchableOpacity,
      StyleSheet,
      AsyncStorage,
      RecyclerViewBackedScrollView,
      Text,
      View,
      Picker,
      Navigator,
      ActivityIndicator,
      ScrollView,
      Button,
      RefreshControl
  } from 'react-native';
import Utils from 'app/common/Utils';

export default class GetMyaddress extends Component {
 constructor(props) {
        super(props);
        this.state={
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            dataSource2: new ListView.DataSource({  rowHasChanged: (row1, row2) => row1 !== row2 }),
            status : false,
            loaded: false,
            toggle : false,
            refreshing: false,
            u_id: null,
            country : null,
            email : null,
            phone_no : null

        }
    }

   componentDidMount(){
        this.getKey()
        .then(()=>this.getAddress())
        .done()
    }
    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);

            this.setState({ 
                u_id: response.userdetail.u_id ,
                email: response.userdetail.email,
                phone_no: response.userdetail.phone_no,
                country: response.userdetail.country 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

     _onRefresh() {()=>
    this.setState({refreshing: true}, this.getAddress());
            
        }

    getAddress(){

        const { u_id, country } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('address_Type', String(1)); 
            const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;' 
                },
                body: formData,
            }
        fetch(Utils.gurl('addressList'), config)  
        .then((response) => response.json())
        .then((responseData) => { 
            this.setState({ 
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                status : responseData.status,
                refreshing: false,
                loaded : true
            });
        })
        .catch((error) => {
            console.log(error)
        })
        .done();
    }

    render() {
        var scrChange = this.state.actionText;
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.status) {
            return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text>No Address Listed</Text>
            </View> 
            );        
        }
        return (
      <ListView 
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh} />
        }
        dataSource={this.state.dataSource}
        renderRow={this.renderData}
        renderSeparator={this._renderSeparator}
        enableEmptySections={true}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        /> 
        );
    }

    renderLoadingView() {
        return (
            <ActivityIndicator  
            style={[styles.centering]} 
            color="#1e90ff" 
            size="large"/>
            );
    }

    renderData(data, rowData, sectionID, rowID, index) {
        return (
            <TouchableOpacity style={{ padding : 20}} >
            <Text style={{ fontSize: 15}}>

                   {data.full_name}
                    </Text>
                    <Text style={{ fontSize : 10}}>
                    M:{data.mobile_number}
                    </Text>
                    <Text style={{fontSize:12}}>
                        {[data.block_no ," ", data.street , " ", data.houseno,"\n", data.appartment, " ",data.floor, " ", 
                        data.jadda,"\n",data.city," ",data.direction]}
                    </Text>
            </TouchableOpacity>
            );
    }

    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
        <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}/>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6'
    },

    thumb: {
        width   :50,
        height  :50,
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

    heading: {
        paddingTop : 5,
        paddingBottom : 5,
        backgroundColor : '#fff',
        borderBottomWidth : 3,
        borderBottomColor : '#a9a9a9'
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
    }
});
