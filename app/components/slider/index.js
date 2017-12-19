import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';
import { BubblesLoader } from 'react-native-indicator';
import Utils from 'app/common/Utils';


const {width,height} = Dimensions.get('window');

const Slide = props => { 
    return ( 
        <View style={styles.slide}>
            <Image onLoad={props.loadHandle.bind(null, props.i)}  
            style={styles.image} 
            source={{uri: props.uri}} />
            {
              !props.loaded && <View style={styles.loadingView}> 
              <BubblesLoader 
                color= {'#6a5acd'} 
                size={40} 
                dotRadius={10} />
            </View>
        }
        </View>
    )
}

export default class Slider extends Component<{}> {
    constructor (props) { 
        super(props); 
        this.state = { 
            data : [],
            loadQueue: [0, 0, 0, 0],
        }
        this.loadHandle = this.loadHandle.bind(this)
    }

    loadHandle (i) { 
        let loadQueue = this.state.loadQueue 
        loadQueue[i] = 1
        this.setState({ 
            loadQueue 
        })
    }
    render() {
    return (
      <View style={styles.container}>
         <Swiper loadMinimal loadMinimalSize={1} style={styles.wrapper} loop={false}>
                  {
                    this.props.imgList.map((item, i) => <Slide
                      loadHandle={this.loadHandle}
                      loaded={!!this.state.loadQueue[i]}
                      uri={item}
                      i={i}
                      key={i} />)
                  }
                </Swiper>

      </View>
    );
  }
}

const styles = StyleSheet.create({ 
    container: { 
        flex: 1
    },    
    qtybutton: {
        width : 40,
        height : 40,
        padding: 10,
        alignItems: 'center',
        borderWidth : 1,
        borderColor : "#87cefa",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        // shadowOffset:{width:2,height:4}
    },
    text: {
        color: '#000',
        fontSize: 12
    },

    
    slide: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    image: {
      width,
      flex: 1,
      backgroundColor: 'transparent'
    },
    
    loadingView: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,.5)'
    },
    
    loadingImage: {
        width: 60,
        height: 60
    },
    button: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'orange',
        alignItems: 'center',
    },

    buttonCart: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#87cefa',
        alignItems: 'center',
    }
});
