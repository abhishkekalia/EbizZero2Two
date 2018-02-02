import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab'
import FeaturedProduct from './FeaturedProduct'
import Feather from 'react-native-vector-icons/Feather';
import { Actions} from "react-native-router-flux";

class Marketing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
            selectedIndices: [0],
            customStyleIndex: 0,
        }
    }

    handleSingleIndexSelect = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index,
        });
    }

    handleMultipleIndexSelect = (index) => {
        if (this.state.selectedIndices.includes(index)) {
            this.setState({
                ...this.state,
                selectedIndices: this.state.selectedIndices.filter((i) => i !== index),
            });
        }
        else {
            this.setState({
                ...this.state,
                selectedIndices: [
                    ...this.state.selectedIndices,
                    index,
                ],
            });
        }
    }

    handleCustomIndexSelect = (index) => {
        this.setState({
            ...this.state,
            customStyleIndex: index,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SegmentedControlTab
                    values={['Featured Product', 'Marketing Campaign']}
                    selectedIndex={this.state.customStyleIndex}
                    onTabPress={this.handleCustomIndexSelect}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: '#a9d5d1' }}
                    tabStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                    activeTabStyle={{ backgroundColor: '#fbcdc5' }}
                    tabTextStyle={{ color: '#696969', fontWeight: 'bold' }}
                    activeTabTextStyle={{ color: '#fff' }} />
                {this.state.customStyleIndex === 0 &&
                    <FeaturedProduct/>}
                {this.state.customStyleIndex === 1 &&
                    <UploadAdd/>}

            </View>
        );
    }
}
const UploadAdd = props => { 
    
    return ( 
        <TouchableOpacity style={styles.upload} onPress={()=> Actions.marketingcompaign()}>
        <Feather name="upload-cloud" size= {20} color="#fff" />
        <Text style={{color : '#fff'}}>Upload Add</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        // padding: 10
    },
    tabViewText: {
        color: '#444444',
        fontWeight: 'bold',
        marginTop: 50,
        fontSize: 18
    },
    titleText: {
        color: '#444444',
        padding: 20,
        fontSize: 14,
        fontWeight: '500'
    },
    upload : {
        padding : 10,
        backgroundColor : '#fbcdc5',
        left : 70,
        top : 10,
        flexDirection : 'row',
        borderRadius : 5
    },
    headerText: {
        padding: 8,
        fontSize: 14,
        color: '#444444'
    },
    tabContent: {
        color: '#444444',
        fontSize: 18,
        margin: 24
    },
    Seperator: {
        marginHorizontal: -10,
        alignSelf: 'stretch',
        borderTopWidth: 1,
        borderTopColor: '#888888',
        marginTop: 24
    }
})



export default Marketing