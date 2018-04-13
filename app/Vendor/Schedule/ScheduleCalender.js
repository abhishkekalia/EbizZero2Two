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
import {Actions as routes} from "react-native-router-flux";

const { width, height } = Dimensions.get('window');

class ScheduleCalender extends Component {
	constructor(props) {
    	super(props);
    	this.state={
			currDate:"",
			status : false,
			dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
			ScheduleDate: ['2018-03-23','2018-03-26'],
			selected : [],
		    addressVisible: false,
    	};
		this.onDayPress = this.onDayPress.bind(this);
	}
    componentDidMount(){
		this.getCalenderData()
		.done();
    }
	async getCalenderData(){
		try {
			const {u_id} = this.props;
			var dt = new Date();
			var year = dt.getFullYear();
			var month = dt.getMonth() + 1;
			var date = dt.getDate();
			var dtString = year;
			dtString = dtString + '-' + (month > 9 ? month : '0'+month );
			dtString = dtString + '-' + date;

			let formData = new FormData();
			formData.append('vendor_id', String(u_id));
			formData.append('year', String(year));
			formData.append('month', String(month));
			const config = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data;',
				},
				body: formData,
			}
			fetch(Utils.gurl('scheduleCalendar'), config)
			.then((response) => response.json())
			.then((responseData) => {
				if(responseData.status){
					let	data = responseData.data;
					var arrNew = {};
					for (i=0;i<data.length;i++) {
						var obj = { selected: true, selectedColor: '#a9d5d1'};
						let strDate = data[i]
						var objFinal = {
							strDate : obj,
						};
						arrNew[strDate] = obj
					}
					this.setState ({
						ScheduleDate: arrNew,
						status: responseData.status
					})
				}else{
					this.setState ({
						status: true
					})
				}
			})
			.catch((errorMessage, statusCode) => {
				console.log(errorMessage);
			})
			.done();
		}
		catch (error) {
			console.log("Error retrieving data" + error);
		}
	}
	onDayPress(day) {
		this.setState({
			selected: day.dateString
		});
		this.getSchedulelist(day)
		.done()
	}
	async getSchedulelist(day){
		let selected_date = day.year +'-'+ day.month +'-'+ day.day,
		date = selected_date.toString();
		const {u_id} = this.props;
		try {
			let formData = new FormData();
			formData.append('vendor_id', String(u_id));
			formData.append('selected_date', String(date));
			const config = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data;',
				},
				body: formData,
			}
			console.log("Request:=",config)
			fetch(Utils.gurl('getSchedulelist'), config)
			.then((response) => response.json())
			.then((responseData) => {
				console.log("Response getSchedulelist:=",responseData.data.anUserBookedSlot);
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.data.anUserBookedSlot),
				})
			})
			.catch((errorMessage, statusCode) => {
				console.log(errorMessage);
			})
			.done();
		}
		catch (error) {
			console.log("Error retrieving data" + error);
		}
	}
	render(){
		const { ScheduleDate, status, selected} = this.state;
		if(!status) {
			return (
				<ActivityIndicator
					style={[styles.centering]}
					color="#a9d5d1"
					size="large"/>
			);
		}
		let listView = (<View></View>);
			listView = (
				<ListView
				contentContainerStyle={styles.container}
				dataSource={this.state.dataSource}
				renderRow={this.renderData.bind(this)}
				enableEmptySections={true}
				automaticallyAdjustContentInsets={false}
				showsVerticalScrollIndicator={false}
				/>
			);
		return (
			<View style={styles.container}>
				<Calendar
					markedDates={ScheduleDate}
					current={[this.state.currDate]}
					onDayPress={this.onDayPress}
					monthFormat={'MMMM yyyy'}
					firstDay={1}
					hideDayNames={false}
					theme={{
						calendarBackground: '#f9f9f9',
						textSectionTitleColor: 'green',
						todayTextColor: 'green',
						selectedDayTextColor: 'white',
						monthTextColor: 'white',
						selectedDayBackgroundColor: 'green',
						arrowColor: 'white',
						monthTextColor: 'green',
						textDisabledColor: 'red',
					}}
					/>
				<View style={{flex: 1}}>
					{listView}
				</View>
			</View>
		)
	}
	renderData( data, rowData: string, sectionID: number, rowID: number, index) {
		const { lang} = this.props;
		let direction = (lang === 'ar') ? 'row-reverse' :'row',
		align = (lang === 'ar') ?  'right': 'left';
		return (
			<View>
				<TouchableOpacity style={{ flexDirection: direction, marginTop : 1, borderColor: "#a9d5d1", borderWidth: StyleSheet.hairlineWidth}} key={rowID} data={rowData} onPress={this.moveToDetail.bind(this,data)}>
					<View style={{
						width:'100%',
						borderWidth:1,
						borderColor:'gray',
						marginTop:5,
					}}>
						<View style={{
							flexDirection:direction,
							margin:5,
						}}>
							<Text style={{
								fontWeight  : 'bold'
							}}>Service Name</Text>
							<Text style={{
								fontWeight  : 'bold'
							}}> : </Text>
							<Text>{data.service_name}</Text>
						</View>
						<View style={{
							flexDirection:direction,
							margin:5,
						}}>
							<Text style={{
								fontWeight  : 'bold'
							}}>Date</Text>
							<Text style={{
								fontWeight  : 'bold'
							}}> : </Text>
							<Text>{data.service_datetime}</Text>
						</View>
						<View style={{
							flexDirection:direction,
							margin:5,
						}}>
							<Text style={{
								fontWeight  : 'bold'
							}}>Name</Text>
							<Text> : </Text>
							<Text>{data.addressArray[0].full_name}</Text>
						</View>
					</View>
					
					{/* <View style={{ width: "70%", height: 40, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={[styles.textQue, { textAlign: align}]}>{data.addressArray[0].full_name}</Text>
					</View>
					<View style={{ flexDirection: 'column', width: "30%", height: 40, borderLeftWidth: StyleSheet.hairlineWidth, borderColor: "#a9d5d1" , justifyContent: 'center', alignItems: 'center'}}>
						<Text style={[styles.textQue, { textAlign: align}]}>{data.service_name}</Text>
						<Text style={[styles.textQue, { textAlign: align}]}>{data.service_datetime}</Text>
					</View> */}
				</TouchableOpacity>
			</View>
		)
	}

	moveToDetail (data) {
		console.log("data:=",data)
		routes.scheduleDetail({
			scheduleDtl:data
		})
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
export default connect(mapStateToProps)(ScheduleCalender);
