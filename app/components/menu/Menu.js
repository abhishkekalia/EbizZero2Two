import React, {Component, PropTypes} from 'react';
import { 
    Dimensions, 
    StyleSheet, 
    ScrollView, 
    View, 
    Image, 
    Text,
    ViewPropTypes,
    Button,
    AsyncStorage,
    TouchableHighlight
} from 'react-native';
import * as authActions from '../../auth/auth.actions';
import { Actions } from 'react-native-router-flux';
import Zocial from 'react-native-vector-icons/Zocial';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import Utils from 'app/common/Utils';

const { width, height } = Dimensions.get('window')

class Menu extends React.Component { 
       render() { 
        const {identity, logout} = this.props;
        return ( 
            <ScrollView scrollsToTop={false} contentContainerStyle={styles.contentContainer}> 
                <View style={styles.avatarContainer}> 
                    <View style={styles.username}>
                    <Text style= {styles.guest}>
                    <Zocial name='guest' color="#fff" size={15} />
                    </Text>
                    </View>
                    <Text style={{ position: 'absolute' , paddingLeft : width/3, paddingTop : 75, color:"#fff"}}>{identity.username}</Text>
                </View>
                
                <View style={[styles.badge, styles.seprator]}> 
                    <IconBadge
                        MainElement={ 
                            <Ionicons 
                            name="ios-notifications" 
                            color="#87cefa" size={30}
                            style={{ left : 13}}
                            />
                        }
                        BadgeElement={
                          <Text style={{color:'#FFFFFF'}}>1</Text>
                        }
                        IconBadgeStyle={{
                            width:16,
                            height:18,
                            // left : 10,
                            backgroundColor: 'orange'}}
                    />
                    <Text 
                    onPress={Actions.notificationShow}

                     style={{
                        fontSize: 12, 
                        padding: 10, 
                        marginTop : 1,
                        left :5,
                    }}>Notification</Text>
               </View>

                <Text
                onPress={Actions.homePage}
                style={[styles.item, styles.seprator]}>Home</Text>

                <Text
                onPress={Actions.contactUs}
                style={[styles.item, styles.seprator]}>Contact Us</Text>


                <Text
                onPress={Actions.myorder}
                style={[styles.item, styles.seprator]}>My Order</Text>

                <Text
                onPress={Actions.postad}
                style={[styles.item, styles.seprator]}>Post Advertisement</Text>

                <Text
                onPress={Actions.sync}
                style={[styles.item, styles.seprator]}> Rate us on App Store</Text>    
                <Text
                onPress={Actions.marketing}
                style={[styles.item, styles.seprator]}> Marketing</Text>
                <Text
                onPress={()=>( Utils.persistremove()),logout}
                style={styles.item}> logout</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
      contentContainer: { 
        flex: 1, 
        backgroundColor: '#fff', 
        alignItems: 'center',

    },
    seprator : {
        borderBottomColor : "grey",
        borderBottomWidth : 0.5
    },

    badge : { 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center'
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
        height : 100,
        backgroundColor : '#f08080',
    },
    
    avatar: {
        width :60,
        height : 60,
        borderRadius: 30,
        flex: 1,
    },

    username: {
        flex : 1,
        left : width/2.5,
        top :20,
        position: 'absolute',
        backgroundColor : '#fff',
        width : 55,
        height : 55,
        borderRadius : 50,
        padding :2.5
    },
    guest : {
        backgroundColor : '#87cefa',
        fontSize : 15,
        width : 50,
        height : 50,
        borderRadius : 50,
        padding : 15
    },
    
    item: {
        fontSize: 12,
        backgroundColor : '#fff',
        padding: 10,
        marginTop : 1,
    },
});
export default Menu;