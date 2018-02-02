import React, { Component ,PropTypes } from 'react';
import {
    ListView, 
    StyleSheet, 
    Text, 
    Image,
    View, 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
// import Image from 'react-native-image-progress';
// import ProgressBar from 'react-native-progress/Circle';
import Feather from 'react-native-vector-icons/Feather';

export default class GetImage extends Component {
    constructor(props) {
        super(props);
        this.fetchData= this.fetchData.bind(this);
        var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        
        this.state={ 
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }), 
        }
    }

    static propTypes = { 
        // container_id:   React.PropTypes.string.isRequired,
        // type: React.PropTypes.string.isRequired,
        // fetchData:   React.PropTypes.func.isRequired 
    };

    componentDidMount(){
        this.fetchData()
    }

    blur() {
        const {dataSource } = this.state;
        dataSource && dataSource.blur();
    }

    focus() {
        const {dataSource } = this.state;
        dataSource && dataSource.focus();
    }

    componentWillUpdate() {
        this.fetchData();
    }

    fetchData(){
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.images),
                refreshing : false
        });
    }

    render() {
        if(!this.state.dataSource.length){
            return <Feather 
                            name="image" size= {30} style={{padding :20 }} />
        }
        let listView = (<View></View>);
            listView = (
                <ListView
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
            );
        return (
        <View>{listView}</View>
        );
    }

    renderData(photos, rowData: string, sectionID: number, rowID: number, index) {
        return (
            <View style={styles.row}>
            <Feather name="image" size= {30} style={{padding :20 }} />
            </View>
        );
    }
}

var styles =StyleSheet.create({
    list: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    row: {
        justifyContent: 'center',
        padding: 5,
        margin: 3,
        width: 85,
        height: 85,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#CCC'
    },

    thumb: {
        width: 75,
        height: 75
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    }
});