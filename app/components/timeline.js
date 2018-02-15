import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Modal,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProgressBar  from './slider/ProgressBar';
// import FullscreenVideo from 'react-native-fullscreen-video';
import Video from 'react-native-video';
const { width, height } = Dimensions.get('window')

export default class Timeline extends Component{
    constructor(props) {
        super(props);
        this.state = {
          progress: 0
        };
    }
    componentDidMount(){
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
                {this.props.isImage ? <ImagePlayer uri = {this.props.uri}/> : <VideoPlayer/>}
            </View>
        )
    }
}
class ImagePlayer extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
     };
   }
   render() {
     return (
       <View style={{alignItems: "center", height: 280, width: width }}>
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
         </View>);
     }
   }

class VideoPlayer extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
     };
   }
   render() {
     return (
       <View style={{alignItems: "center", height: 280, width: width }}>
        <Video
         style={{height: 280, flex: 1, alignSelf: "stretch"}}
         resizeMode="cover"
         source={{uri: "http://techslides.com/demos/sample-videos/small.mp4"}} />
         </View>);
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
