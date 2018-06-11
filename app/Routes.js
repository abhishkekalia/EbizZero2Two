import React from "react";
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox,
} from "react-native-router-flux";
import I18n from 'react-native-i18n';
import { Text, View, StyleSheet, Easing ,Platform} from 'react-native';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import MessageBar from './common/MessageBar';
import {connect} from "react-redux";
import Register from "./Signup/register";
import Vendorreg from "./Signup/Vendor";
import HomePage from "./dashboard/DashboardPage";
import LoginPage from "./auth/LoginPage";
import ProfilePage from "./profile/ProfilePage";
import {Loader} from "./common/components";
import Menu from './components/menu/MenuContainer';
import Ionicons from 'react-native-vector-icons/Feather';
import wishList from './components/wish/wishList'
import Shopingcart from './components/wish/Shopingcart'
import Terms from './components/Terms';
import CustomNavBar from "./components/navbar/CustomNavBar";
import CustomGenNavBar from "./components/navbar/CustomGenNavBar";
import HomeNavBar from "./components/navbar/HomeNavBar";
import Notification from "./components/Notification";
import TabIcon from './components/TabIcon';
import WelcomeScreen from './components/WelcomeScreen';
import AddressBook from './components/Addressbook';
import MainView from './components/MainView';
import ProductDescription from './components/ProductDescription';
import Newaddress from './components/Newaddress';
import Searchproduct from './components/Searchproduct';
import Timeline from "./components/timeline";
import TimelineNew from "./components/timelineNew";
import Settings from "./components/settings";
import Contact from "./components/Contact";
import GetMyaddress from "./components/GetMyaddress";
import Marketingadd from "./components/Marketingadd";
import Editmyprofile from "./components/Editmyprofile";
import Myfaturah from './components/Myfaturah';
import Myfeaturefaturah from './components/Myfeaturefaturah'
import BookMyService from './components/BookMyService';
import MyAdfaturah from './components/MyAdfaturah';
import Myuserfaturah from './components/Myuserfaturah';
import OrderList from './components/OrderList';
import ServiceUser from './components/Order/ServiceUser'
import TrackOrder from './components/Order/TrackOrder'
import DealsandOffers from './components/DealsandOffers'
import Filter from './components/Filter';
import MenuIcon from './images/imgpsh.png';
import CityContainer from './components/CityContainer';

// -------------vendor ----------
import Product from './Vendor/Product';
import EditProduct from './Vendor/EditProduct';
import EditService from './Vendor/EditService';
import Service from './Vendor/Service';
import Order from './Vendor/Order';
import ProductVendor from './Vendor/ProductVendor';
import ServiceCustomer from './Vendor/Order/ServiceCustomer'
import ProfileVendor from "./vendorprofile/ProfileVendor";
import MarketingCompaign from "./Vendor/marketing/MarketingCompaign";
import ScheduleCalender from "./Vendor/Schedule/ScheduleCalender";
import ScheduleDetail from "./Vendor/Schedule/ScheduleDetail";
import EventEmitter from "react-native-eventemitter";

import SplashScreen from 'react-native-splash-screen';

// import AddProduct from "./app/Vendor/Addproduct";

// -------------vendor ----------

// const reducerCreate = params => (state, action) => Reducer(params)(state, action);

const reducerCreate = params => {
    SplashScreen.hide();
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log('ACTION:', action);
    return defaultReducer(state, action);
  };
};

const getSceneStyle = () => ({
  backgroundColor: '#F5FCFF',
  shadowOpacity: 1,
  shadowRadius: 3,
});

const Routes = ({loading, needSignIn, user, vendor, lang}) => (
    loading ?
    <Loader/> :
    <Router
    createReducer={reducerCreate}
    getSceneStyle={getSceneStyle}
    headerMode='screen'
    >
        <Overlay key="overlay">
            <Modal
            hideNavBar={true}
            transitionConfig={() => ({ screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid })}>
                <Lightbox key="lightbox">
                    <Stack key="root">
                        <Scene key='landingpage' component={WelcomeScreen} hideNavBar={true} initial={needSignIn}/>
                        <Scene key='cityLogin' component={CityContainer} hideNavBar={true}/>
                        <Scene key='loginPage'
                        component={LoginPage}
                        title='Login into ZeroToTwo'
                        hideNavBar={true}
                        type={ActionConst.REPLACE}
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                        titleStyle={{color : "#FFF", alignSelf: 'center'}}/>
                            <Scene key="tab" hideNavBar initial={user}>
                                <Tabs
                                tabs
                                key="tabbar"
                                swipeEnabled={false}
                                initial={!needSignIn}
                                // navBar={HomeNavBar}
                                // hideNavBar={true}
                                showLabel={false}
                                tabBarStyle={[styles.tabBarStyle, { flexDirection: lang === 'ar'? 'row-reverse': 'row'}]}
                                // tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                                tabBarPosition={'bottom'}
                                activeBackgroundColor='#fff'
                                inactiveBackgroundColor='#fff'
                                // lazy = {true}
                                // inactiveBackgroundColor="rgba(255, 0, 0, 0.5)"
                                panHandlers={null}
                                >
                                    <Stack
                                    key="Home"
                                    title={"home.homeTitle"}
                                    icon={TabIcon}
                                    iconName="home"
                                    hideNavBar={true}
                                    // navigationBarStyle={{backgroundColor: '#1e2226'}}  titleStyle={{color : "#FFF"}}
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1', }}
                                    // onRight={ ()=> console.log("")}
                                    // rightTitle={null}
                                    >
                                        <Scene
                                        key="homePage"
                                        titleStyle={{alignSelf: 'center'}}
                                        component={MainView}
                                        title={I18n.t("home.homeTitle", { locale: lang })}
                                        // navigationBarStyle={{backgroundColor: '#1e2226'}}
                                        titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                        type="replace"
                                        onEnter={()=> EventEmitter.emit("reloadProducts")}
                                        onExit={()=> EventEmitter.emit("onExitHome")}
                                         />
                                    </Stack>
                                    <Stack
                                    key="WishList"
                                    title={"wishlist.wishlistTitle"}
                                    icon={TabIcon}
                                    iconName="heart"
                                    hideNavBar={true}
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                                        <Scene
                                        key="wish"
                                        titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                                        component={wishList}
                                        title={I18n.t("wishlist.wishlistTitle", { locale: lang })}
                                        onEnter={()=> EventEmitter.emit("reloadWishlist")}
                                        onExit={()=> EventEmitter.emit("onExitWishlist")}
                                        />
                                    </Stack>
                                    <Stack
                                    key="Cart"
                                    title={"cart.carttitle"}
                                    icon={TabIcon}
                                    is_vector={true}
                                    hideNavBar={true}
                                    iconName= {require('./images/cart_icon.png')}
                                    iconNameSel= {require('./images/h_cart_icon.png')}
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                                        <Scene
                                        key="shopingCart"
                                        titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                                        component={Shopingcart}
                                        title={I18n.t("cart.carttitle", { locale: lang })}
                                        onEnter={()=> EventEmitter.emit("reloadCartlist")}
                                        onExit={()=> EventEmitter.emit("onExitCartlist")}
                                        />
                                    </Stack>
                                    <Stack
                                    key="profile"
                                    title={"profile.profiletitle"}
                                    icon={TabIcon}
                                    iconName="users"
                                    hideNavBar={true}
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                                        <Scene
                                        titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                        key="profilePage"
                                        component={ProfilePage}
                                        title={I18n.t("profile.profiletitle", { locale: lang })}
                                        onEnter={()=> EventEmitter.emit("reloadProfile")} 
                                        onExit={()=> EventEmitter.emit("onExitUserProfile")}                                       
                                        />
                                    </Stack>
                                </Tabs>
                            </Scene>
                        <Scene
                        key="vendortab"
                        hideNavBar
                        initial={vendor}
                        // type={ActionConst.REPLACE}
                        panHandlers={null}
                        >
                            <Tabs
                            tabs
                            key="tabbar"
                            swipeEnabled={false}
                            initial={!needSignIn}
                            showLabel={false}
                            tabBarStyle={[styles.tabBarStyle, { flexDirection: lang === 'ar'? 'row-reverse': 'row'}]}
                            tabBarPosition={'bottom'}
                            gestureEnabled={false}
                            activeBackgroundColor='#fff'
                            inactiveBackgroundColor='#fff'
                            lazy
                            // inactiveBackgroundColor="rgba(255, 0, 0, 0.5)"
                            >
                                <Stack
                                key="Product"
                                title={"vendorproducts.productTitle"}
                                icon={TabIcon}
                                iconName="tag"
                                hideNavBar
                                // navigationBarStyle={{backgroundColor: '#1e2226'}}  titleStyle={{color : "#FFF"}}
                                navigationBarStyle={{
                                  backgroundColor: '#a9d5d1',
                                // position:'absolute',left:0,right:0,top:0,bottom:0
                               }}
                                titleStyle={{ color: 'white', alignSelf: 'center' }}>
                                    <Scene
                                    key="product"
                                    titleStyle={{alignSelf: 'center'}}
                                    component={Product}
                                    hideNavBar
                                    title={I18n.t("vendorproducts.productTitle", { locale: lang })}
                                    // navigationBarStyle={{backgroundColor: '#1e2226'}}
                                    titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                    type="replace"
                                    onRight={ ()=> console.log("")}
                                    rightTitle={null}
                                    />
                                </Stack>
                                <Stack
                                key="Service"
                                title={"vendorservice.serviceTitle"}
                                icon={TabIcon}
                                hideNavBar
                                iconName="tag"
                                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                                    <Scene
                                    key="service"
                                    hideNavBar
                                    titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                                    component={Service}
                                    title={I18n.t("vendorservice.serviceTitle", { locale: lang })}
                                    onRight={ ()=> console.log("")}
                                    rightTitle={null}
                                />
                                </Stack>
                                <Stack
                                key="order"
                                title={"productorder.orderTitle"}
                                icon={TabIcon}
                                iconName="align-right"
                                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                                    <Scene
                                    key="order"
                                    titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                                    component={Order}
                                    title={I18n.t("productorder.orderTitle", { locale: lang })}
                                    // rightTitle={undefined}
                                    />
                                </Stack>
                                <Stack
                                key="vendorprofile"
                                title={"profile.profiletitle"}
                                icon={TabIcon}
                                iconName="user"
                                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                                lazy>
                                    <Scene
                                    titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                    key="ProfileVendor"
                                    component={ProfileVendor}
                                    title={I18n.t("profile.profiletitle", { locale: lang })}
                                    />
                                </Stack>
                                <Stack
                                    key="vendorschedule"
                                    title={"scheduleService.serviceTitle"}
                                    icon={TabIcon}
                                    iconName="calendar"
                                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                                    lazy>
                                    <Scene
                                        titleStyle={{color : "#FFF", alignSelf: 'center'}}
                                        key="ScheduleCalender"
                                        component={ScheduleCalender}
                                        title={I18n.t("scheduleService.serviceTitle", { locale: lang })}
                                        />
                                </Stack>
                            </Tabs>
                        </Scene>
                    </Stack>
                </Lightbox>
                <Stack key="deals" >
                    <Scene
                        hideNavBar={true}
                        key="register"
                        component={DealsandOffers}
                        title={I18n.t("login.createaccountbtn", { locale: lang })}
                        navBar={CustomGenNavBar}
                        />
                </Stack>
                <Stack key="registerPage" navBar={CustomGenNavBar} >
                    <Scene
                        key="register"
                        component={Register}
                        title={I18n.t("login.createaccountbtn", { locale: lang })}
                        navBar={CustomGenNavBar}
                        />
                </Stack>
                <Stack key="registerVendor" navBar={CustomGenNavBar} >
                    <Scene
                    key="vendorRegister"
                    component={Vendorreg}
                    title={I18n.t("login.createaccountbtn", { locale: lang })}
                    navBar={CustomGenNavBar}
                    />
                </Stack>
                <Stack key="editproduct" navBar={CustomGenNavBar} >
                    <Scene
                    key="editproduct"
                    component={EditProduct}
                    title={I18n.t("vendorproducts.producteditTitle", { locale: lang })}
                    />
                </Stack>
                <Stack key="editservice" navBar={CustomGenNavBar} >
                    <Scene
                    key="editservice"
                    component={EditService}
                    title={I18n.t("vendorservice.serviceeditTitle", { locale: lang })}
                    />
                </Stack>
                <Stack key="AddressLists" navBar={CustomGenNavBar} hideNavBar={true} >
                    <Scene
                    key="address"
                    component={AddressBook}
                    title={I18n.t("productdetail.selectaddress", { locale: lang })}
                    hideNavBar={false}
                    renderRightButton={() => <Ionicons name="plus" size={25} onPress={()=> Actions.newaddress({isFromEdit:false})} color="#fff" style={Platform.OS === 'ios' ?
                        {
                        padding:15,
                        marginTop:0,
                    } : {
                    alignSelf: 'center'
                }}/>}
                    />
                </Stack>
                <Stack key="deascriptionPage" renderTitle >
                    <Scene
                    key="deascription"
                    component={ProductDescription}
                    navBar={CustomGenNavBar}
                    type={ActionConst.REPLACE}
                    />
                </Stack>
                <Stack key="contactUs">
                    <Scene
                    key="contact"
                    component={Contact}
                    title={I18n.t("sidemenu.contact", { locale: lang })}
                    navBar={CustomGenNavBar}
                    />
                </Stack>
                <Stack key="notificationShow">
                    <Scene
                    key="notification"
                    component={Notification}
                    title={I18n.t("notification.notiTitle", { locale: lang })}
                    navBar={CustomGenNavBar}
                    />
                </Stack>
                <Stack key="profile" >
                    <Scene
                    key="profile"
                    component={ProfilePage}
                    title={I18n.t("profile.profiletitle", { locale: lang })}
                    />
                </Stack>
                <Stack key="newaddress">
                    <Scene
                    key="newaddress"
                    component={Newaddress}
                    title={I18n.t("newAddress.newaddrtitle", { locale: lang })}
                    hideNavBar={true}/>
                </Stack>
                <Stack key="terms" renderTitle>
                    <Scene
                    key="terms"
                    component={Terms}
                    // title="Conditions"
                    navBar={CustomGenNavBar} />
                </Stack>
                <Stack key="settings">
                    <Scene
                    key="settings"
                    component={Settings}
                    title={I18n.t("profile.settings", { locale: lang })}
                    navBar={CustomGenNavBar} />
                </Stack>
                <Stack key="postad">
                    <Scene
                    key="adpost"
                    component={Marketingadd}
                    title={I18n.t("marketing.advertisement", { locale: lang })}
                    navBar={CustomGenNavBar} />
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="timeLine"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="timelineStatus"
                    component={Timeline} />
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="timeLineNew"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="timelineNewStatus"
                    component={TimelineNew} />
                </Stack>
                <Stack key="vendordesc" renderTitle >
                    <Scene
                    key="deascription"
                    component={ProductVendor}
                    navBar={CustomGenNavBar}
                    type={ActionConst.ANDROID_BACK}/>
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="myfaturah"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="faturah"
                    component={Myfaturah} />
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="myfeaturefaturah"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="featurefaturah"
                    component={Myfeaturefaturah} />
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="bookmyservice"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="BookService"
                    component={BookMyService} />
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="myAdfaturah"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="adfaturah"
                    component={MyAdfaturah} />
                </Stack>
                <Stack
                back
                backTitle="Back"
                hideNavBar={true}
                duration={0}
                key="myuserAdfaturah"
                titleStyle={{ color: 'black', alignSelf: 'center' }}
                navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                    <Scene
                    key="usradfaturah"
                    component={Myuserfaturah} />
                </Stack>
                <Stack
                key="filterBar"
                hideTabBar={true}
                titleStyle={{alignSelf: 'center'}}>
                    <Scene
                    key="filter"
                    title={I18n.t("filter.fitlertitle", { locale: lang })}
                    navBar={CustomNavBar}
                    component={Filter}
                    back/>
                </Stack>
                <Stack
                key="getmyaddress"
                hideTabBar={true}
                titleStyle={{alignSelf: 'center'}}
                renderRightButton={() => <Ionicons
                    name="plus"
                    size={25}
                    onPress={()=> Actions.newaddress({isFromEdit:false})}
                    color="#fff"
                    style={Platform.OS === 'ios' ?
                        {
                        padding:15,
                        marginTop:10,
                    } : {
                    alignSelf: 'center'
                }}/>}
                >
                    <Scene
                    key="getmyaddress"
                    title={I18n.t("profile.addressbook", { locale: lang })}
                    navBar={CustomGenNavBar}
                    component={GetMyaddress}
                    back/>
                </Stack>
                <Stack
                key="filterdBy">
                    <Scene
                    key="filterdBy"
                    titleStyle={{alignSelf: 'center'}}
                    component={Searchproduct}
                    navBar={CustomGenNavBar}/>
                </Stack>
                <Stack
                key="editProfile"
                renderTitle>
                    <Scene
                    key="profileEdit"
                    titleStyle={{alignSelf: 'center'}}
                    component={Editmyprofile}
                    navBar={CustomGenNavBar}/>
                </Stack>
                <Stack key="servicecustomer">
                    <Scene
                    key="service"
                    component={ServiceCustomer}
                    // title="ServiceCustomer"
                    navBar={CustomGenNavBar}
                    type={ActionConst.ANDROID_BACK}
                    renderTitle/>
                </Stack>
                <Stack key="serviceusr">
                    <Scene
                    key="service"
                    component={ServiceUser}
                    // title="ServiceCustomer"
                    navBar={CustomGenNavBar}
                    type={ActionConst.ANDROID_BACK}
                    renderTitle/>
                </Stack>
                <Stack
                key="myorder">
                    <Scene
                    key="orderList"
                    title={I18n.t("userorderhistory.orderhistorytitle", { locale: lang })}
                    titleStyle={{alignSelf: 'center'}}
                    component={OrderList}
                    navBar={CustomGenNavBar}/>
                </Stack>
                <Stack key="marketingcompaign">
                    <Scene
                    key="compaign"
                    component={MarketingCompaign}
                    title={I18n.t("venderprofile.marketing", { locale: lang })}
                    navBar={CustomGenNavBar}
                    type={ActionConst.ANDROID_BACK}
                    hideNavBar={true}
                    />
                </Stack>
                <Stack key="scheduleDetail">
                    <Scene
                    key="scheduleDtl"
                    component={ScheduleDetail}
                    title={I18n.t("scheduleDetail.title", { locale: lang })}
                    navBar={CustomGenNavBar}
                    type={ActionConst.ANDROID_BACK}
                    // hideNavBar={true}
                    />
                </Stack>
            </Modal>
            <Scene component={MessageBar} key="msgbar"/>
        </Overlay>
    </Router>
);
function mapStateToProps(state) {
    let is_user
    let is_vendor
    // console.warn(state.auth.lang);
    if(state.auth.user_type === "3"){
        is_user = false
        is_vendor = true
    }else if(state.auth.user_type === "2" || state.auth.deviceId) {
        is_user = true
        is_vendor = false
    }
  return {
    loading: !state.storage.storageLoaded,
    needSignIn: !state.auth.token,
    user: is_user,
    vendor: is_vendor,
    lang : state.auth.lang,
    deviceId : state.auth.deviceId,
  }
}
const mapStateToDispatch = dispatch => ({
  startup: () => dispatch(StartupActions.startup())
})
const drawerStyles = {
  drawer: { shadowColor: '#fff', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}
const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#eee',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
  },
});
export default connect(mapStateToProps, mapStateToDispatch)(Routes);
