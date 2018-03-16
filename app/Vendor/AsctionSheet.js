import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ListView } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
 
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
// const options = [ 'Cancel', 'Apple', 'Banana', 'Watermelon', 'Durian' ]
const title = 'Which one do you like?'

export default class App extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      options : [ 'Cancel', 'Apple', 'Banana', 'Watermelon', 'Durian' ]
    }
    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
  }
 
  showActionSheet() {
    this.ActionSheet.show()
  }
 
  handlePress(i) {
    this.setState({
      selected: i
    })
  }
 
  render() {
    return (
      <View >
        <Text style={{marginBottom: 20}} >I like {this.state.options[this.state.selected]}</Text>
        <Text onPress={this.showActionSheet}>Example A</Text>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={this.state.options}
          cancelButtonIndex={CANCEL_INDEX}
          // destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
      </View>
    )
  }
}