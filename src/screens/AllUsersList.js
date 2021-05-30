import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ImageBackground,
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import firebaseFirestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';
const {height, width} = Dimensions.get('window');

const Details = props => {
  const isFocused = useIsFocused();
  const control = async () => {};
  const [loggedInUser, setLoggedInUser] = useState({});
  const [users, setUsers] = useState([]);
  /**
   * all users  and login user
   */
  const getAsyncData = () => {
    try {
      firebaseFirestore()
        .collection('users')
        .onSnapshot(querySnap => {
          let usersList = [];
          querySnap.forEach(docSnap => {
            usersList.push({...docSnap.data(), id: docSnap.id});
          });
          setUsers(usersList);
        });
      firebaseFirestore()
        .collection('users')
        .doc(firebaseAuth().currentUser.uid)
        .get()
        .then(docSnap => {
          setLoggedInUser({...docSnap.data(), id: docSnap.id});
        });
    } catch (err) {
      // alert(err)
    }
  };
  /**
   * use effect
   */
  useEffect(() => {
    control();
    getAsyncData();
  }, [isFocused, props]);

  const getImage = type => {
    switch (type) {
      case "recruiter":
        return (
          <Image
            style={{
              height: height * 0.095,
              width: height * 0.095,
              borderWidth: 2,
              borderRadius: height * 0.05,
            }}
            source={require('../assets/rec.png')}
          />
        );

      case 'jobSeeker':
        return (
          <Image
            style={{
              height: height * 0.1,
              width: height * 0.1,
              borderWidth: 2,
              borderRadius: height * 0.05,
            }}
            source={require('../assets/jobseeker.png')}
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
            height: height * 0.195,
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
              {getImage(item.type)}
            </View>
          )}
          {/* </View> */}

          <View style={styles.viewType}>
            <Text style={styles.info}>Name:</Text>
            <View style={styles.line}></View>
            <Text style={styles.title}>{item.userName}</Text>
            <Text style={styles.info}>Qualification:</Text>
            <View style={styles.line}></View>
            <Text style={styles.ageType}>{item.qualification}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // useEffect(() => {
  //   effect
  //   return () => {
  //     cleanup
  //   }
  // }, [props])

  // console.log(loggedInUser, users,'users')
  console.log( users
    .filter(e => e.id !== loggedInUser.id)
    .filter(
      e =>
        loggedInUser &&
        Array.isArray(loggedInUser.blocks) &&
        !loggedInUser.blocks.includes(e.id),
    ))

  // console.log( users.filter((e) => loggedInUser  && Array.isArray(loggedInUser.blocks) && !loggedInUser.blocks.includes(e.id) ) ,'loginuser')
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
          flexDirection: 'row',
        }}>
        <View>
          <TouchableOpacity
            style={{justifyContent: 'center', padding: 5}}
            onPress={() => props.navigation.openDrawer()}>
            <AntIcon name="bars" style={{fontSize: height * 0.05, color:'#162842',}} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: width * 0.8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: height * 0.03,
              fontWeight: 'bold',
              color: '#162842',
            }}>
            All Users
          </Text>
        </View>
      </View>
      <View style={{height: height * 0.85}}>
        {users.length &&
        users
          .filter(e => e.id !== loggedInUser.id)
          .filter(
            e =>
              loggedInUser &&
              Array.isArray(loggedInUser.blocks) &&
              !loggedInUser.blocks.includes(e.id),
          ).length ? (
          <FlatList
            data={
              users.length &&
              users
                .filter(e => e.id !== loggedInUser.id)
                .filter(
                  e =>
                    loggedInUser &&
                    Array.isArray(loggedInUser.blocks) &&
                    !loggedInUser.blocks.includes(e.id),
                )
            }
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
    height: height * 0.2,
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
    width: width * 0.56,
    height: height * 0.04,
    fontSize: 16,
    textAlign: 'center',
    color: 'green',
  },
  viewType: {
    marginLeft: 5,
    // backgroundColor: 'white',
    width: width * 0.54,
    height: height * 0.14,
  },
  info: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 1,
    color: '#162842',
  },
  line: {
    width: width * 0.55,
    height: height * 0.003,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  ageType: {
    marginTop: 1,
    // backgroundColor: 'pink',
    width: width * 0.56,
    height: height * 0.04,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Details;
