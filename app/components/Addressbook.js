import React, {Component, PropTypes} from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  UIManager, 
  findNodeHandle, 
  Dimensions, 
  ListView ,
  AsyncStorage
} from "react-native";
import Modal from 'react-native-modal';

import Entypo from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import {CirclesLoader} from 'react-native-indicator';

const { width } = Dimensions.get('window')
const ICON_SIZE = 24

export default class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.getKey = this.getKey.bind(this);      
        this.onSelect = this.onSelect.bind(this)
        this.state={
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }), 
            u_id: '',
            country : '',
            isSelected : '',
            loading: false,
            visibleModal: false,
            status : false
        };
    }

    onSelect(index, value){
        this.setState({
        isSelected: value,
        visibleModal: true
        }, ()=> this.getItems(value))

    }
    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchAddress())
        .done();

    }
    getItems (delivery_address_id){
        var Items = this.props.SetToList,
            length = Items.length,
            organization,
            Select =[],
            user,
            i;

        var today = new Date();
        var nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;
        nextdate= nextDay.getFullYear() +'-'+ parseInt(nextDay.getMonth()+1) + '-'+ nextDay.getDate() + ' '+  nextDay.toLocaleTimeString() ;

        for (i = 0; i < length; i++) {
            organization = Items[i];
            Select.push ({
                        "product_id": organization.product_id,
                        "size": organization.size,
                        "quantity": organization.quantity,
                        "delivery_address_id": this.state.isSelected,
                        "vendor_id":organization.vendor_id,
                        "price":organization.price,
                        "delivery_datetime": currentdate,
                        "order_date": nextdate 
                    })                 
        }
        this.addToOrder(Select)
        .done()
    }
    
    removeFromCart(value){
        try { 
            const { u_id, country } = this.state;
            let formData = new FormData();
            formData.append('u_id', String(u_id));
            formData.append('country', String(country));
            formData.append('order_detail', JSON.stringify(value));
            formData.append('amount', String(this.props.totalAmount));
            const config = { 
                   method: 'POST', 
                   headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'multipart/form-data;',
                   },
                   body: formData,
              }
            fetch(Utils.gurl('addToOrder'), config)  
            .then((response) => response.json())
            .then((responseData) => { 
            if(responseData.status){
            // console.warn("calling my Fatureh") 
              routes.myfaturah({ uri : responseData.data.url, order_id : responseData.data.order_id, callback: this.removeLoader})
              }else{
                this.removeLoader
            }
            })
              .done();
        } catch (error) {
            console.log("Error retrieving data" + error);
        }

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

    async addToOrder(value){
        try { 
            const { u_id, country } = this.state;
            let formData = new FormData();
            formData.append('u_id', String(u_id));
            formData.append('country', String(country));
            formData.append('order_detail', JSON.stringify(value));
            formData.append('amount', String(this.props.totalAmount));
            const config = { 
                   method: 'POST', 
                   headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'multipart/form-data;',
                   },
                   body: formData,
              }
            fetch(Utils.gurl('addToOrder'), config)  
            .then((response) => response.json())
            .then((responseData) => { 
            if(responseData.status){
            // console.warn("calling my Fatureh") 
              routes.myfaturah({ uri : responseData.data.url, order_id : responseData.data.order_id, callback: this.removeLoader})
              }else{
                this.removeLoader
            }
            })
              .done();
        } catch (error) {
            console.log("Error retrieving data" + error);
        }

    }
    removeLoader = () => this.setState({ 
        visibleModal : false
    })

    fetchAddress(){
        const { u_id, country } = this.state;
        
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
        fetch(Utils.gurl('addressList'), config)  
        .then((response) => response.json())
        .then((responseData) => { 
            if(responseData.status){
                this.setState({
                status : responseData.status, 
                 dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                });
            }else{
                this.setState({
                status : responseData.status, 
                });
            }
        }).done();
    }

    onRemove (data){
        const { u_id, country } = this.state;
          
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('address_id', String(data.address_id)); 

        const config = { 
             method: 'POST', 
             headers: { 
                  'Accept': 'application/json', 
                  'Content-Type': 'multipart/form-data;',
             },
             body: formData,
        }
        fetch(Utils.gurl('deleteAddress'), config)  
        .then((response) => response.json())
        .then((responseData) => {
          MessageBarManager.showAlert({ 
          message: responseData.data.message, 
          alertType: 'alert', 
          })
        })
        .then(()=>this.fetchAddress())
        .done();

    }
    onEdit (data) {
        routes.newaddress({ 
            address_id : data.address_id, 
            full_name : data.full_name,
            alternate_number : data.alternate_number, 
            mobile_number : data.mobile_number, 
            address_line1 : data.address_line1, 
            address_line2 : data.address_line2, 
            landmark : data.landmark, 
            town : data.town, 
            city : data.city, 
            state : data.state, 
            country : data.country, 
            pincode : data.pincode, 
            address_type : data.address_type, 
        });
    }

    onPopupEvent = (data, eventName, index) => {
        if (eventName !== 'itemSelected') return
        if (index === 0) this.onEdit(data);
        else this.onRemove(data)
    }
    noItemFound(){
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text>You have no Added Address </Text>
                <TouchableOpacity onPress={()=>routes.newaddress()}><Text>Add From here</Text></TouchableOpacity>
               </View> );
    }

    render() {
        const { isSelected } = this.state;
        // isSelected ? this.getItems(isSelected) : undefined;

         if (!this.state.status) {
            return this.noItemFound();
        } 
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
        <View style={styles.container}>
        
        {listView}
        <TouchableOpacity style={{ alignItems : 'center', backgroundColor:'#ccc'}}  onPress={()=>routes.pop()}>
        <Text style={{padding :10}}>Close</Text>
        </TouchableOpacity>

        <Modal isVisible={this.state.visibleModal}>
            <View style={{alignItems : 'center', padding:10}}>
                <CirclesLoader />
                </View>
            </Modal>

        </View>
        );
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        return (
            <RadioGroup 
            style={{ borderBottomWidth :1, borderColor : "#ccc", padding :5, backgroundColor:'#fff' }} 
            onSelect = {(sectionID, value) => this.onSelect(sectionID, value)}
            >
                <RadioButton value={data.address_id} >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ width: width-125, flexDirection: 'row' , justifyContent: 'space-between'}}>    
                            <Text style={{ fontSize: 15}}>{data.full_name}</Text>
                            <PopupMenu actions={['Edit', 'Remove']} onPress={this.onPopupEvent.bind(this, data)} />
                        </View>
                        <Text style={{ fontSize : 10}}>{data.mobile_number}</Text>
                        <Text style={{fontSize:12}}>
                        {[data.address_line1 ," ", data.address_line2 , " ", data.landmark," ", data.town, " ",data.city, " ", data.state, "(", data.pincode ,")"]}
                        </Text>
                    </View>
                </View>
                </RadioButton>
            </RadioGroup>
        );
    }
}



class PopupMenu extends Component {
    constructor (props) {
        super(props)
        this.state = {
            icon: null
        }
    }

    onError () {
        console.log('Popup Error')
    }

    onPress = () => {
        if (this.state.icon) {
            UIManager.showPopupMenu(
              findNodeHandle(this.state.icon),
              this.props.actions,
              this.onError,
              this.props.onPress
            )
        }
    }

    render () {
        return (
            <TouchableOpacity onPress={this.onPress}>
                <Icon
                name='more-horiz'
                size={ICON_SIZE}
                color={'grey'}
                ref={this.onRef} />
            </TouchableOpacity>
        )
    }
    onRef = icon => {
        if (!this.state.icon) {
            this.setState({icon})
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection : 'column',
        backgroundColor: 'transparent',
    },
    list : {
        padding :10
    },
    topBar: {
        width : width/2,
        alignItems : 'center',
        padding : 10,
        borderWidth : 1,
        borderColor : '#ccc',
        height :40
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    }
});