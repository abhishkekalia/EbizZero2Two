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

import Entypo from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import {Actions as routes} from "react-native-router-flux";
// import RadioButton from 'app/common/RadioButton'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

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
            isSelected : ''
        };
     }
     onSelect(index, value){
        this.setState({
        isSelected: value
        }, this.addToOrder(value))
    }
     componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchAddress())
        .done()

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

    addToOrder(value){
        console.warn(this.props.order_detail);
        const { u_id, country } = this.state;
          let formData = new FormData();
          formData.append('u_id', String(u_id));
          formData.append('country', String(u_id));
          formData.append('order_detail', String(u_id));
          formData.append('amount', String(u_id));

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
                           // console.warn(JSON.stringify('responseData'));

               this.setState({ 
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
               });
          }).done();
    }

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
                           // console.warn(JSON.stringify('responseData'));

               this.setState({ 
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
               });
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
          // alert(JSON.stringify(responseData)) 
               // console.warn(JSON.stringify(responseData));

               // this.setState({ 
               //  dataSource: this.state.dataSource.cloneWithRows(responseData.data),
               // });
          }).done();

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
    else this.onRemove(data)}
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
        <View style={styles.container}>
        
        {listView}
        <TouchableOpacity style={{ alignItems : 'center', backgroundColor:'#ccc'}}  onPress={()=>routes.pop()}>
        <Text style={{padding :10}}>Close</Text>
        </TouchableOpacity>
        </View>
        );
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        return (
            <View>
            <RadioGroup 
            style={{ borderBottomWidth :1,borderColor : "#ccc",  padding :5, backgroundColor:'#fff'}} 
            onSelect = {(sectionID, value) => this.onSelect(sectionID, data.address_id)}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' , justifyContent: 'space-between'}}>    
                            <Text style={{ fontSize: 15}}>{data.full_name}</Text>
                            <PopupMenu actions={['Edit', 'Remove']} onPress={this.onPopupEvent.bind(this, data)} />
                        </View>
                        <Text style={{ fontSize : 10}}>{data.mobile_number}</Text>
                        <Text style={{fontSize:12}}>
                        {[data.address_line1 ," ", data.address_line2 , " ", data.landmark," ", data.town, " ",data.city, " ", data.state, "(", data.pincode ,")"]}
                        </Text>
                    </View>
                </View>
            </RadioGroup>
        </View>
        );
    }
}



class PopupMenu extends Component {
  static propTypes = {
    // array of strings, will be list items of Menu
    // actions:  PropTypes.arrayOf(PropTypes.string).isRequired,
    // onPress: PropTypes.func.isRequired
  }

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
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <Icon
            name='more-horiz'
            size={ICON_SIZE}
            color={'grey'}
            ref={this.onRef} />
        </TouchableOpacity>
      </View>
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
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: 'transparent',
  },
  list : {
     padding :10
  },
  topBar: {
        width : width/2,
        // backgroundColor : "#a52a2a",
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
  },
});
