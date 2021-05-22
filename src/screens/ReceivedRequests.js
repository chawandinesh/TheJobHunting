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
const DATA = [
  {
    name: 'Dinesh Chandra',
    age: 25,
    image: require('../assets/prf.png'),
  },
  {
    name: 'Vikas Kumar',
    age: 21,
    image: require('../assets/prf.png'),
  },
  {
    name: 'Happy Singh',
    age: 22,
    image: require('../assets/prf.png'),
  },
  {
    name: 'Amit Kumar',
    age: 27,
    image: require('../assets/prf.png'),
  },
  {
    name: 'Pawan Yadav',
    age: 24,
    image: require('../assets/prf.png'),
  },
];

const AllDetails = props => {
  const [filterUserType, setFilterUserType] = useState('ShortListed');
  const [users, setUsers] = useState([]);
  const [profileInfo, setProfileInfo] = useState({});
  const data = props.route.params.data;
  console.log(profileInfo, 'profileinfo');
  const getConfirm = e => {
    if (e == filterUserType) {
      return true;
    } else {
      return false;
    }
  };

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

  const getUser = () => {
    firebaseFireStore()
      .collection('users')
      .doc(firebaeAuth().currentUser.uid)
      .onSnapshot(data => {
        console.log(data);
      });
  };

  const getUsers = () => {
    switch (data) {
      case 'ShortListed':
        return users.filter(e => profileInfo.likes.includes(e.id));
      // return users.filter((e) => profileInfo.userActions.likes.includes(e.id))
      case 'Approach':
        return users.filter(e => profileInfo.approach.includes(e.id));

      // return users.filter((e) => profileInfo.userActions.approach.includes(e.id))
      case 'Rejected':
        return users.filter(e => profileInfo.disLikes.includes(e.id));

      // return users.filter((e) => profileInfo.userActions.disLikes.includes(e.id))
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

  const handleAccept = item => {
    /**
     * 
     alert(item.id)
     */
    firebaseFireStore()
      .collection('users')
      .doc(firebaeAuth().currentUser.uid)
      .update({
        ...profileInfo,
        approach: profileInfo.approach.filter(e => e !== item.id),
      });
  };
  const Data = ({item, index}) => {
    return (
      <View
        style={styles.item}
        onPress={() => props.navigation.navigate('UserProfile', {data: item})}>
        <TouchableOpacity
          style={{
            marginLeft: -1,
            width: width * 0.7,
            height: height * 0.14,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // justifyContent:'center'
            alignItems: 'center',
            borderRadius: 5,
            // borderBottomColor:'#e91e63',
            // borderBottomWidth: 5
          }}>
          {item.image.length ? (
            <Image
              style={{
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
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: width * 0.2,
          }}>
          <TouchableOpacity
            onPress={() => handleAccept(item)}
            style={{
              width: width * 0.2,
              alignItems: 'center',
              justifyContent: 'center',
              height: height * 0.14,
              backgroundColor: '#00796b',
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Accept</Text>
            <Icon name="check" type="AntDesign" style={{color: '#fff'}} />
          </TouchableOpacity>
        </View>
      </View>
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
            onPress={() => props.navigation.goBack()}>
            <AntIcon
              name="arrowleft"
              style={{fontSize: height * 0.05, color: '#162842',}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{justifyContent: 'center', padding: 5}}
            onPress={() => props.navigation.navigate('Profile')}>
            {!profileInfo.image ? (
              <AntIcon name="user" style={{fontSize: height * 0.03, color:'#162842',}} />
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
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 125, 136, 0.6)',
          borderRadius: 10,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          //   onPress={() => setFilterUserType('Approach')}
          style={{
            width: width * 0.31,
            height: height * 0.06,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getConfirm('Approach') ? 'white' : null,
            borderRadius: getConfirm('Approach') ? 20 : 0,
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
            {data}
          </Text>
        </View>
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
    // borderBottomWidth: 5,
    // borderBottomColor: '#e91e63',
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
    fontSize: 16,

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
