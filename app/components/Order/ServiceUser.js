import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';
import I18n from 'react-native-i18n';
const { width, height } = Dimensions.get('window')

export default class ServiceUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const {addressDetail, lang} = this.props;
        let direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start';
        return (
            <View style={styles.container}>
                <View style={{
                        borderWidth : StyleSheet.hairlineWidth,
                        borderColor : '#ccc',
                        width: width ,
                        // flexDirection : 'row',
                        backgroundColor: '#FFCC7D',
                    }}>
                    <View style ={{flexDirection : 'column', width : width}}>
                        <View style={{flexDirection : direction,}}>
                            <Text style={[styles.label ,{color : '#696969'}]}> {I18n.t('userorderhistory.customername', { locale: lang })}</Text>
                            <Text style={[styles.label ,{color : '#696969'}]}> : </Text>
                            <Text style={styles.contentbody}> {addressDetail.full_name}</Text>
                        </View>
                        <View style={{flexDirection : direction}}>
                            <Text style={[styles.label ,{color : '#696969'}]}> {I18n.t('userorderhistory.mobilenum', { locale: lang })}</Text>
                            <Text style={[styles.label ,{color : '#696969'}]}> : </Text>
                            <Text style={styles.contentbody}> {addressDetail.mobile_number}</Text>
                        </View>
                        <View style={{flexDirection : direction}}>
                            <Text style={[styles.label ,{color : '#696969'}]}> {I18n.t('userorderhistory.altno', { locale: lang })}</Text>
                            <Text style={[styles.label ,{color : '#696969'}]}> : </Text>
                            <Text style={styles.contentbody}> {addressDetail.alternate_number}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection : direction, width : width}}>
                        <Text style={[styles.label ,{color : '#696969'}]}> {I18n.t('userorderhistory.address', { locale: lang })}</Text>
                        <Text style={[styles.label ,{color : '#696969'}]}> : </Text>
                        <Text style={[styles.contentbody, { width : width/2.5}]}>
                            {addressDetail.block_no} {" "}
                            {addressDetail.street}{" "}
                            {addressDetail.houseno}{" "}
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
        color: '#fff',
        marginBottom: 5,
    },
    contentbody : {
        color: '#fff',
        fontSize : 11,
        alignSelf: 'center'
    }
});
