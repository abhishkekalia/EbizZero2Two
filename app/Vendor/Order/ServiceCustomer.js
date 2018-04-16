import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
const { width, height } = Dimensions.get('window')

class ServiceCustomer extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const {addressDetail, lang} = this.props;
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={styles.container}>

            <View style={{
                // borderWidth : 1,
                borderColor : '#ccc',
                width: '100%', // width ,
                flexDirection : direction,
                // backgroundColor: '#FFCC7D',
                marginHorizontal:20,
                // backgroundColor:'yellow',
           }}>
                <View style ={{
                        flexDirection : 'column', 
                        // backgroundColor:'red',
                        // width : '80%' //width/2-10
                        width:'100%',
                    }}>
                    <View style={{flexDirection : direction}}>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> {I18n.t('servicecustomer.fullname', { locale: lang })}</Text>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> :</Text>
                        <Text style={[styles.contentbody, {textAlign: textline}]}> {addressDetail.full_name}</Text>
                    </View>
                    <View style={{flexDirection : direction}}>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> {I18n.t('servicecustomer.mobileno', { locale: lang })}</Text>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> :</Text>
                        <Text style={styles.contentbody}> {addressDetail.mobile_number}</Text>
                    </View>
                    <View style={{flexDirection : direction}}>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> {I18n.t('servicecustomer.alternativeno', { locale: lang })}</Text>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> :</Text>
                        <Text style={styles.contentbody}> {addressDetail.mobile_number}</Text>
                    </View>

                    <View style={{flexDirection : direction}}>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> {I18n.t('servicecustomer.address', { locale: lang })}</Text>
                        <Text style={[styles.label ,{color : '#a9d5d1', textAlign: textline}]}> : </Text>
                        <Text style={[
                            styles.contentbody, { 
                                // width : width/2.5-20,  
                                textAlign: textline
                            }]}>
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
    fontSize: 14,
  },
  contentbody : {
    // color: '#fff',
    fontSize : 14,
  }
});

function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(ServiceCustomer);
