import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class Terms extends Component<{}> {
  render() {
    return (
      <WebView
        source={{ html: this.props.description}}
        style={{marginTop: 20}}
      />
    );
  }
}
