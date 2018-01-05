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

 
export default class MyProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    GetItem (flower_name) {
        Alert.alert(flower_name); 
    }

    componentDidMount() {
        return fetch('https://reactnativecode.000webhostapp.com/FlowersList.php')
        .then((response) => response.json())
        .then((responseJson) => {
          let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson),
          }, function() {
            // In this block you can do something with new state.
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
                backgroundColor: "#CCC",
              }}
            />
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                  <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.MainContainer}> 
                <ListView
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                dataSource={this.state.dataSource}
                renderSeparator= {this.ListViewItemSeparator} 
                renderRow={this.renderData.bind(this)}/>
            </View>
        );
    }
    renderData(rowData: string, sectionID: number, rowID: number, index) {
        return (
            <View style={{flex:1, flexDirection: 'row'}}> 
            <Image source = {{ uri: rowData.flower_image_url }} style={styles.imageViewContainer} />
            <Text onPress={this.GetItem.bind(this, rowData.flower_name)} style={styles.textViewContainer} >{rowData.flower_name}</Text>
            </View>
        );
    }

}
 
const styles = StyleSheet.create({ 
    MainContainer :{ 
        justifyContent: 'center',
        flex:1,
        margin: 5,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    imageViewContainer: {
        width: '50%',
        height: 100 ,
        margin: 10,
        borderRadius : 10
    },

    textViewContainer: { 
        textAlignVertical:'center',
        width:'50%', 
        padding:20 } 
});