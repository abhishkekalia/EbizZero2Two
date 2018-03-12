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
import {connect} from "react-redux";
import I18n from 'react-native-i18n'

import Entypo from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import {CirclesLoader} from 'react-native-indicator';
import Swipeout from 'react-native-swipeout';
import EventEmitter from "react-native-eventemitter";

const { width } = Dimensions.get('window')
const ICON_SIZE = 24

class AddressBook extends Component {
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

        EventEmitter.removeAllListeners("reloadAddressList");
        EventEmitter.on("reloadAddressList", (value)=>{
            console.log("reloadAddressList", value);
            this.fetchAddress()
        });
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
            .catch((error) => {
                console.log(error);
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
            .catch((error) => {
                console.log(error);
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
        })
        .catch((error) => {
            console.log(error);
        })
        .done();

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
          title:''
          })
        })
        .then(()=>this.fetchAddress())
        .catch((error) => {
            console.log(error);
        })
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
                <TouchableOpacity onPress={()=>routes.newaddress({isFromEdit:false})}><Text>Add From here</Text></TouchableOpacity>
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

        <Modal isVisible={this.state.visibleModal}>
            <View style={{alignItems : 'center', padding:10}}>
                <CirclesLoader />
                </View>
            </Modal>

        </View>
        );
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';


        return (
                <View style={{ borderBottomWidth :1, borderColor : "#ccc", padding :5, backgroundColor:'#fff' }} >
                    <SelectItem data={data} u_id={this.state.u_id} country={this.state.country} callback={this.fetchAddress.bind(this)} lang={lang}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: direction, }}>
                                <View style={{ flexDirection: direction}}>
                                <Text style={{ fontSize : 15, color : '#a9d5d1',  textAlign: textline}}>{I18n.t('addressbook.name', { locale: lang })}</Text>
                                <Text style={{ fontSize: 15, color: '#000',  textAlign: textline}}>{data.full_name}</Text>
                                </View>
                                {/* <PopupMenu actions={['Edit', 'Remove']} onPress={this.onPopupEvent.bind(this, data)} /> */}
                            </View>

                            <View style={{ flexDirection: direction}}>
                            <Text style={{ fontSize : 10, color : '#a9d5d1',  textAlign: textline}}>{I18n.t('addressbook.mobile', { locale: lang })}</Text>
                            <Text style={{ fontSize : 10,  textAlign: textline}}>{data.mobile_number}</Text>
                            </View>
                            <Text style={{fontSize:12,  textAlign: textline}}>
                            {[data.block_no ," ", data.street , " ", data.houseno,"\n", data.appartment, " ",data.floor, " ",
                        data.jadda,"\n",data.city," ",data.direction]}
                        </Text>
                        </View>
                    </SelectItem>
                </View>
        );
    }
}

class SelectItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            size : '',
            color : 'blue',
            selectSize : false
        };
    }

    changeSize(result){
        this.setState({
            selectSize: false,
            size: result.selectedItem.label
        });
        this.editWishlist(result.selectedItem.label)
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
          title:''
          })
        })
        .then(()=>this.props.callback())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }

    onEdit (data) {
        console.log("edit Data:=",data)
        routes.newaddress({
            isFromEdit:true,
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
            block_no: data.block_no,
            houseno: data.houseno,
            street: data.street,
            appartment: data.appartment,
            floor: data.floor,
            jadda: data.jadda,
            direction: data.direction
        });
    }

    render() {
        const { lang } = this.props;
            let swipeBtns = [{
            text: I18n.t('addressbook.edit', { locale: lang }),
            backgroundColor: '#a9d5d1',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                this.onEdit(this.props.data)}
           // onPress: () => {this.editWishlist(data.product_id)}
         },{
            text: I18n.t('addressbook.delete', { locale: lang }),
            backgroundColor: '#f53d3d',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {this.onRemove(this.props.data)}
         }];

        return(
            <Swipeout
                left={swipeBtns}
                right={swipeBtns}
                autoClose={true}
                backgroundColor= 'transparent'>
                {this.props.children}
            </Swipeout>
        )
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
function mapStateToProps(state) {
	return {
		lang: state.auth.lang,
	};
}
export default connect(mapStateToProps)(AddressBook);
