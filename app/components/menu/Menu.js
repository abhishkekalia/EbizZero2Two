import React, {Component, PropTypes} from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    // Button,
    AsyncStorage,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import * as authActions from '../../auth/auth.actions';
import { Actions } from 'react-native-router-flux';
import Zocial from 'react-native-vector-icons/Zocial';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';
import I18n from 'react-native-i18n'
import Share, {ShareSheet, Button} from 'react-native-share';
const { width, height } = Dimensions.get('window')

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            notificationCount : 0
        }
    }
    componentDidMount(){
        const {identity} = this.props;
        let formData = new FormData();
        formData.append('u_id', String(identity.u_id));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('getNotificationCount'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    notificationCount: responseData.data.count,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    SampleFunction=(newLang)=>{
        this.props.languageChange(newLang)
    }
    notificationShow = ()=> {
        this.props.closeDrawer()
        Actions.notificationShow();
    }
    myorder = ()=> {
        this.props.closeDrawer()
        Actions.myorder();
    }
    postad = ()=> {
        this.props.closeDrawer()
        Actions.postad();
    }
    render() {
        const {identity, logout, lang,u_id, closeDrawer} = this.props;
        return (
            <View style={{ flex: 1}}>
            <ScrollView scrollsToTop={false} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} bounces={false}>
                <View style={[styles.avatarContainer,{ alignSelf: 'center', justifyContent: 'space-around'}]}>
                    {
                        u_id == undefined ?
                        <View style={{ height: "85%", width: '80%',  flexDirection: 'row', justifyContent: 'space-around',alignItems: 'center'}}>
                            <TouchableOpacity onPress={Actions.registerPage} style={{alignSelf: 'center', borderRadius: 10, borderWidth :1, backgroundColor: '#a9d5d1', borderColor:"#fff"}} >
                                <Text style={styles.signinbtn}>{I18n.t('sidemenu.signup', { locale: lang })}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={Actions.profile} style={styles.username}>
                                <View style= {styles.guest}>
                                    <Zocial name='guest' color="#fff" size={15} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={Actions.loginPage} style={{alignSelf: 'center', borderRadius: 10, borderWidth :1, backgroundColor: '#a9d5d1', borderColor:"#fff"}} >
                                <Text style={styles.signinbtn}>{I18n.t('sidemenu.login', { locale: lang })}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{ height:  "90%", width: '80%',  flexDirection: 'row', justifyContent: 'space-around',alignItems: 'center'}}>
                            <TouchableOpacity
            						onPress={Actions.profile} style={styles.username}>
                                <View style= {styles.guest}>
                                    <Zocial name='guest' color="#000" size={15} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{ width: width, height:  "20%", justifyContent: 'space-around',flexDirection: (lang === 'ar') ? 'row' : 'row-reverse', zIndex: 0, position: 'relative'}}>
                        {
                            Object.keys(I18n.translations).map((item, key)=>(
                                <Text
                                    style={{ fontSize: 15, color: '#fff', alignSelf: 'flex-end'}}
                                    key={key}
                                    // {I18n.translations[item].id }
                                    onPress={ this.SampleFunction.bind(this, item) }>
                                    {I18n.translations[item].id }
                                </Text>
                            ))
                        }
                    </View>
                    <Text style={{
                            zIndex: 1,
                            position: 'relative' ,
                            marginBottom: 10,
                            paddingLeft : '0%', paddingTop : 0, color:"#fff", marginTop:0}}>{identity.username}</Text>
                </View>
                <View style={[styles.badge, styles.seprator, {flexDirection: (lang == 'ar') ? 'row-reverse' : 'row'}]}>
                    {
                        this.state.notificationCount > 0 ?
                        <IconBadge
                            MainElement={
                                <Ionicons
                                    name="ios-notifications"
                                    color="#a9d5d1" size={30}
                                    style={{ left : 5}}
                                    />
                            }
                            BadgeElement={
                                <Text style={{color:'#FFFFFF'}}>{this.state.notificationCount}</Text>
                            }
                            IconBadgeStyle={{
                                width:16,
                                height:18,
                                // left : 10,
                                backgroundColor: 'orange'
                            }}
                            />
                        :
                        <Ionicons
                            name="ios-notifications"
                            color="#a9d5d1" size={30}
                            style={{ left : 5}}
                            />
                    }
                    <Text onPress={this.notificationShow.bind(this)}
                        style={{
                            fontSize: 12,
                            padding: 10,
                            marginTop : 1,
                            left :5,
                        }}>	{I18n.t('sidemenu.notification', { locale: lang })}
                    </Text>
                </View>
                {/* in feedback it says to remove padding b/w notification and home*/}

                <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text
                    onPress={Actions.deals}
                    style={[styles.item, styles.seprator]}>{I18n.t('sidemenu.deals', { locale: lang })}</Text>
                    <View style={styles.starsix}>
                    <TriangleUp style={styles.starSixUp} />
                    <Text style={{position: 'absolute',textAlign: 'center',zIndex: 2, color: "#fff", fontSize: 8, alignSelf: 'center', backgroundColor:'transparent'}}>OFF</Text>
                    <TriangleDown style={styles.starSixDown} />
                    </View>
                </View>
                <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                <Text
                    onPress={Actions.homePage}
                    style={[styles.item, styles.seprator]}>{I18n.t('sidemenu.home', { locale: lang })}</Text>
                {
                    u_id == undefined ?
                    undefined
                    :
                    <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                }
                {
                    u_id == undefined ?
                    undefined
                    :
                    <Text
                        onPress={Actions.contactUs}
                        style={[styles.item, styles.seprator]}>{I18n.t('sidemenu.contact', { locale: lang })}</Text>
                }
                {
                    u_id == undefined ?
                    undefined
                    :
                    <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                }
                {
                    u_id == undefined ?
                    undefined
                    :
                    <Text
                        onPress={()=>this.myorder()}
                        style={[styles.item, styles.seprator]}>{I18n.t('sidemenu.order', { locale: lang })}</Text>
                }
                <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                <Text
                    onPress={()=>this.onOpen()}
                    style={[styles.item, styles.seprator]}> {I18n.t('sidemenu.share', { locale: lang })}</Text>
                <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                {/* in feedback it says to remove rate us
                    <Text
                    onPress={Actions.sync}
                    style={[styles.item, styles.seprator]}> {I18n.t('sidemenu.rateus', { locale: lang })}</Text>
                    */
                }

                    <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                        <Text
                            onPress={()=>this.postad()}
                            style={[styles.item, styles.seprator]}> {I18n.t('sidemenu.marketing', { locale: lang })}</Text>
                {
                    u_id == undefined ? <Text/>
                    :
                    <View style={{height:1,backgroundColor:'#dfdfdf',width:'60%'}}/>
                }
                    {
                        u_id == undefined ? <Text/>
                        :
                        <Text onPress={
                                ()=>{ Utils.logout()
                                    .then(logout)
                                    .done()
                                }
                            }
                            style={styles.item}> {I18n.t('sidemenu.logout', { locale: lang })}</Text>
                    }

            </ScrollView>
            {this.renderShareSheet()}
        </View>
        )
    }
    renderShareSheet() {
        let shareOptions = {
            title: "ZeroToTwo",
            message: "App Description",
            url: "https://www.google.com",
            subject: "Share Link" //  for email
        };
        return(
            <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                <Button iconSrc={{ uri: TWITTER_ICON }}
                    onPress={()=>{
                        this.onCancel();
                        setTimeout(() => {
                            Share.shareSingle(Object.assign(shareOptions, {
                                "social": "twitter"
                            }
                        ));
                    },300);}}>Twitter
                </Button>
                <Button iconSrc={{ uri: FACEBOOK_ICON }}
                    onPress={()=>{
                        this.onCancel();
                        setTimeout(() => {
                            Share.shareSingle(Object.assign(shareOptions, {
                                "social": "facebook"
                            }
                        ));
                    },300);}}>Facebook
                </Button>
                <Button iconSrc={{ uri: WHATSAPP_ICON }}
                    onPress={()=>{
                        this.onCancel();
                        setTimeout(() => {
                            Share.shareSingle(Object.assign(shareOptions, {
                                "social": "whatsapp"
                            }
                        ));
                    },300);}}>Whatsapp
                </Button>
                <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                    onPress={()=>{
                        this.onCancel();
                        setTimeout(() => {
                            Share.shareSingle(Object.assign(shareOptions, {
                                "social": "googleplus"
                            }
                        ));
                    },300);}}>Google +
                </Button>
            </ShareSheet>
        );
    }
    onOpen() {
        this.setState({
            visible:true,
        });
    }
    onCancel() {
        console.log("CANCEL")
        this.setState({visible:false});
    }
}
const TWITTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg==";

//  facebook icon
const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACzVBMVEUAAAAArQAArgAArwAAsAAAsAAAsAAAsAAAsAAAsAAAsAAAsAAArwAAtgAAgAAAsAAArwAAsAAAsAAAsAAAsAAAsgAArwAAsAAAsAAAsAAAsQAAsAAAswAAqgAArQAAsAAAsAAArwAArwAAsAAAsQAArgAAtgAAsQAAuAAAtAAArwAAsgAAsAAArAAA/wAAsQAAsAAAsAAAsAAAzAAArwAAsAAAswAAsAAAsAAArQAAqgAAsAAAsQAAsAAAsAAAsAAAqgAAsQAAsAAAsAAArwAAtAAAvwAAsAAAuwAAsQAAsAAAsAAAswAAqgAAswAAsQAAswAAsgAAsAAArgAAsAAAsAAAtwAAswAAsAAAuQAAvwAArwAAsQAAsQAAswAAuQAAsAAAsAAArgAAsAAArgAArAAAsAAArgAArgAAsAAAswAArwAAsAAAsQAArQAArwAArwAAsQAAsAAAsQAAsQAAqgAAsAAAsAAAsAAAtAAAsAAAsQAAsAAAsAAAsAAArgAAsAAAsQAAqgAAsAAAsQAAsAAAswAArwAAsgAAsgAAsgAApQAArQAAuAAAsAAArwAAugAArwAAtQAArwAAsAAArgAAsAAAsgAAqgAAsAAAsgAAsAAAzAAAsQAArwAAswAAsAAArwAArgAAtwAAsAAArwAAsAAArwAArwAArwAAqgAAsQAAsAAAsQAAnwAAsgAArgAAsgAArwAAsAAArwAArgAAtAAArwAArwAArQAAsAAArwAArwAArwAAsAAAsAAAtAAAsAAAswAAsgAAtAAArQAAtgAAsQAAsQAAsAAAswAAsQAAsQAAuAAAsAAArwAAmQAAsgAAsQAAsgAAsAAAsgAAsAAArwAAqgAArwAArwAAsgAAsQAAsQAArQAAtAAAsQAAsQAAsgAAswAAsQAAsgAAsQAArwAAsQAAsAAArQAAuQAAsAAAsQAArQCMtzPzAAAA73RSTlMAGV+dyen6/vbfvIhJBwJEoO//1oQhpfz98Or0eQZX5ve5dkckEw4XL1WM0LsuAX35pC0FVuQ5etFEDHg+dPufFTHZKjOnBNcPDce3Hg827H9q6yax5y5y7B0I0HyjhgvGfkjlFjTVTNSVgG9X3UvNMHmbj4weXlG+QfNl4ayiL+3BA+KrYaBDxLWBER8k4yAazBi28k/BKyrg2mQKl4YUipCYNdR92FBT2hhfPd8I1nVMys7AcSKfoyJqIxBGSh0shzLMepwjLsJUG1zhErmTBU+2RtvGsmYJQIDN69BREUuz65OCklJwpvhdFq5BHA9KmUcAAALeSURBVEjH7Zb5Q0xRFMdDNZZU861EyUxk7IRSDY0piSJLiSwJpUTM2MlS2bdERskSWbLva8qWNVv2new7f4Pz3sw09eq9GT8395dz7jnzeXc5554zFhbmYR41bNSqXcfSylpUt179BjYN/4u0tbMXwzAcHJ1MZ50aObNQ4yYurlrcpambics2k9DPpe7NW3i0lLVq3aZtOwZv38EUtmMnWtazcxeDpauXJdHe3UxgfYj19atslHenK/DuYRT2VwA9lVXMAYF08F5G2CBPoHdwNQ6PPoBlX0E2JBToF0JKcP8wjmvAQGCQIDwYCI8gqRziHDmU4xsGRA0XYEeMBEYx0Yqm6x3NccaMAcYKwOOA2DiS45kkiedmZQIwQSBTE4GJjJzEplUSN4qTgSn8MVYBakaZysLTuP7pwAxeeKYUYltGmcWwrnZc/2xgDi88FwjVvoxkQDSvij9Cgfm8sBewQKstJNivil/uAikvTLuN1mopqUCanOtftBgiXjgJWKJTl9Khl9lyI20lsPJyYIX+4lcSvYpN8tVr9P50BdbywhlSROlXW7eejm2fSQfdoEnUPe6NQBZ/nH2BbP1kUw6tvXnL1m0kNLnbGdMOII8/w3YCPuWTXbuZaEtEbMLsYTI+H9jLD+8D9svKZwfcDQX0IM0PAYfl/PCRo8CxCsc4fkLHnqRPup0CHIXe82l6VmcqvlGbs7FA8rkC0s8DqYVCcBFV3YTKprALFy8x8nI4cEWwkhRTJGXVegquAiqlIHwNuF6t44YD7f6mcNG+BZSQvJ3OSeo7dwFxiXDhDVAg516Q/32NuDTbYH3w8BEFW/LYSNWmCvLkqbbJSZ89V78gU9zLVypm/rrYWKtJ04X1DfsBUWT820ANawjPLTLWatTWbELavyt7/8G5Qn/++KnQeJP7DFH+l69l7CbU376rrH4oXHOySn/+MqW7/s77U6mHx/zNyAw2/8Myjxo4/gFbtKaSEfjiiQAAAABJRU5ErkJggg==";

//  gplus icon
const GOOGLE_PLUS_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACQ1BMVEUAAAD/RDP/STX9Sjb+STT+SjX+SjX+SjX+STT/SzP/Sjb/SzX/VVX/SDb+SDP+SjX9RzT9STT9SjT+STX+SjT9SjT/SST/TTP+SjX+SjX/RDP/RzP+SjX+SjX/STf9SDX/SjX/TU3+Sjb+SjX/Qyz/Szb+SjX/TTP+SjX9STX+SjP/TTX9Szb+Szb/YCD/SzX/SzX+Sjb+STX/TTX/SzX/Szb/TDT+SjX9SzX/STf+TDX/SjT9SzX9Szb+SjX/SjX/SzX/STT9SjT9TDT+SDT/VQD9STX/STX9SjX+SjX9STX+SzT/UDD9Sjb+SjX9RzT/QED+SjT+SjX/XS7+SjX/Ui7/RC3+SjX/TTz/RzP+SjX/TTP/STf+SjX/STT/RjP+Sjb/SzX/Szz/Rjr/RzL+RzP+SjX/Szf/SjX9Sjb+SjX+Sjb+SjX+SjX+SjX/STf/SjT/SjT9SjX9SzT+RzT+STT/STT+SjX/STP/Tjf+SjX/Szb/SjX/STX9SjX/SjT/AAD/SjH/STb+SzX+Sjb+SjT9SDT+Sjb+SjX9STf9STT/SDX/TDf+STb/TjT/TjH+SjX+SDT/Sjb9SzX9RzX+TDT/TUD/STX+SjX+STX/VTn/QjH/SjX+SjX/Ri7+Szb/TTP+SjX/SDX/STT9SjX+SjX/SDL/TjT9Sjb/RjL+SjX9SzX/QED/TDT+SjX+SjX9STX/RjX/VSv/Rzb/STX/ORz/UDD9SzX+Sjb/STT9SzP+SzX+SjX+SjX9Szb/Ti//ZjPPn7DtAAAAwXRSTlMAD1uiy+j5/8FBZHQDY9zvnYSc5dGhBwr+1S0Zqu44mz4KtNkXY7Yo8YLcfp3bCGZ+sLhWaks2z4wO6VOklrtWRFSXos4DoD+D/ZnoEKasjwS7+gvfHC3kHmjtMlTXYjfZXBEWa+/nQRiK5u7c8vVGRWepp6+5eulQF/dfSHSQdQEfdrzguZzm+4KSQyW1JxrAvCaCiLYUc8nGCR9h6gvzFM41MZHhYDGYTMejCEDi3osdBj1+CSCWyGyp1PC3hUEF/yhErwAAAjFJREFUSMft1tdfE0EQB/ADJD+JKAomHoqKxhJLFCnSpdgIxobYgqhYaJKIHVQUsSFiBSuCvWPv3T/N2ZPD3EucvVcyL3sz2W8+l73ZvShKKEIxcCIsPGJQpAV9MThK1KzAEAaNHjosZviI2DgBR9psVrvCx6Ni1fjRNI5JIDx2nF5m4ejxsCRqVxMmknZMksGTVUzpu5zqJD1NAodNB2boyUzCrlnK7CSKOUCyGJOC4BSan6onaWLN5irpCIwgOAMBt5eZRVk2H+fQx7n92TzK8pT8AopCwCbGgiB4Pk1fsFDPFlG2mL9gRTTdnahnxcASDx/nq6SX6tkyYLnEo1qxknBJ2t9kVSlcq2WaZM1a0qXrtOv18Jbp9Q3l5Rv/39ubHKQ3V2xRtm7bXlkluyGra2qJ76jzwb/TxH721O9K3U1fsMfsgbCXcLFZvI+wL8ok3i/6+ECDOdxYJ/TBQ9Kw+nDTkRyHtodKjjbLyGMtx304cTKi8NRpoVutfJp5xgtv21ntxGw/J7T3PNdeuAhcuqxn9o5W0p1Ma78CpF/9lzdfI3ydiStobrjhIL4BRN7k4WRa3i5D5RbQ3cPDMcDtO4ZKGXCXedtuQL1nqNwHHjDxQ/rNGYbKI/gfM/ETwv6ngafSM3RwH3O7eK86Wzz9L582PO9lN9iLl6KpXr2uf9P7tvHde4e75oNEZ3/85NQ2hKUyzg/1c57klur68vXbd9XtdP34+et36C9WKAZo/AEHHmXeIIIUCQAAAABJRU5ErkJggg==";

class TriangleUp extends Component{
    render() {
        return (
            <View style={[styles.triangle, this.props.style]} />
        )
    }
}
class TriangleDown extends Component{
    render() {
        return (
            <TriangleUp style={styles.triangleDown}/>
        )
    }
}
const styles = StyleSheet.create({
    linearGradient: {
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        width:'80%'
      },
      contentContainer: {
        // flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    seprator : {
        // borderBottomColor : "grey",
        // borderBottomWidth : 0.5
    },
    badge : {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'rgba(248,248,248,1)',
        display:'flex',
        width:'100%',
        borderBottomColor:'rgba(241,241,241,1)'
    },

    menu: {
        flex: 1,
        width: width - 30,
        height:height,
        backgroundColor: "grey",
        position : 'absolute'
    },

    avatarContainer: {
        width: width,
        height : 120,
        backgroundColor : '#f08080',
        justifyContent: 'center',
        flexDirection:'column',
        alignItems:'center'
    },
    signinbtn:{
        padding:5,
        marginLeft: 10,
        marginRight: 10,
        height : 30,
        color: 'white',
    },
    avatar: {
        width :60,
        height : 60,
        borderRadius: 30,
        flex: 1,
    },

    username: {
        // flex : 1,
        // left : width/2.5,
        // top :20,
        // position: 'relative',
        backgroundColor : '#fff',
        width : 55,
        height : 55,
        borderRadius : 50,
        // padding :2.5,
        // zIndex:9999,
        overflow:'hidden',
        alignItems:'center',
        justifyContent:'center'
    },
    guest : {
        backgroundColor : '#a9d5d1',
        width : 50,
        height : 50,
        borderRadius : 50,
        // padding : 15,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },

    item: {
        fontSize: 12,
        backgroundColor : '#fff',
        padding: 10,
        marginTop : 1,
        // borderBottomColor:'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(223,223,223,1) 50%, rgba(255,255,255,1) 100%)',
        // borderBottomColor:'red',
        // borderBottomWidth:5
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#a9d5d1'
    },
    triangleDown: {
        transform: [{
            rotate: '180deg'
        }]
    },
    starsix: {
    // width: 100,
    // height: 100
  },
  starSixUp: {
    position: 'absolute',
    // zIndex: 1
    top: -7,
    // left: 0
  },
  starSixDown: {
    position: 'absolute',
    top: 25,
    left: 0
  }
});
export default Menu;
