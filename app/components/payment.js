import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
} from 'react-native'
import CheckBox from 'app/common/CheckBox';

const keys = [
  {
    "path": "cod",
    "name": "Cash On Delivery",
    "icon_name": "account-balance-wallet",
    "checked": false
  },
  {
    "path": "Android",
    "icon_name": "payment",
    "name": "Access Gateway",
    "checked": false
  },
  
]
export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            dataArray: keys
        })
    }

    onClick(data) {
        // console.warn(JSON.stringify(this.state.dataArray))
        data.checked = !data.checked;
        // let msg=data.checked? 'you checked ':'you unchecked '
                // console.warn(JSON.stringify(data.name))

        // this.toast.show(msg+data.name);
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0)return;
        var len = this.state.dataArray.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
            </View>
        )
        return views;

    }

    renderCheckBox(data) {
        var leftText = data.name;
        var icon_name = data.icon_name;
        return (
            <CheckBox
                style={{flex: 1, padding: 10, borderBottomWidth : 1, borderColor : '#ccc'}}
                onClick={()=>this.onClick(data)}
                isChecked={data.checked}
                leftText={leftText}
                icon_name={icon_name}
            />);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.renderView()}
                    <Text>Card Number</Text>
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2',
        // marginTop:30
    },
    item: {
        flexDirection: 'column',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
})

