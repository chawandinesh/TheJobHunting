import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import firebaseAuth from '@react-native-firebase/auth';
import firebaseStorage from '@react-native-firebase/storage';
import {Icon} from 'native-base';
import firebaseFireStore from '@react-native-firebase/firestore';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');
export default function DrawerContent(props) {
  const handleLogout = () => {
    firebaseAuth().signOut();
    AsyncStorage.clear();
  };
  const [loggedInUser, setLoggedInUser] = useState({});
  const getAsyncData = async () => {
    try {
      firebaseFireStore()
        .collection('users')
        .doc(firebaseAuth().currentUser.uid)
        .onSnapshot(res => {
          setLoggedInUser({...res.data(), id: res.id});
        });
    } catch (err) {}
  };
  useEffect(() => {
    getAsyncData();
  }, []);

  const image = null;
  return (
    <DrawerContentScrollView {...props} style={{width: width * 0.5}}>
      <ImageBackground
        source={require('../assets/bg2.jpg')}
        style={styles.drawerContainer}>
        <View style={styles.profileImageContainer}>
          {loggedInUser.image === '' ? (
            <FontAwesome5 name="user-circle" size={height * 0.1} />
          ) : (
            <Image
              style={{
                width: height * 0.16,
                height: height * 0.16,
                borderRadius: height * 0.1,
              }}
              source={{uri: loggedInUser.image}}
            />
          )}
        </View>
        <View style={styles.drawerNavigationContainer}>
          <View style={styles.drawerItemsContainer}>
            <View
              style={{
                borderWidth: 1,
                width: 'auto',
                borderRadius: height * 0.04,
                minWidth: width * 0.4,
              }}>
              <Text
                style={{
                  fontSize: height * 0.03,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#fff',
                }}>
                {loggedInUser.userName}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                borderTopColor: '#e91e63',
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: width * 0.4,
                alignSelf: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {
                  width: 1,
                  height: 1,
                },
                shadowRadius: 1,
                shadowOpacity: 1,
                paddingVertical: 10,
              }}
              onPress={() => {
                props.navigation.navigate('Home');
              }}>
              <Icon name="user" type="FontAwesome" style={{color: '#fff'}} />
              <Text
                style={{
                  color: '#fff',
                  fontSize: height * 0.023,
                  fontWeight: 'bold',
                }}>
                Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderTopColor: '#e91e63',
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: width * 0.4,
                alignSelf: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {
                  width: 1,
                  height: 1,
                },
                shadowRadius: 1,
                shadowOpacity: 1,
                paddingVertical: 10,
              }}
              onPress={() => {
                props.navigation.navigate('MainProfile');
              }}>
              <Icon name="user" type="FontAwesome" style={{color: '#fff'}} />
              <Text
                style={{
                  color: '#fff',
                  fontSize: height * 0.023,
                  fontWeight: 'bold',
                }}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderTopColor: '#e91e63',
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: width * 0.4,
                alignSelf: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {
                  width: 1,
                  height: 1,
                },
                shadowRadius: 1,
                shadowOpacity: 1,
                paddingVertical: 10,
              }}
              onPress={() => {
                props.navigation.navigate('MyRequests');
              }}>
              <Icon
                name="user-friends"
                type="FontAwesome5"
                style={{color: '#fff'}}
              />

              <Text
                style={{
                  color: '#fff',
                  fontSize: height * 0.023,
                  fontWeight: 'bold',
                }}>
                Users requests
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderTopColor: '#e91e63',
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: width * 0.4,
                alignSelf: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {
                  width: 1,
                  height: 1,
                },
                shadowRadius: 1,
                shadowOpacity: 1,
                paddingVertical: 10,
              }}
              onPress={() => {
                props.navigation.navigate('AboutUs');
              }}>
              <Icon
                name="description"
                type="MaterialIcons"
                style={{color: '#fff'}}
              />

              <Text
                style={{
                  color: '#fff',
                  fontSize: height * 0.023,
                  fontWeight: 'bold',
                }}>
                AboutUs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderTopColor: '#e91e63',
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: width * 0.4,
                alignSelf: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {
                  width: 1,
                  height: 1,
                },
                shadowRadius: 1,
                shadowOpacity: 1,
                paddingVertical: 10,
              }}
              onPress={() => {
                props.navigation.navigate('RateUs');
              }}>
              <Icon
                name="star-rate"
                type="MaterialIcons"
                style={{color: '#fff'}}
              />

              <Text
                style={{
                  color: '#fff',
                  fontSize: height * 0.023,
                  fontWeight: 'bold',
                }}>
                Rate Us
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => handleLogout()}>
            <Text style={styles.logoutText}>Logout</Text>
            <Icon
              name="log-out"
              type="entype"
              style={{color: 'rgba(255,255,255,0.5)', paddingLeft: 10}}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {height: height, width: width, marginTop: -10},
  profileImageContainer: {
    height: height * 0.2,
    // marginBottom: 20,
    width: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerNavigationContainer: {
    height: height * 0.6,
    justifyContent: 'space-between',
  },
  drawerItemsContainer: {
    width: width * 0.5,
    // alignSelf:'center',
    height: height * 0.6,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  drawerItem: {
    width: width * 0.7,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    width: width * 0.5,
    alignItems: 'center',
    backgroundColor: '#e91e63',
    flexDirection: 'row',
    height: height * 0.05,
    marginTop: height * 0.05,
    justifyContent: 'center',
  },
  logoutText: {color: 'white', fontWeight: 'bold'},
});
