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
                backgroundColor: '#FFCC7D',

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
                        <Text style={styles.contentbody}> {addressDetail.mobile_number}</Text>
                    </View>
                </View>

                <View style={{flexDirection : 'row', width : width/2-30}}>
                    <Text style={[styles.label ,{color : '#a9d5d1'}]}>Address : </Text>
                    <Text style={[styles.contentbody, { width : width/2.5-20}]}>
                    {addressDetail.block_no} {" "}
                    {addressDetail.houseno}{" "}
                    {addressDetail.street}{" "}
                    {addressDetail.appartment} {" "}
                    {addressDetail.floor} {" "}
                    {addressDetail.jadda} {" "}
                    {addressDetail.city} {" "}
                    {addressDetail.direction} {" "}
                    {addressDetail.country} {" "}
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
