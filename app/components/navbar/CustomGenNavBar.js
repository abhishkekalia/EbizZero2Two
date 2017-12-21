import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';



export default class CustomGenNavBar extends React.Component {
    _renderLeft() {
        if (Actions.currentScene === 'homePage') { 
            return (
                <TouchableOpacity
                  onPress={() => console.log('Hamburger button pressed')}
                  style={[styles.navBarItem, { paddingLeft: 10 }]}>
                  <EvilIcons name= "navicon" color="#fff" size={25} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                onPress={Actions.pop}
                style={[styles.navBarItem, { paddingLeft: 10, top: (Platform.OS === 'ios') ? 15 : 0 }]}>
                    <Ionicons name= "ios-arrow-back-outline" color="#fff" size={25}/>
                </TouchableOpacity>
            )
        }
    }

    _renderMiddle() { 
        return (
            <View style={[styles.navBarItem, { top: (Platform.OS === 'ios') ? 15 : 0 }]}>
              <Text style={{color: '#fff',  fontSize: 15}}>{ this.props.title }</Text>
            </View>
        )
    }

    _renderRight(name) {
        return (
            <View style={[styles.navBarItem, { flexDirection: 'row', justifyContent: 'flex-end'  }]}>
                <TouchableOpacity
                onPress={() => console.log('Share')}
                style={{ paddingRight: 10}}>
                    <Octicons name={name} size={25} color="#fff" />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let dinamicStyle = { backgroundColor: '#a9d5d1'}
        let renderRight = this.props.renderRightButton ? this.props.renderRightButton() : this._renderRight() 

        return (
            <View style={[styles.container, dinamicStyle]}>
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
        flexDirection: 'row'
    }, 
    navBarItem: { 
        flex: 1, 
        justifyContent: 'center',
    }
})
