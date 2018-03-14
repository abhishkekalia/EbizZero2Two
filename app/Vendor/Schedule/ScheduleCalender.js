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
	Dimensions
} from "react-native";
import I18n from 'react-native-i18n'
import {connect} from "react-redux";
import Entypo from 'react-native-vector-icons/FontAwesome';
import Utils from 'app/common/Utils';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
const { width, height } = Dimensions.get('window');

class ScheduleCalender extends Component {
	constructor(props) {
    	super(props);
    	this.state={
			currDate:"",
			status : false,
			dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
			ScheduleDate: ['2018-03-23','2018-03-26'],
			selected : []
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
					let datesArray = {
						data : {selected: true,  marked: true},
			 			// '2018-03-22': {selected: true,},
						// '2017-12-28': {selected: true,},
					}
					const selectedDate = new Date().toISOString().substring(0, 10)
					Object.keys(datesArray).map((d, i) => {
						if (datesArray[d].disabled === false) {
							delete datesArray[d]
						} else if (selectedDate !== new Date(datesArray[i])) {
							datesArray[selectedDate] = {selected: true, marked: true, selectedColor: 'green'}
						}
					})
					console.log('dates array: ', datesArray)
					this.setState ({
						ScheduleDate: datesArray,
						status: responseData.status
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
			formData.append('vendor_id', String(7));
			formData.append('selected_date', String("2017-11-13"));
			// console.warn(formData);
			const config = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data;',
				},
				body: formData,
			}
			fetch(Utils.gurl('getSchedulelist'), config)
			.then((response) => response.json())
			.then((responseData) => {
				console.log(responseData.data.vendorBookedSlot);
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.data.vendorBookedSlot),
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
					// markedDates={{
					// 	[ScheduleDate]: {selected: true, marked: true, selectedColor: 'green'},
					// 	'2018-03-26':  {selected: true, marked: true, selectedColor: 'green'},
					// 	'2018-03-29': {selected: true, marked: true, selectedColor: 'green'},
					// 	'2018-03-13':  {selected: true, marked: true, selectedColor: 'green'}
					// }}
					// markedDates={{[this.state.markedDates]: {selected:true,marked: true, dotColor: 'red', selectedColor: 'green'}}}
					// Initially visible month. Default = Date()
					// onDayPress={this.onDayPress}
					// style={styles.calendar}
					// hideExtraDays
					// showWeekNumbers
					// markedDates={ScheduleDate}
					/>
				<View style={{flex: 1}}>
					{listView}
				</View>
			</View>
		)
	}
	renderData( data, rowData: string, sectionID: number, rowID: number, index) {
		return (
			<TouchableOpacity key={rowID} data={rowData} onPress={() => navigate('Detail', { feed: que_ans.feed, detail : que_ans.detail , source : que_ans.source, time : que_ans.time  })}>
            <View style={styles.row}>
				<Text style={styles.textQue}>{data.schedule_id}</Text>
				<Text style={styles.textQue}>{data.name}</Text>
				<Text style={styles.textQue}>{data.boking_time}</Text>
				<Text style={styles.textQue}>{data.duration}</Text>
				<Text style={styles.textQue}>{data.date}</Text>
				<Text style={styles.textQue}>{data.create_time}</Text>
				<Text style={styles.textQue}>{data.vendor_id}</Text>
				<Text style={styles.textQue}>{data.is_user}</Text>
            </View>
		</TouchableOpacity>

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
	row: {
		flexDirection: 'row',
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
		flex: 1,
		fontSize: 18,
		fontWeight: '400',
		left : 5
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
