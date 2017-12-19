import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Modal,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProgressBar  from './slider/ProgressBar';

const { width, height } = Dimensions.get('window')

export default class Timeline extends Component{
    constructor(props) {
        super(props); 
        this.state = {
          progress: 0
        };
    }
    componentDidMount(){
        // let i = 0;
        // let start = Date.now();
        // for (let j = 0; j < 1e9; j++) { 
            // i++;
        // }
        // alert("Done in " + (Date.now() - start) + 'ms');
        setTimeout(()=>{
            Actions.pop()
        }, 5000);
    }  
    render() {
        setTimeout((()=> { 
                this.setState({ 
                    progress: this.state.progress + (1 * Math.random())});
                }), 
            1000);
 
        return (
            <View style={styles.container}>
                <ProgressBar
                    fillStyle={{}}
                    backgroundStyle={{backgroundColor: '#fff'}}
                    style={{ width: width}}
                    progress={this.state.progress}
                />
                <Text>{this.state.progress}</Text>
                <Image
                source={{uri: this.props.uri ,width: width, height: 500}}
                style={{  
                alignSelf: 'center',
                flex: 1,
                width: width,
                height: null,
                resizeMode: 'cover',
                borderWidth: 1,}}
                resizeMode="stretch"/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
