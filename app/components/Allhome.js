import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  TouchableHighlight,
  ToolbarAndroid,
  ScrollView
} from 'react-native';


class MyToolbar extends Component {
render() {
  var navigator = this.props.navigator;
   return (
    <ToolbarAndroid
     title={this.props.title}
     navIcon={require('./images/icon-checkbox-checked.png')}
     style = {styles.toolbar}
     titleColor={'white'} 
     onIconClicked={this.props.sidebarRef}/>
    );
 }
}



export default class Allhome extends Component {  
 render() {

  var navigationView = (
     <ScrollView>
  <View style = {{height:100, backgroundColor:'blue', justifyContent:'center'}}>
     <Text style = {{height:25, color:'white', fontSize:25, marginLeft:20}}>Welcome To ReactNative</Text>
  </View>
  </ScrollView>
);

return (
  <DrawerLayoutAndroid
    drawerWidth={300}
    drawerPosition={DrawerLayoutAndroid.positions.Left}
    renderNavigationView={() => navigationView}
    ref={'DRAWER'}>     
    <MyToolbar style={styles.toolbar}
        title={'Calendar'}
        navigator={this.props.navigator}
        sidebarRef={()=>this._setDrawer()}/>                  
    <View style={{flex: 1, alignItems: 'center'}}>
    <TouchableHighlight onPress={()=>this._setDrawer()}>            
      <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
      </TouchableHighlight>

    </View>
  </DrawerLayoutAndroid>  
);
}

 _setDrawer() {
   this.refs['DRAWER'].openDrawer();
  }  
 }

 const styles = StyleSheet.create({
   //your own style implementation

 });

