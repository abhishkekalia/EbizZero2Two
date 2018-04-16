import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions
} from 'react-native';
import I18n from 'react-native-i18n';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import FeaturedProduct from './FeaturedProduct'
import Feather from 'react-native-vector-icons/Feather';
import { Actions} from "react-native-router-flux";

const { width, height } = Dimensions.get('window')

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
        const {lang , u_id, country} = this.props;

        return (
            <View style={styles.container}>
                <SegmentedControlTab
                    values={[I18n.t('venderprofile.featuredproducttab', { locale: lang }), I18n.t('venderprofile.marketingtab', { locale: lang })]}
                    selectedIndex={this.state.customStyleIndex}
                    onTabPress={this.handleCustomIndexSelect}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: '#a9d5d1' }}
                    tabStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                    activeTabStyle={{ backgroundColor: '#fbcdc5' }}
                    tabTextStyle={{ color: '#696969', fontWeight: 'bold' }}
                    activeTabTextStyle={{ color: '#fff' }} />
                {this.state.customStyleIndex === 0 &&
                    <FeaturedProduct data={this.props.data} status={this.props.status} lang={lang} 	u_id={u_id} country={country}/>}
                {this.state.customStyleIndex === 1 &&
                    <UploadAdd marketing_campaign={this.props.marketing_campaign} lang={lang}/>}

            </View>
        );
    }
}
class UploadAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2 }),
            status : false
        }
    }
     componentDidMount(){
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.marketing_campaign),
        })
    }

    componentWillReceiveProps(nextProps){
        console.warn(nextProps.marketing_campaign);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.marketing_campaign),
        })
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
    noItemFound(){
        return (
            <View style={{ flex:1,  justifyContent:'center', alignItems:'center'}}/>
        );
    }
    ListViewItemSeparator = () => {
        return (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                width: "100%",
                backgroundColor: "#000",
              }}
            />
        );
    }
    render(){
        const {lang} = this.props,
		direction = lang == 'ar'? 'row-reverse': 'row',
		align = lang == 'ar'? 'flex-end': 'flex-start',
		textline = lang == 'ar'? 'right': 'left';
        let listView = (<View></View>);
            listView = (
               <ListView
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                dataSource={this.state.dataSource}
                renderSeparator= {this.ListViewItemSeparator}
                renderRow={this.renderData.bind(this)}/>
            );
        return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            // backgroundColor:'red',
            alignContent:'center',
        }}>
            <TouchableOpacity style={styles.upload} onPress={()=> Actions.marketingcompaign()}>
            <Feather name="upload-cloud" size= {20} color="#fff" />
            <Text style={{color : '#fff',  marginLeft:5}}>{I18n.t('venderprofile.uploadad', { locale: lang })}</Text>
            </TouchableOpacity>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',}}>
            {listView}
            </View>
            </View>
        )
    }
    renderData(data: string, sectionID: number, rowID: number, index) {
        const {lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';

        if (this.state.dataSource.getRowCount() === 0 ) {
            return this.noItemFound();
        }
        return (
            <View style={{
                flex : 1,
                // justifyContent: 'center',
                padding: 10,
                // backgroundColor: '#fff'
            }}>
            <View style={{flex: 1, flexDirection: direction, justifyContent:'space-around' }}>
            <Text style={[styles.row, { color:'#000',fontWeight :'bold'}]} >Ad Price : { (data.ad_type === '1' ) ? "1KWD" : "1.5KWD"} </Text>
            <Text style={[styles.row, { color:'#000',fontWeight :'bold'}]} >User Id:  {data.u_id} </Text>
            </View>
            <Image source={{uri :data.path }} style={{ height:100, width : width/2}}/>
            <Text style={[styles.row, { color:'#000',fontWeight :'bold'}]} > {data.expire_date} </Text>
            </View>
        );
    }

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
        // position :'absolute',
        padding : 10,
        backgroundColor : '#fbcdc5',
        marginLeft : 0,
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
