import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};
export default class TabIcon extends Component {
	constructor(props){
		super(props);

	}
  render() {
    var color = this.props.selected ? '#ff8c00' : '#301c2a';

    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon style={{color: this.props.focused ? '#ff8c00' : '#a9d5d1'}} name={this.props.iconName || "circle"} size={18}/>
        <Text style={{color:this.props.focused ? '#ff8c00' : '#301c2a' ,fontSize: this.props.focused ? 13 : 10}}>{this.props.title}</Text>
      </View>
    );
  }
}