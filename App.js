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

import Drawer from 'react-native-drawer';
class ControlPanel extends Component {
    render() {
      return (
          <ScrollView>
              <View style = {{height:100, backgroundColor:'blue', justifyContent:'center'}}>
                  <Text  onPress={() => {this.props.closeDrawer()}}
                      style = {{height:25, color:'white', fontSize:25, marginLeft:20}}>Welcome To ReactNative</Text>
              </View>
          </ScrollView>

      );
    }
}
export default class App extends Component {
    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<ControlPanel closeDrawer={()=> this.closeControlPanel()} />}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                >
                <View style={{flex: 1, alignItems: 'center'}}>
                    <TouchableHighlight onPress={()=>this.openControlPanel()}>
                        <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
                    </TouchableHighlight>
                </View>
            </Drawer>
        );
    }
    closeControlPanel = () => {
      this._drawer.close()
    };
    openControlPanel = () => {
      this._drawer.open()
    };
}
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}
