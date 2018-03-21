import React, {Component, PropTypes} from "react";
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage ,NetInfo} from "react-native";
import { Actions} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import PercentageCircle from 'react-native-percentage-circle';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import I18n from 'react-native-i18n';

import Marketing from '../../Vendor/marketing'
class Profile extends Component {
	constructor(props) {
        super(props);
        this.getKey = this.getKey.bind(this);
        this.state={
        	dataSource: [],
        	status : false,
            u_id: null,
            address : [],
            country : null,
            email : null,
            phone_no : null,
            data : [],
            marketing_campaign : [],
						chart : []
        };
    }
    componentwillMount(){
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ netStatus: isConnected }); }
            );

        NetInfo.isConnected.fetch().done((isConnected) => {
            if (isConnected)
            {
            	console.warn('hello')
            }else{
                console.log(`is connected: ${this.state.netStatus}`);
            }
        });
    }
    componentDidMount(){
    	this.getKey()
	    .then(()=>this.getAddress())
	    .done()

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                netStatus: isConnected
            });
        });
    }

    handleConnectionChange = (isConnected) => {
        this.setState({ netStatus: isConnected });
        {this.state.netStatus ?  MessageBarManager.showAlert({
                message: `Internet connection is available`,
                alertType: 'alert',
                title:''
            }) : MessageBarManager.showAlert({
                message: `Internet connection not available`,
                alertType: 'error',
                title:''
            })
        }
    }
    async getKey() {
        try {
            const value = await AsyncStorage.getItem('data');
            var response = JSON.parse(value);

            this.setState({
                u_id: response.userdetail.u_id ,
                email: response.userdetail.email,
                phone_no: response.userdetail.phone_no,
                country: response.userdetail.country
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    getAddress(){
    	const { u_id, country } = this.state;
    	let formData = new FormData();
    	formData.append('u_id', String(u_id));
    	formData.append('country', String(country));
    		const config = {
               	method: 'POST',
               	headers: {
               		'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;'
                },
            	body: formData,
            }
        fetch(Utils.gurl('MyProfile'), config)
        .then((response) => response.json())
        .then((responseData) => {
			console.log("responseData:=",responseData);
        	if(responseData.response.status){
        	    this.setState({
        	       	status : responseData.response.status,
        	       	dataSource : responseData.response.data,
        	       	address : responseData.response.address,
                    data : responseData.response.feature_product,
                    marketing_campaign : responseData.response.marketing_campaign,
										chart : responseData.response.chart
        	        });
        	}else{
        	    this.setState({
        	       	status : responseData.response.status
        	    })
        	}
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }

	render() {
		const {identity, logout, lang} = this.props,
		{data, u_id, address, dataSource, chart} = this.state,
		direction = lang == 'ar'? 'row-reverse': 'row',
		align = lang == 'ar'? 'flex-end': 'flex-start',
		textline = lang == 'ar'? 'right': 'left';

		return (
			<View style={{flex: 1, flexDirection: 'column'}} testID="Profile">
				<View style={{flexDirection: direction, justifyContent: 'space-around', marginTop: 5,marginBottom: 5}}>
					<View style={{flexDirection: 'column',}}>
						<PercentageCircle radius={35} percent={chart.total_sales} color={"#fbcdc5"} borderWidth={10}></PercentageCircle>
						<Text style={styles.chart }>{I18n.t('venderprofile.totalsales', { locale: lang })}</Text>
					</View>
					<View style={{flexDirection: 'column',}}>
						<PercentageCircle radius={35} percent={chart.monthly_total_sales} color={"#a9d5d1"} borderWidth={10}></PercentageCircle>
						<Text style={styles.chart }>{I18n.t('venderprofile.monthlysales', { locale: lang })}</Text>
					</View>
					<View style={{flexDirection: 'column',}}>
						<PercentageCircle radius={35} percent={chart.feature_product_sales} color={"#FFCC7D"}  borderWidth={10}></PercentageCircle>
						<Text style={styles.chart}>{I18n.t('venderprofile.fearuresales', { locale: lang })}</Text>
					</View>
				</View>
				<View style={[styles.content, {flexDirection : direction, justifyContent: 'space-between' ,padding : 0}]}>
					<View style={{ flexDirection : direction, }}>
						<View style={{ width :60, height:60, justifyContent: 'center', alignItems : 'center'}}>
							<Entypo
							name="user"
							size={25}
							style={{
								padding :5,
								width: 35,
								height :35,
								backgroundColor : '#ccc',
								alignItems : align,
								borderRadius : 17 ,
							}}/>
						</View>

						<View style={{flexDirection : 'column'}}>
                            <Text style={[styles.label, { color : '#696969', textAlign: textline}]}>{dataSource.fullname}</Text>
                            <Text style={[styles.label, { color : '#a9d5d1', textAlign: textline}]}>Product Manager</Text>
                            <View style={{flexDirection:direction}}>
								<Text style={[styles.label, { color : '#fbcdc5', textAlign: textline}]}> {I18n.t('venderprofile.email', { locale: lang })}</Text>
									<Text style={[styles.label, { color : '#fbcdc5', textAlign: textline}]}> :</Text>
                            <Text style={[styles.label, { color : '#696969', textAlign: textline}]}>{this.state.email}</Text>
							</View>
                            <View style={{flexDirection:direction}}>
								<Text style={[styles.label, { color : '#fbcdc5'}]}> {I18n.t('venderprofile.phone', { locale: lang })} </Text>
								<Text style={[styles.label, { color : '#fbcdc5'}]}>: </Text>
                            <Text style={[styles.label, { color : '#a9d5d1'}]}>{dataSource.mobile}</Text>
                            </View>
						</View>
					</View>
				</View>
				<Text style={{textAlign: textline, alignSelf: 'center'}}>{I18n.t('venderprofile.marketing', { locale: lang })}</Text>
				<Marketing data={this.state.data} status={this.state.status} marketing_campaign={this.state.marketing_campaign} lang={lang}/>
				<TouchableOpacity
                onPress={()=>( Utils.logout()),logout}
                style={styles.logout}>
					<Text style={{ color: "#fbcdc5"}}>{I18n.t('venderprofile.logout', { locale: lang })}</Text>
				</TouchableOpacity>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
	},
	content: {
		borderWidth : 1,
		borderColor :'#ccc',
	},
	logout : {
		backgroundColor : '#fff',
		padding : 10,
		flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth :StyleSheet.hairlineWidth,
        borderColor : '#ccc'
	},
	label: {
		fontSize: 12,
		fontStyle: 'italic'
	},
	chart : {
		fontSize:  12
	}
});
export default Profile;
