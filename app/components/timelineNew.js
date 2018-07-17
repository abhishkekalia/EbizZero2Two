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
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProgressBar  from './slider/ProgressBar';
// import FullscreenVideo from 'react-native-fullscreen-video';
import Video from 'react-native-video';
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
          isLoading: true,
          isError: false,
        };
    }

    componentDidMount(){
    }
    
    startCounter(){
      console.log("start counter called")
      this.state.isError = false,
      this.state.isLoading = false
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
            isLoading: true,
            isError: false,
          })
      }, 9000);
    }

    startCounterWithError(error) {
      console.log("start counter with Error called")
      console.log("Error:=",error)
      this.state.isError = true,
      this.state.isLoading = false
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
            isLoading:true,
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
              {this.props.arrAdvertise[this.state.indexOfAdvertise].ad_type === '1' ? <ImagePlayer uri = {this.props.arrAdvertise[this.state.indexOfAdvertise].path} callback={()=>this.startCounter()} callbackError={this.startCounterWithError.bind(this)}/> : <VideoPlayer uri = {this.props.arrAdvertise[this.state.indexOfAdvertise].path} callback={()=>this.startCounter()} callbackError={this.startCounterWithError.bind(this)} onEndPlay={this.nextItemToPlay.bind(this)}/>}
              </View>
              </TouchableWithoutFeedback>
              {this.state.isLoading === true ? <ActivityIndicator
                style={{
                  flex : 1,
                  justifyContent  :'center',
                  alignItems : 'center',
                  alignContent :'center',
                  alignSelf : 'center',
                  zIndex: 3,
                  position: 'absolute',
                  marginLeft:width-30/2
                }}
                color="#a9d5d1"
                size="large"
              /> : undefined}

              {this.state.isError === true ? <Text style={{
                position:'absolute',
                marginHorizontal: 10,
                width:width-20,
                zIndex: 3,
                textAlign:'center',
                textAlignVertical: 'center',
                // backgroundColor: 'red',
                color:'white',
              }}>Item not exists!</Text> : undefined}
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
          indexOfAdvertise:nextIndex,
          isLoading: true,
          isError: false,
        })
      }
      else {
        console.log("Actions.pop():=")            
        Actions.pop()
      }
    }
    
    updateCounter() {
      this.setState({
        progress:this.state.progress+1,
        // isLoading:false,
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
          onError={this.props.callbackError}
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
          // source={{uri: "http://zero2two.com/zerototwo/images/markrting/1531720492.MOV"}}
          //  onLoadStart={()=>console.warn('loading')}
          // onEnd={this.props.onEndPlay}
          onLoad={this.props.callback}
          onError={this.props.callbackError}
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
