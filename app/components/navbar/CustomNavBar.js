import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { EventEmitter } from 'events';
import EE12 from "react-native-eventemitter";
import {connect} from 'react-redux';


class CustomNavBar extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
    _renderLeft() {
        const {lang}= this.props

        return (
            <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navBarItem, { alignSelf: 'center'}]}>
                <Entypo name="cross"
                size={30}
                color="#fff"
                style={{ textAlign: (lang == 'ar')?'right': 'left', padding: 10}}
                />
            </TouchableOpacity>
        )
    }

    _renderMiddle() {
        return (
            <View style={[styles.navBarItem,{alignItems:'center'}]}>
                <Text style={{color: '#fff' , fontSize: 15}}>Filters</Text>
            </View>
        )
    }

    _renderRight() {
        return (
            <View style={[styles.navBarItem, { flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center', opacity:1 }]}>
                <TouchableOpacity
                onPress={() => EE12.emit("refreshFilterOption","")}
                style={{ paddingRight: 10 }}>
                    <Ionicons name="ios-refresh"
                    size={30}
                    color="#fff"/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {lang}= this.props

        let dinamicStyle = {backgroundColor: '#a9d5d1'}
        return (
            <View style={[styles.container, dinamicStyle, {flexDirection: (lang == 'ar')? "row-reverse" : "row"}]}>
                { this._renderLeft() }
                { this._renderMiddle() }
                { this._renderRight() }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: (Platform.OS === 'ios') ? 64 : 54,
    },
    navBarItem: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios' ? 15 :0)
    }
})
function mapStateToProps(state) {
	return {
		lang: state.auth.lang,
	};
}

export default connect(mapStateToProps)(CustomNavBar);
