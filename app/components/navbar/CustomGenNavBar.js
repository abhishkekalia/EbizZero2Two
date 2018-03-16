import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';

import {connect} from 'react-redux';


class CustomGenNavBar extends React.Component {
    _renderLeft() {
        const { lang } = this.props;
        if (Actions.currentScene === 'homePage') {
            return (
                <TouchableOpacity
                  onPress={() => console.log('Hamburger button pressed')}
                  style={[styles.navBarItem, ]}>
                  <EvilIcons name= "navicon" color="#fff" size={25} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                onPress={Actions.pop}
                style={
                    [styles.navBarItem,
                { paddingLeft: 10, top: (Platform.OS === 'ios') ? 15 : 0 ,
                width:'15%',
                height: (Platform.OS === 'ios') ? '80%' : '100%',
                justifyContent: 'center'
                // transform: lang == 'ar'? [{ rotate: '180deg'}] : null
            }
                ]}>
                    <Ionicons name= "ios-arrow-back-outline" color="#fff" size={25} style={ lang == 'ar' ? { alignSelf: 'center', transform: [{ rotate: '180deg'}]}:{ alignSelf: 'center'}}/>
                </TouchableOpacity>
            )
        }
    }

    _renderMiddle() {
        return (
            <View style={
                [styles.navBarItem,
                { top: (Platform.OS === 'ios') ? 12 : 0 ,
                width:'70%',
                height: (Platform.OS === 'ios') ? '80%' : '100%',
                justifyContent: 'center',
                alignItems:'center'
                }
                ]}>
              <Text style={{color: '#fff',  fontSize: 15}}>{ this.props.title }</Text>
            </View>
        )
    }

    _renderRight() {
        return (
            <View style={
            { paddingLeft: 10, top: (Platform.OS === 'ios') ? 15 : 0 ,
            width:'15%',
            height: (Platform.OS === 'ios') ? '80%' : '100%',
            justifyContent: 'center'

        }
            }>
            {this.props.renderRightButton ? this.props.renderRightButton(): undefined}
            </View>
        )
    }

    render() {
        const {lang}= this.props
        let dinamicStyle = { backgroundColor: '#a9d5d1'}
        let renderRight = this.props.renderRightButton ? this.props.renderRightButton() : this._renderRight()
        return (
            <View style={[styles.container, dinamicStyle, {flexDirection: (lang == 'ar')? "row-reverse" : "row"}]}>
                { this._renderLeft() }
                { this._renderMiddle() }
                {this._renderRight()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: (Platform.OS === 'ios') ? 64 : 54,
    },
    navBarItem: {
        // flex: 1,
        justifyContent: 'center',
    }
})
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}

export default connect(mapStateToProps)(CustomGenNavBar);
