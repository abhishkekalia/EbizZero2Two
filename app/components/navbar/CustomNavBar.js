import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class CustomNavBar extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
    _renderLeft() {
        return (
            <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navBarItem, { paddingLeft: 10}]}>
                <Entypo name="cross" 
                size={30} 
                color="#fff"
                />
            </TouchableOpacity>
        )
    }

    _renderMiddle() { 
        return (
            <View style={styles.navBarItem}>
                <Text style={{color: '#fff' , fontSize: 15}}>Filters</Text>
            </View>
        )
    }

    _renderRight() {
        return ( 
            <View style={[styles.navBarItem, { flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center' }]}>
                <TouchableOpacity
                onPress={() => console.warn('refresh')}
                style={{ paddingRight: 10 }}>
                    <Ionicons name="ios-refresh" 
                    size={30} 
                    color="#fff"/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let dinamicStyle = {backgroundColor: '#a9d5d1'}
        return (
            <View style={[styles.container, dinamicStyle]}>
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
        flexDirection: 'row'
    }, 
    navBarItem: { 
        flex: 1, 
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios' ? 15 :0)
    }
})
