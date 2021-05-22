import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import firebaseAuth from '@react-native-firebase/auth';
import firebaseFireStore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import UserProfile from '../screens/UserProfile';
import MainProfile from '../screens/MainProfile';
import DrawerContent from '../components/DrawerComponent';
import ProfilePage from '../screens/ProfilePage';
import AllUsersList from '../screens/AllUsersList';
import ReceivedRequests from '../screens/ReceivedRequests'
import About from '../screens/About';
import MyRequests from '../screens/MyRequests';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DatingAppContext} from '../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RateUs from '../screens/RateUs';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
export default function Routes() {
  const {state, setState} = useContext(DatingAppContext);
  const [authState, setAuthState] = React.useState({
    isLoggedIn: false,
    loaded: false,
  });
  // console.log(firebaseAuth().currentUser)
  const HomeDrawer = () => {
    return (
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} drawerStyle={{width: "50%"}} >
        <Drawer.Screen name="Home" component={AllUsersList} />
        <Stack.Screen name="MyRequests" component={MyRequests} />
        <Drawer.Screen name="ProfileScreen" component={UserProfile} />
        <Drawer.Screen name="Profile" component={ProfilePage} />
        <Drawer.Screen name="MainProfile" component={MainProfile}/>
        <Drawer.Screen name="RateUs" component={RateUs}/>
        <Drawer.Screen name="AboutUs" component={About}/>
      </Drawer.Navigator>
    );
  };
  React.useEffect(() => {
    firebaseAuth().onAuthStateChanged(user => {
      if (!user) {
        setAuthState({...authState, isLoggedIn: false, loaded: true});
      } else{
        setAuthState({...authState, isLoggedIn: true, loaded: true});
      }
      // else {
      //   firebaseFireStore()
      //     .collection('users')
      //     .doc(firebaseAuth().currentUser.uid)
      //     .get()
      //     .then(res => {
      //       AsyncStorage.setItem(
      //         'loggedInUser',
      //         JSON.stringify({
      //           user: res.data(),
      //           id: firebaseAuth().currentUser.uid,
      //         }),
      //       );

      //       setState({
      //         ...state,
      //         profileInfo: {
      //           user: res.data(),
      //           id: firebaseAuth().currentUser.uid,
      //         },
      //       });
      //     })
      //     .catch(err => console.log(err));
      //   setAuthState({...authState, isLoggedIn: true, loaded: true});
      // }
    });
  }, []);
  if (!authState.loaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!authState.isLoggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
          <Stack.Screen name="MyRequests" component={MyRequests} />
          <Stack.Screen name="ReceivedRequests" component={ReceivedRequests} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="Profile" component={ProfilePage}/>
          {/* <Stack.Screen name="UserProfile" component={ProfilePage} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
