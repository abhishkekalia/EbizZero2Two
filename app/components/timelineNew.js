import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Modal,
    Image,
    TouchableOpacity,
    Platform,
    Slider,
    TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProgressBar  from './slider/ProgressBar';
// import FullscreenVideo from 'react-native-fullscreen-video';
import Video from 'react-native-video';
// import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
import Ionicons from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window')

var timerVar;
var timerVarUpdate;

export default class TimelineNew extends Component{
    constructor(props) {
        super(props);
        this.state = {
          progress: 0,
          isRunning: false,
          indexOfAdvertise: 0,
        };
    }

    componentDidMount(){
    }
    
    startCounter(){
      console.log("start counter called")
      this.updateCounter()
      // var timerVar;
      clearTimeout(timerVar)
      timerVar = setTimeout(()=>{
          // Actions.pop()
          var nextIndex = this.state.indexOfAdvertise
          if (this.state.indexOfAdvertise < this.props.arrAdvertise.length-1) {
            nextIndex = this.state.indexOfAdvertise+1
            console.log("nextIndex:=",nextIndex)
          }
          else {
            console.log("Actions.pop():=")            
            Actions.pop()
          }
          this.setState({
            progress:0,
            indexOfAdvertise:nextIndex,
          })
      }, 9000);
    }
    render() {
      // var that = this
      //   setTimeout((()=> {
      //     // this.setState({
      //     //     progress: this.state.progress + (1 * Math.random())
      //     // });
      //     that.updateCounter()
      //   }),1000);
      var advertise = this.props.arrAdvertise[this.state.indexOfAdvertise]
      console.log("advertise:=",advertise)

        return (          
          <View style={styles.container}>
            <TouchableWithoutFeedback style={{}} 
            onPress={this.nextItemToPlay.bind(this)}>
            <View>
                {/* <ProgressBar
                    fillStyle={{}}
                    backgroundStyle={{backgroundColor: '#fff'}}
                    style={{
                      width: width,
                      marginTop: Platform.OS === 'ios' ? 40 : 30,
                    }}
                    progress={this.state.progress}
                /> */}
                <Slider 
                  minimumValue={0}
                  maximumValue={10}
                  value={this.state.progress}
                  thumbImage={require('../images/ThumbImage.png')}
                  thumbTintColor={'transparent'}
                  step={0.01}
                  style={{
                    // height:5,
                    width: width,
                    // marginTop: Platform.OS === 'ios' ? 0 : 0,
                    zIndex:2,
                    position:'absolute',
                  }}
                />
                <Ionicons name= "x-circle" color="#ccc" size={40}
                        onPress={Actions.pop}
                        style={{
                            position : "absolute",
                            zIndex : 1,
                            marginLeft : 0,
                            marginTop : Platform.OS === 'ios' ? 25 : 25,
                            paddingHorizontal : 10,
                            backgroundColor : 'transparent',
                        }
                    }/>
              {this.props.arrAdvertise[this.state.indexOfAdvertise].ad_type === '1' ? <ImagePlayer uri = {this.props.arrAdvertise[this.state.indexOfAdvertise].path} callback={()=>this.startCounter()}/> : <VideoPlayer uri = {this.props.arrAdvertise[this.state.indexOfAdvertise].path} callback={()=>this.startCounter()}/>}
              </View>
              </TouchableWithoutFeedback>
          </View>          
        )
    }

     nextItemToPlay() {
       clearTimeout(timerVar)
      var nextIndex = 0
      console.log("this.state.indexOfAdvertise:=",this.state.indexOfAdvertise)
      console.log("this.props.arrAdvertise.length:=",this.props.arrAdvertise.length)
      if (this.state.indexOfAdvertise < this.props.arrAdvertise.length-1) {
        nextIndex = this.state.indexOfAdvertise+1
        console.log("nextIndex:=",nextIndex)
        this.setState({
          progress:0,
          indexOfAdvertise:nextIndex
        })
      }
      else {
        console.log("Actions.pop():=")            
        Actions.pop()
      }
    }
    
    updateCounter() {
      this.setState({
        progress:this.state.progress+1
      })
      var that = this
      clearTimeout(timerVarUpdate)
      timerVatUpdate = setTimeout((()=> {
        // this.setState({
        //     progress: this.state.progress + (1 * Math.random())
        // });
        if (this.state.progress <=10) {
          that.updateCounter()
        }
        
      }),1000);
    }
}
class ImagePlayer extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
     };
   }
   render() {
      console.log("Image this.props.uri:=",this.props.uri)
      return (
       <View style={{alignItems: "center", height: height, width: width }}>
        <Image
          source={{uri: this.props.uri ,width: width, height: height}}
          // onLoad={()=>console.warn('load')}
          onLoad={this.props.callback}
          onError={this.props.callback}
          style={{
          alignSelf: 'center',
          flex: 1,
          width: width,
          height: null,
          resizeMode: 'contain',
          borderWidth: 1,}}
          // resizeMode="stretch"
          //  backgroundColor="red"
        />
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
     console.log("Video this.props.uri:=",this.props.uri)
     return (
      <View style={{alignItems: "center", height: height, width: width }}>
        <Video
          style={{height: height, flex: 1, alignSelf: "stretch"}}
          resizeMode="contain"
          source={{uri: this.props.uri}}
          //  onLoadStart={()=>console.warn('loading')}
          onLoad={this.props.callback}
          onError={this.props.callback}
         />         
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
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