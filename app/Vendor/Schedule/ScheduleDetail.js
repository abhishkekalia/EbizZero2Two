import React, {Component, PropTypes} from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	AsyncStorage,
	TextInput ,
	ActivityIndicator,
	ListView,
	Dimensions,
	Modal
} from "react-native";
import I18n from 'react-native-i18n'
import {connect} from "react-redux";
import Entypo from 'react-native-vector-icons/FontAwesome';
import Utils from 'app/common/Utils';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
const { width, height } = Dimensions.get('window');
class ScheduleDetail extends Component {
	constructor(props) {
		super(props);
		console.log("this.props.scheduleDtl:=",this.props.scheduleDtl)
    	this.state={
			scheduleDtl:this.props.scheduleDtl
    	};
	}

    componentDidMount(){
	}

	render(){
		const { lang} = this.props;
		let direction = (lang === 'ar') ? 'row-reverse' :'row';
		align = (lang === 'ar') ?  'right': 'left';

		const { ScheduleDate, status, selected} = this.state;
		// if(!status) {
		// 	return (
		// 		<ActivityIndicator
		// 			style={[styles.centering]}
		// 			color="#a9d5d1"
		// 			size="large"/>
		// 	);
		// }

		var addressText = ''
		if (this.state.scheduleDtl.addressArray[0].houseno.length > 0) {
			addressText = this.state.scheduleDtl.addressArray[0].houseno
		}

		if (this.state.scheduleDtl.addressArray[0].floor.length > 0) {
			if (addressText != '') {
				addressText = addressText + ", " + this.state.scheduleDtl.addressArray[0].floor
			}
			else {
				addressText = this.state.scheduleDtl.addressArray[0].floor
			}
		}

		if (this.state.scheduleDtl.addressArray[0].appartment.length > 0) {
			if (addressText != '') {
				addressText = addressText + ", " + this.state.scheduleDtl.addressArray[0].appartment
			}
			else {
				addressText = this.state.scheduleDtl.addressArray[0].appartment
			}
		}

		if (this.state.scheduleDtl.addressArray[0].city.length > 0) {
			if (addressText != '') {
				addressText = addressText + ", " + this.state.scheduleDtl.addressArray[0].city
			}
			else {
				addressText = this.state.scheduleDtl.addressArray[0].city
			}
		}

		if (this.state.scheduleDtl.addressArray[0].street.length > 0) {
			if (addressText != '') {
				addressText = addressText + ", " + this.state.scheduleDtl.addressArray[0].street
			}
			else {
				addressText = this.state.scheduleDtl.addressArray[0].street
			}
		}

		return (
			<View style={styles.container}>
				<View style={{
						flex: 1,
						margin:10,
					}}>

					<View style={{
						flexDirection:direction
					}}>
						<Text style={{
							fontWeight:'bold',
						}}>{I18n.t('scheduleDetail.name', { locale: lang })}</Text>

						<Text> : </Text>
						<Text>{this.state.scheduleDtl.addressArray[0].full_name}</Text>
					</View>

					<Text style={{
						fontWeight:'bold',
						textAlign:align,
						marginTop:5,
					}}>{I18n.t('scheduleDetail.address', { locale: lang })} :</Text>
					{/* <Text> : </Text> */}

					<Text style={{
						marginTop:5,
						textAlign:align
					}}>{addressText}</Text>

					<View style={{
						height:1,
						width:'100%',
						backgroundColor:'gray',
						marginTop:5,
					}}></View>

					<View style={{
						flexDirection:direction,
						marginTop:20,
					}}>
						<Text style={{
							fontWeight:'bold'
						}} >{I18n.t('scheduleDetail.order', { locale: lang })}</Text>
						<Text> : </Text>
						<Text>{this.state.scheduleDtl.bookservice_id}</Text>
					</View>

					<View style={{
						flexDirection:direction,
						marginTop:5
					}}>
						<Text style={{
							fontWeight:'bold'
						}} >{I18n.t('scheduleDetail.date', { locale: lang })}</Text>
						<Text> : </Text>
						<Text>{this.state.scheduleDtl.service_datetime}</Text>
					</View>

					<View style={{
						height:1,
						width:'100%',
						backgroundColor:'gray',
						marginTop:5,
					}}></View>

					<View style={{
						marginTop:20,
						flexDirection:direction,
					}}>
						<Text style={{
							fontWeight:'bold'
						}} >{I18n.t('scheduleDetail.serviceName', { locale: lang })}</Text>
						<Text> : </Text>
						<Text>{ lang == 'ar' ? this.state.scheduleDtl.service_name_in_arabic : this.state.scheduleDtl.service_name}</Text>
					</View>

					<View style={{
						marginTop:5,
						flexDirection:direction,
					}}>
						<Text style={{
							fontWeight:'bold'
						}} >{I18n.t('scheduleDetail.serviceType', { locale: lang })}</Text>
						<Text> : </Text>
						<Text>{this.state.scheduleDtl.service_type}</Text>
					</View>

					<View style={{
						height:1,
						width:'100%',
						backgroundColor:'gray',
						marginTop:5,
					}}></View>
				</View>
			</View>
		)
	}

}
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	calendar: {
		borderTopWidth: 1,
		paddingTop: 5,
		borderBottomWidth: 1,
		borderColor: '#eee',
		height: 350
	},
	row: {		flexDirection: 'row',
		marginTop : 1
	},
	qtybutton: {
		paddingLeft: 10,
		paddingRight: 10,

		alignItems: 'center',
		borderWidth : 1,
		borderColor : "#ccc",
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
		countryIcon: {
		width : 40,
		height:40,
		padding :10
	},
	wishbutton :{
		alignItems : 'center',
		width : width/2-10,
		borderWidth : 0.5,
		borderColor : "#ccc",
		padding : 5
	},
	thumb: {
	  resizeMode: 'center',
		width   : '20%',
		height  :'50%' ,
		marginLeft : 10
	},
	textQue :{
		fontSize: 10,
		fontWeight: '400',
	},
	centering: {
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	bottom : {
		borderBottomLeftRadius : 10,
		borderBottomRightRadius : 10,
		justifyContent : 'space-around',
		backgroundColor : "#fff"
	},
	headline: {
		paddingTop : 10,
		paddingBottom : 10,
		marginLeft : 15,
		fontSize    : 15,
		color       : "#000",
		fontWeight  : 'bold'
	},
	detail: {
		padding : 10,
		backgroundColor : '#fff',
		minHeight : 500,
		fontWeight : 'bold'
	}
});
function mapStateToProps(state) {
	return {
		u_id: state.identity.u_id,
		lang : state.auth.lang
	}
}
export default connect(mapStateToProps)(ScheduleDetail);
