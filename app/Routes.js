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
import { Text, View, StyleSheet } from 'react-native';
import MessageBar from './common/MessageBar';

import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
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
import Notification from "./components/Notification";
import TabIcon from './components/TabIcon';
import WelcomeScreen from './components/WelcomeScreen';
import AddressBook from './components/Addressbook';
import MainView from './components/MainView';
import ProductDescription from './components/ProductDescription';
import Newaddress from './components/Newaddress';
import Searchproduct from './components/Searchproduct';
import Timeline from "./components/timeline";
import Settings from "./components/settings";
import Contact from "./components/Contact";
import GetMyaddress from "./components/GetMyaddress";
import Marketingadd from "./components/Marketingadd";
import Editmyprofile from "./components/Editmyprofile";
import Myfaturah from './components/Myfaturah';
import BookMyService from './components/BookMyService';
import MyAdfaturah from './components/MyAdfaturah';
import Myuserfaturah from './components/Myuserfaturah';
import OrderList from './components/OrderList';
import Filter from './components/Filter';
import MenuIcon from './images/imgpsh.png';

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

// import AddProduct from "./app/Vendor/Addproduct";

// -------------vendor ----------

// const reducerCreate = params => (state, action) => Reducer(params)(state, action);

const reducerCreate = params => {
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

const Routes = ({loading, needSignIn, user, vendor}) => (
  loading ?
    <Loader/> :
    <Router 
    createReducer={reducerCreate}
    getSceneStyle={getSceneStyle}
    headerMode='screen'>

        <Overlay key="overlay">
            <Modal 
            hideNavBar={true}
            transitionConfig={() => ({ screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid })}>
            <Lightbox key="lightbox">
                <Stack key="root">
                    <Scene key='landingpage' component={WelcomeScreen} hideNavBar={true} initial={needSignIn}/>
                    <Scene key='loginPage' 
                    component={LoginPage} 
                    title='Login into ZeroToTwo' 
                    hideNavBar={false}  
                    type={ActionConst.REPLACE} 
                    navigationBarStyle={{ backgroundColor: '#a9d5d1' }} 
                    titleStyle={{color : "#FFF", alignSelf: 'center'}}/>
                <Drawer
                key="drawer" 
                drawer ={true}
                type="overlay" 
                drawerImage={MenuIcon} 
                contentComponent={Menu}     
                tapToClose={true}
                // initial={true} 
                // initial={true} 
                hideNavBar={true} 
                initial={user} 
                >
                
                <Scene key="tab" hideNavBar>

                    <Tabs 
                    tabs
                    key="tabbar"
                    swipeEnabled={false}
                    initial={!needSignIn}
                    showLabel={false}
                    tabBarStyle={styles.tabBarStyle}
                    // tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                    tabBarPosition={'bottom'}
                    gestureEnabled={false} 
                    activeBackgroundColor='#fff' 
                    inactiveBackgroundColor='#fff'
                    lazy
                    duration={0}
                    // inactiveBackgroundColor="rgba(255, 0, 0, 0.5)"
                    >

                        <Stack
                        key="Home"
                        title="Home"
                        icon={TabIcon}
                        iconName="home"
                        // navigationBarStyle={{backgroundColor: '#1e2226'}}  titleStyle={{color : "#FFF"}}
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                        onRight={ ()=> console.log("")}
                        rightTitle={null}>
                            
                            <Scene 
                            key="homePage" 
                            titleStyle={{alignSelf: 'center'}} 
                            component={MainView} 
                            title="Home"
                            // navigationBarStyle={{backgroundColor: '#1e2226'}}  
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            type="replace"/>

                        </Stack>
                        
                        <Stack
                        key="wish"
                        title="wish"
                        icon={TabIcon}
                        iconName="heart"
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                            <Scene 
                            key="wish"
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            navigationBarStyle={{ backgroundColor: '#a9d5d1' }} 
                            component={wishList} 
                            title="WishList"/>
                        </Stack>

                        <Stack
                        key="Cart"
                        title="Cart"
                        icon={TabIcon}
                        iconName="opencart"
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>

                            <Scene 
                            key="shopingCart"
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            navigationBarStyle={{ backgroundColor: '#a9d5d1' }} 
                            component={Shopingcart} 
                            title="Cart"/>
                        </Stack>
                        
                        <Stack
                        key="profile"
                        title="Profile"
                        icon={TabIcon}
                        iconName="users"
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                            <Scene 
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            key="profilePage" 
                            component={ProfilePage} 
                            title="Profile"/>
                        </Stack>
                        
                    </Tabs>
                </Scene>
                </Drawer>
            </Stack>
        </Lightbox>

            <Scene 
            key="vendortab" 
            hideNavBar 
            initial={vendor}
            // type={ActionConst.REPLACE}
            >
                <Tabs 
                tabs
                key="tabbar"
                swipeEnabled={false}
                initial={!needSignIn}
                showLabel={false}
                tabBarStyle={styles.tabBarStyle}
                tabBarPosition={'bottom'}
                gestureEnabled={false} 
                activeBackgroundColor='#fff' 
                inactiveBackgroundColor='#fff'
                lazy
                // inactiveBackgroundColor="rgba(255, 0, 0, 0.5)"
                >
                        <Stack
                        key="Product"
                        title="Product"
                        icon={TabIcon}
                        iconName="tag"
                        // navigationBarStyle={{backgroundColor: '#1e2226'}}  titleStyle={{color : "#FFF"}}
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                        titleStyle={{ color: 'white', alignSelf: 'center' }}>
                            <Scene 
                            key="product" 
                            titleStyle={{alignSelf: 'center'}} 
                            component={Product} 
                            title="PRODUCT"
                            // navigationBarStyle={{backgroundColor: '#1e2226'}}  
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            type="replace"
                            onRight={ ()=> console.log("")}
                            rightTitle={null}
                            />
                        </Stack>
                        
                        <Stack
                        key="service"
                        title="service"
                        icon={TabIcon}
                        iconName="tag"
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>
                            <Scene 
                            key="service"
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            navigationBarStyle={{ backgroundColor: '#a9d5d1' }} 
                            component={Service} 
                            title="SERVICE"
                            onRight={ ()=> console.log("")}
                            rightTitle={null}
                        />
                        </Stack>

                        <Stack
                        key="order"
                        title="order"
                        icon={TabIcon}
                        iconName="align-right"
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}>

                            <Scene 
                            key="order"
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            navigationBarStyle={{ backgroundColor: '#a9d5d1' }} 
                            component={Order} 
                            title="ORDERS"
                            // rightTitle={undefined}
                            />
                        </Stack>
                        
                        <Stack
                        key="vendorprofile"
                        title="Profile"
                        icon={TabIcon}
                        iconName="user-secret"
                        navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                        lazy>
                            <Scene 
                            titleStyle={{color : "#FFF", alignSelf: 'center'}}
                            key="ProfileVendor" 
                            component={ProfileVendor} 
                            title="Profile"/>
                        </Stack>
                        
                    </Tabs>
                </Scene>
                    <Stack key="registerPage" navBar={CustomGenNavBar} >
                        <Scene 
                        key="register" 
                        component={Register} 
                        title="Create an Acount" 
                        navBar={CustomGenNavBar} 
                        />
                    </Stack>
                    <Stack key="registerVendor" navBar={CustomGenNavBar} >
                        <Scene 
                        key="vendorRegister" 
                        component={Vendorreg} 
                        title="Create an Acount" 
                        navBar={CustomGenNavBar} 
                        />
                    </Stack>
                    <Stack key="editproduct" navBar={CustomGenNavBar} >
                        <Scene 
                        key="editproduct" 
                        component={EditProduct} 
                        title="EditProduct" 
                        />
                    </Stack>
                    <Stack key="editservice" navBar={CustomGenNavBar} >
                        <Scene 
                        key="editservice" 
                        component={EditService} 
                        title="EditService" 
                        />
                    </Stack>
                    <Stack key="AddressLists" hideNavBar={true} >
                        <Scene 
                        key="address" 
                        component={AddressBook} 
                        title="Addressbook" 
                        hideNavBar={true}
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
                        title="Contact Us" 
                        navBar={CustomGenNavBar} 
                        />
                    </Stack>
                    <Stack key="notificationShow">    
                        <Scene 
                        key="notification" 
                        component={Notification} 
                        title="Notifications" 
                        navBar={CustomGenNavBar} 
                        />
                    </Stack>
                    <Stack key="profile" >
                        <Scene 
                        key="profile" 
                        component={ProfilePage} 
                        title="Profile" 
                        />
                    </Stack> 

                    <Stack key="newaddress">
                        <Scene 
                        key="newaddress" 
                        component={Newaddress} 
                        title="Newaddress"
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
                        title="Settings"
                        navBar={CustomGenNavBar} /> 
                    </Stack>

                    <Stack key="postad">                                
                        <Scene 
                        key="adpost" 
                        component={Marketingadd} 
                        title="Advertisement"
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
                        title="filter"
                        navBar={CustomNavBar}
                        component={Filter}
                        back/>
                    </Stack>
                    <Stack 
                    key="getmyaddress" 
                    hideTabBar={true} 
                    titleStyle={{alignSelf: 'center'}}
                    renderRightButton={() => <Ionicons name="plus" size={20} onPress={()=> Actions.newaddress()} color="#fff" style={{  alignItems:'center',padding:15}}/>}
                    >
                        <Scene
                        key="getmyaddress"
                        title="My Address"
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
                    <Stack 
                    key="myorder">
                        <Scene 
                        key="orderList" 
                        title="Order History" 
                        titleStyle={{alignSelf: 'center'}} 
                        component={OrderList} 
                        navBar={CustomGenNavBar}/>
                    </Stack>
                    <Stack key="marketingcompaign">    
                        <Scene 
                        key="compaign" 
                        component={MarketingCompaign} 
                        title="Marketing" 
                        navBar={CustomGenNavBar} 
                        type={ActionConst.ANDROID_BACK}
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
    if(state.auth.user_type === "3"){
        is_user = false
        is_vendor = true
    }else if(state.auth.user_type === "2") {
        is_user = true
        is_vendor = false
   
    }
  return {
    loading: !state.storage.storageLoaded,
    needSignIn: !state.auth.token,
    user: is_user,
    vendor: is_vendor

  }
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
export default connect(mapStateToProps)(Routes);