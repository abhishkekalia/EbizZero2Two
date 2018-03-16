import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';

import {connect} from 'react-redux';


class HomeNavBar extends React.Component {
    _renderLeft() {
        // if (Actions.currentScene === 'homePage') {
            return (
                <TouchableOpacity
                  onPress={() =>Actions.drawerOpen()}
                  style={[styles.navBarItem, { paddingLeft: 10 }]}>
                  <EvilIcons name= "navicon" color="#fff" size={25} />
                </TouchableOpacity>
            )
        // } else {
            
        // }
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

    _renderRight(name) {
        return (
            <View style={
                [styles.navBarItem,
                {top: (Platform.OS === 'ios') ? 12 : 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                width:'15%',
                height: (Platform.OS === 'ios') ? '80%' : '100%'
            }
            ]}>
                <TouchableOpacity
                onPress={() => console.log('Share')}
                style={{ paddingRight: 10}}>
                    <Octicons name={name} size={25} color="#fff" />
                </TouchableOpacity>
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
                {renderRight}
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

export default connect(mapStateToProps)(HomeNavBar);
