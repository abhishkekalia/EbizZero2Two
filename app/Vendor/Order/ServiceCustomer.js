import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';
const { width, height } = Dimensions.get('window')

export default class ServiceCustomer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // addressDetail : {
            //     "address_id": "2",
            //     "address_type": "1",
            //     "u_id": "3",
            //     "full_name": "Divya Trasadiya",
            //     "mobile_number": "6454545554",
            //     "pincode": "415241",
            //     "alternate_number": "4556454",
            //     "address_line1": "devarc commercial building",
            //     "address_line2": "iscon",
            //     "landmark": "xxx",
            //     "town": "ahmedabad",
            //     "city": "ahmedabad",
            //     "state": "gujarat",
            //     "country": "1",
            //     "inserted_date": "2017-10-12 12:57:48",
            //     "updated_date": "2017-10-13 05:33:06"
            // },
        }
    }

    render() {
        const {addressDetail} = this.props;
        return (
            <View style={styles.container}>

            <View style={{
                borderWidth : 1, 
                borderColor : '#ccc',
                width: width ,
                flexDirection : 'row',
                backgroundColor: 'orange',

           }}>
                <View style ={{flexDirection : 'column', width : width/2-10}}>
                    <View style={{flexDirection : 'row'}}>
                        <Text style={[styles.label ,{color : '#a9d5d1'}]}> Full Name : </Text>
                        <Text style={styles.contentbody}> {addressDetail.full_name}</Text>
                    </View>
                    <View style={{flexDirection : 'row'}}>
                        <Text style={[styles.label ,{color : '#a9d5d1'}]}> Mobile Number : </Text>
                        <Text style={styles.contentbody}> {addressDetail.mobile_number}</Text>
                    </View>
                    <View style={{flexDirection : 'row'}}>
                        <Text style={[styles.label ,{color : '#a9d5d1'}]}> Alternate Number : </Text>
                        <Text style={styles.contentbody}> {addressDetail.alternate_number}</Text>
                    </View>
                </View>

                <View style={{flexDirection : 'row', width : width/2-30}}>
                    <Text style={[styles.label ,{color : '#a9d5d1'}]}>Address : </Text>
                    <Text style={[styles.contentbody, { width : width/2.5-20}]}> 
                    {addressDetail.address_line1} {" "} 
                    {addressDetail.address_line2}{" "}
                    {addressDetail.landmark}{" "}
                    {addressDetail.town} {" "}
                    {addressDetail.city} {" "}
                    {addressDetail.state} {" "}
                    {addressDetail.pincode} {" "}
                    </Text>
                </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding : 5
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  label: {
    // textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  },
  contentbody : {
    color: '#fff',
    fontSize : 11
  }
});
