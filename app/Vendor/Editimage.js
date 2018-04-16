import React, { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    ListView,
    Text,
    View,
    Image,
    Dimensions,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from "react-native-elements";
const { width, height } = Dimensions.get('window')

export default class Editimage extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
            isLoading: true,
        }
    }
    componentWillReceiveProps(props) {
        this.fetch(props.productImages)
    }
    fetch(productImages) {
        this.setState({
            isLoading: false,
            dataSource: productImages,
        });
    }
    removeImage(url){
        myArray = this.state.dataSource.filter(function( obj ) {
            return obj.uri !== url;
        });
        this.props.callback(myArray);
        let a = url.split("/"),
        rm= a[a.length-1];
        this.props.getremovedata(rm);
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center',}}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <FlatList
                horizontal={true}
                data= {this.state.dataSource}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: rowData }) => {
                    return (
                        <View style={{ height:150, position: 'relative', zIndex:0}}>
                            <Icon onPress={()=>this.removeImage(rowData.uri)}
                                name="close-box" size={30} color='#696969'
                                style={{
                                    alignSelf: 'flex-end',
                                    position:'absolute',
                                    right :0,
                                    zIndex: 1,
                                    top:0
                                }
                            }/>
                            <Card
                                image={{ uri: rowData.uri }}
                                resizeMode="center"
                                containerStyle={styles.imageViewContainer}
                                />
                        </View>
                    );
                }}
                keyExtractor={(item, index) => index}
                />
        );
    }
}
const styles = StyleSheet.create({
    imageViewContainer: {
        width: 125,
        height: '100%',
        // position: 'relative',
        // zIndex: 0,
        margin: 0,
        borderWidth : StyleSheet.hairlineWidth,
        borderColor : '#ccc',
        paddingLeft :5
    }
});
