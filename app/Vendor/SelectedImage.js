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

import { Card } from "react-native-elements";
const { width, height } = Dimensions.get('window')

export default class SelectedImage extends Component {
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
            horizontal
            data= {this.state.dataSource}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: rowData }) => { 
                return ( 
                <Card 
                image={{ uri: rowData.uri }}
                containerStyle={styles.imageViewContainer}
                />
                );
            }}
            keyExtractor={(item, index) => index}
            />
        );
    }
}
const styles = StyleSheet.create({ 
    imageViewContainer: {
        width: 80,
        height: 90,
        margin: 10,
        borderWidth : 1,
        borderColor : '#ccc',
        padding :2
    }
});