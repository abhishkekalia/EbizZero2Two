import React, {Component, PropTypes} from "react";
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput } from "react-native";
import { Actions} from "react-native-router-flux";
import Feather from 'react-native-vector-icons/Feather';
import I18n from 'react-native-i18n'
import {connect} from "react-redux";
import Entypo from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

class ScheduleCalender extends Component {
	constructor(props) {
        super(props);
		    this.getKey()
	        .then(()=> {
				let markedDt = this.getCalenderData().then((data) => {
					console.warn("in then",data);
				});
				console.warn(markedDt);
			});


        this.state={
            u_id:0,
            country:"",
			currDate:""
        };
    }
    // componentDidMount(){
    //
    //     this.getKey()
    //     .then( ()=> this.getCalenderData())
    //
    // }
    getCalenderData(){
        const {u_id} = this.state;
        var dt = new Date();
        var year = dt.getFullYear();
        var month = dt.getMonth() + 1;
		var date = dt.getDate();
		// var dtString = year+'-'month+'-'+date;
		var dtString = year;
		dtString = dtString + '-' + (month > 9 ? month : '0'+month );
		dtString = dtString + '-' + date;

		// this.setState({
		// 	currDate:dtString
		// });

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
        return fetch(Utils.gurl('scheduleCalendar'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){

				// this.setState({
				// 	markedDates:responseData.data.toString()
				// });
				// console.warn(responseData.data);
				return responseData.data;

            }
            else{
                return null;
            }
        })
        .catch((errorMessage, statusCode) => {
            console.log(errorMessage);
			return null;
        })
        .done();
    }
    async getKey() {
        try {
            const value = await AsyncStorage.getItem('data');
            var response = JSON.parse(value);
            this.setState({
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <Calendar

                markedDates={{
                    '2018-03-23': {selected: true, marked: true, selectedColor: 'green'},
                    '2018-03-26': {marked: true},
                    '2018-03-29': {marked: true, dotColor: 'red', activeOpacity: 0},
                    '2018-03-13': {disabled: true, disableTouchEvent: true}
                 }}
				// markedDates={{[this.state.markedDates]: {selected:true,marked: true, dotColor: 'red', selectedColor: 'green'}}}
                //          Initially visible month. Default = Date()
                current={[this.state.currDate]}

                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {console.log('selected day', day)}}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMMM yyyy'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined


                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={false}
				// theme={{
				//    	calendarBackground: '#f9f9f9',
				//    	textSectionTitleColor: 'green',
				//    	todayTextColor: 'green',
				//    	selectedDayTextColor: 'white',
				//    	monthTextColor: 'white',
				//    	selectedDayBackgroundColor: 'green',
				//    	arrowColor: 'white',
				// 	monthTextColor: 'green',
	   			// 	// textDisabledColor: 'red',
                //
   				// 	}}
                />
            </View>

        )
    }
}
const styles = StyleSheet.create({
	container: {
		flex: 1

	}
});
function mapStateToProps(state) {
	return {
		identity: state.identity,
		lang : state.auth.lang
	}
}

export default connect(mapStateToProps)(ScheduleCalender);
