import React, {Component, useState} from 'react';
import {
  ImageBackground,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import firebaseFireStore from '@react-native-firebase/firestore';
import firebaeAuth from '@react-native-firebase/auth';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {DatingAppContext} from '../context/Context';
import {Icon} from 'native-base';
const {height, width} = Dimensions.get('window');

const AllDetails = props => {
  const [filterUserType, setFilterUserType] = useState('ShortListed');
  const [users, setUsers] = useState([]);
  const [profileInfo, setProfileInfo] = useState({});
  console.log(profileInfo, 'profileinfo');
  const getConfirm = e => {
    if (e == filterUserType) {
      return true;
    } else {
      return false;
    }
  };

  const getUser = () => {
    firebaseFireStore()
      .collection('users')
      .doc(firebaeAuth().currentUser.uid)
      .onSnapshot(data => {
        console.log(data);
      });
  };

  const getUsers = () => {
    // console.log(profileInfo.userActions.likes, users.map((e) => e.id))
    switch (filterUserType) {
      case 'ShortListed':
        return users.filter(e => profileInfo.userActions.likes.includes(e.id));
      // return profileInfo && users.filter((e) => e.userActions )
      // return users.filter((e) =>profileInfo.hasOwnProperty('userActions') && profileInfo.userActions.likes.include(e.id))
      // return users.filter(
      //   e => profileInfo && profileInfo.likes.includes(e.id),
      // );
      case 'Approach':
        return users.filter(e =>
          profileInfo.userActions.approach.includes(e.id),
        );

      // return users.filter((e) => profileInfo.userActions.likes.includes(e.id))

      // return users.filter((e) => profileInfo.hasOwnProperty('userActions') && profileInfo.userActions.approach.include(e.id))

      // return users.filter(
      //   e => profileInfo && profileInfo.approach.includes(e.id),
      // );
      case 'Rejected':
        // return users.filter((e) => profileInfo.hasOwnProperty('userActions') && profileInfo.userActions.disLikes.include(e.id))
        return users.filter(e =>
          profileInfo.userActions.disLikes.includes(e.id),
        );

      // return users.filter(
      //   e => profileInfo && profileInfo.disLikes.includes(e.id),
      // );
      default:
        return [];
    }
  };

  console.log(users, profileInfo, 'users...');
  React.useEffect(() => {
    firebaseFireStore()
      .collection('users')
      .doc(firebaeAuth().currentUser.uid)
      .onSnapshot(res => {
        setProfileInfo({...res.data(), id: res.id});
      });
    firebaseFireStore()
      .collection('users')
      .onSnapshot(querySnap => {
        let users = [];
        querySnap.forEach(e => {
          users.push({...e.data(), id: e.id});
        });
        setUsers(users.filter(e => e.id !== firebaeAuth().currentUser.uid));
      });
  }, []);
  const getImage = gender => {
    switch (gender) {
      case 'male':
        return (
          <Image
            style={{
              height: height * 0.095,
              width: height * 0.095,
              borderWidth: 2,
              borderRadius: height * 0.05,
            }}
            source={require('../assets/prf.png')}
          />
        );

      case 'female':
        return (
          <Image
            style={{
              height: height * 0.1,
              width: height * 0.1,
              borderWidth: 2,
              borderRadius: height * 0.05,
            }}
            source={require('../assets/fml.png')}
          />
        );

      default:
        break;
    }
  };
  const Data = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => props.navigation.navigate('UserProfile', {data: item})}>
        <View
          style={{
            marginLeft: -2,
            width: width * 0.91,
            height: height * 0.145,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            alignSelf: 'center',
            flexDirection:'row',
            // justifyContent:'center'
            alignItems:'center',
            borderRadius: 5,
            borderBottomColor:'#00796b',
            borderBottomWidth: 2
          }}>
          {item.image.length ? (
            <Image
              style={{
                // marginLeft: 5,
                height: height * 0.1,
                width: height * 0.1,
                borderWidth: 2,
                borderRadius: height * 0.05,
              }}
              source={{uri: item.image}}
            />
          ) : (
            <View
              style={{
                marginLeft: 5,
                borderWidth: 2,
                height: height * 0.1,
                width: height * 0.1,
                borderRadius: height * 0.05,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {getImage(item.gender)}
            </View>
          )}
          {/* </View> */}

          <View style={styles.viewType}>
            <Text style={styles.info}>Name:</Text>
            <View style={styles.line}></View>
            <Text style={styles.title}>{item.userName}</Text>
            <Text style={styles.info}>Age:</Text>
            <View style={styles.line}></View>
            <Text style={styles.ageType}>{item.age}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ImageBackground
      source={require('../assets/grad.jpeg')}
      style={{height, width}}>
      <View
        style={{
          marginTop: height * 0.04,
          width: width * 1,
          height: height * 0.06,
          alignItems: 'center',

          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View>
          <TouchableOpacity
            style={{justifyContent: 'center', padding: 5}}
            onPress={() => props.navigation.openDrawer()}>
            <Icon
              name="menu"
              style={{fontSize: height * 0.05, color: '#162842',}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{justifyContent: 'center', padding: 5}}
            onPress={() => props.navigation.navigate('Profile')}>
            {!profileInfo.image ? (
              <Icon name="user" type="FontAwesome" style={{marginRight: 10, color:'#162842',}} />
            ) : (
              <Image
                source={{uri: profileInfo.image}}
                style={{
                  height: height * 0.05,
                  borderRadius: height * 0.05,
                  width: height * 0.05,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
          width: width * 0.97,
          height: height * 0.08,
          backgroundColor: 'rgba(0, 125, 136, 0.2)',
          borderBottomWidth: 2,
          borderBottomColor: '#162842',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center'
        }}>
        <TouchableOpacity
          onPress={() => setFilterUserType('Approach')}
          style={{
            width: width * 0.31,
            height: height * 0.06,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            backgroundColor: getConfirm('Approach') ? '#162842' : null,
            // borderRadius: getConfirm('Approach') ? 20 : 0,
          }}>
          <Text
            style={{
              width: width * 0.3,
              height: height * 0.035,
              textAlign: 'center',
              color: 'white',
              fontSize: 22,
              fontWeight: 'bold',
            }}>
            Applied
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterUserType('ShortListed')}
          style={{
            width: width * 0.31,
            height: height * 0.06,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            backgroundColor: getConfirm('ShortListed') ? '#162842' : null,
            // borderRadius: getConfirm('ShortListed') ? 20 : 0,
          }}>
          <Text
            style={{
              width: width * 0.3,
              height: height * 0.035,
              textAlign: 'center',
              color: 'white',
              fontSize: 22,
              fontWeight: 'bold',
            }}>
            Accepted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterUserType('Rejected')}
          style={{
            width: width * 0.31,
            height: height * 0.06,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            backgroundColor: getConfirm('Rejected') ? '#162842' : null,
            // borderRadius: getConfirm('Rejected') ? 20 : 0,
          }}>
          <Text
            style={{
              width: width * 0.3,
              height: height * 0.035,
              textAlign: 'center',
              color: 'white',
              fontSize: 22,
              fontWeight: 'bold',
            }}>
            Rejected
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{height: height * 0.75, marginTop: 15}}>
        {getUsers().length ? (
          <FlatList
            data={getUsers()}
            renderItem={Data}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View
            style={{
              height: height * 0.8,
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                padding: 10,
                backgroundColor: '#00796b',
                borderBottomWidth: 1,
                borderBottomColor: '#e91e63',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: height * 0.03}}>
                {' '}
                No Users Found{' '}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#162842',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 15,
    height: height * 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    // borderWidth: 5,
    shadowColor: '#00796b',
    shadowOffset: {width: 3, height: 4},
    shadowOpacity: 5,
    elevation: 3,
    shadowRadius: 5,
  },
  title: {
    // backgroundColor: 'pink',
    width: width * 0.5,
    //  marginLeft: width * 0.14,
    // height: height * 0.04,
    fontSize: 20,

    textAlign: 'left',
    color: 'green',
  },
  viewType: {
    marginLeft: 15,
    // backgroundColor: 'white',
    width: width * 0.54,
    height: height * 0.11,
  },
  info: {
    // marginTop: 2,
    fontSize: 17,
    fontWeight: 'bold',
    // padding: 1,
    color: '#162842',
  },
  line: {
    width: width * 0.55,
    // height: height * 0.004,
    // backgroundColor: '#e91e63',
    alignSelf: 'center',
  },
  ageType: {
    // marginTop: 1,
    // backgroundColor: 'pink',
    width: width * 0.56,
    // height: height * 0.04,
    fontSize: 20,
    // textAlign: 'center',
  },
});

export default AllDetails;
