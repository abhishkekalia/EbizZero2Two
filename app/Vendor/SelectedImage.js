import React, { Component } from 'react';

import { 
    StyleSheet, 
    ActivityIndicator, 
    ListView, 
    Text, 
    View, 
    Image, 
    Platform,
    Dimensions
} from 'react-native';
 const { width, height } = Dimensions.get('window')

export default class SelectedImage extends Component {
    constructor(props) {
        super(props);
               
        this.state={ 
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }), 
            isLoading: true,
        }
    }
    componentDidMount() {
        return fetch('https://reactnativecode.000webhostapp.com/FlowersList.php')
        .then((response) => response.json())
        .then((responseJson) => { 
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
            this.setState({
                isLoading: false,
                dataSource: this.state.dataSource.cloneWithRows(this.props.productImages),
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }

    ListViewItemSeparator = () => {
        return (
            <View
            style={{
                height: .5,
                width: "100%",
                backgroundColor: "#000",
            }}/>
        );
    }
    render() {
        if (this.state.isLoading) { 
            return (
                <View style={{flex: 1, justifyContent: 'center',}}>
                    <ActivityIndicator />
                </View>
            );
        }
 
        return (
            <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderSeparator= {this.ListViewItemSeparator}
            renderRow={(rowData) =>
                <View style={styles.row}> 
                    <Image source = {{ uri: rowData.uri }} style={styles.imageViewContainer} />
                </View>
            }/>
        );
    }
}
 
const styles = StyleSheet.create({ 
    imageViewContainer: {
        width: '100%',
        height: 70 ,
        margin: 10,
        borderRadius : 10
    },
    list: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    row: {
        justifyContent: 'center',
        padding: 5,
        margin: 3,
        width: width/3-20,
        height: width/3-20,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#CCC'
    }, 
});