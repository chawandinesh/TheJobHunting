import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ImageBackground,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import firebaseFireStore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import firebaseAuth from '@react-native-firebase/auth';
import firebaseStorage from '@react-native-firebase/storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Spinner} from 'native-base';
const {height, width} = Dimensions.get('window');

function ProfilePage(props) {
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    firebaseFireStore()
      .collection('users')
      .doc(firebaseAuth().currentUser.uid)
      .onSnapshot(e => {
        setUser({...e.data(), id: e.id});
      });
  }, [editable]);

  const uploadImage = async uri => {
    const uploadUri = uri.path;
    const response = await fetch(uploadUri);
    const childPath = `photos/${firebaseAuth().currentUser.uid}/profile`;
    const blob = await response.blob();
    // const task = firebaseStorage().ref().child(childPath).delete()
    const task = firebaseStorage().ref().child(childPath).put(blob);
    const taskProgress = snapshot => {
      setLoading(true);
    };
    const taskCompleted = () => {
      setLoading(false);
      task.snapshot.ref.getDownloadURL().then(resSnap => {
        setUser({...user, image: resSnap});
      });
    };

    const taskError = snapshot => {
      setLoading(false);
    };
    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        uploadImage(image);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    setLoading(true);
    firebaseFireStore()
      .collection('users')
      .doc(firebaseAuth().currentUser.uid)
      .update(user)
      .then(res => {
        setLoading(false);
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'Ok',
            onPress: () => setEditable(false),
            style: 'cancel',
          },
        ]);
      })
      .catch(err => {
        // Alert("Failed", "profile updation failed",  [
        //   { text: "OK", onPress: () => console.log("OK Pressed") }
        // ])
      });
  };

  // imag
  return (
    <ImageBackground
      source={require('../assets/grad.jpeg')}
      style={{height, width}}>
      <KeyboardAwareScrollView>
        <View
          style={{
            marginTop: -20,
            width,
            height: height * 0.32,
            backgroundColor: 'rgba(0, 125, 136, 0.6)',
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            shadowColor: '#162842',
            shadowOffset: {height: 10},
            shadowOpacity: 5,
            elevation: 3,
          }}>
          {loading ? (
            <View
              style={{
                backgroundColor: 'rgba(0,0,0)',
                zIndex: 4,
                position: 'absolute',
                top: height * 0.4,
                left: width * 0.3,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Spinner
                style={{color: '#fff'}}
                color="#fff"
                size={height * 0.2}
              />
            </View>
          ) : null}

          <View
            style={{
              marginTop: height * 0.07,
              width: width * 1,
              height: height * 0.06,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View>
              <TouchableOpacity
                style={{justifyContent: 'center', padding: 5}}
                onPress={() => props.navigation.goBack()}>
                <AntIcon
                  name="arrowleft"
                  style={{fontSize: height * 0.05, color: '#162842'}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                // backgroundColor: 'pink',
                width: width * 0.73,
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
                Details
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setEditable(!editable);
              }}>
              {editable ? (
                <Icon
                  name="close"
                  style={{color: '#162842'}}
                  type="AntDesign"
                  fontSize={height * 0.04}
                />
              ) : (
                <Icon
                  name="edit"
                  style={{color: '#162842'}}
                  type="AntDesign"
                  fontSize={height * 0.04}
                />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: width * 0.95,
              height: height * 0.17,
              backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: width * 0.38,
                height: height * 0.17,
                //   backgroundColor: 'pink',
                borderRadius: height * 0.03,
                borderWidth: 4,
                borderColor: 'white',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {editable ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 0,
                    zIndex: 3,
                  }}>
                  <Icon
                    name="edit"
                    type="FontAwesome"
                    style={{fontSize: height * 0.04, color: '#fff'}}
                  />
                </View>
              ) : null}
              {user.image ? (
                <View>
                  <Image
                    source={{uri: user.image}}
                    style={{
                      width: width * 0.38,
                      height: height * 0.17,
                      borderRadius: height * 0.03,
                    }}
                  />
                </View>
              ) : (
                <View>
                  <Image
                    style={{
                      width: width * 0.28,
                      height: height * 0.13,
                      alignSelf: 'center',
                    }}
                    source={
                      user.gender === 'male'
                        ? require('../assets/prf.png')
                        : require('../assets/fml.png')
                    }
                  />
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              marginTop: 8,
              width: width * 0.85,
              height: height * 0.04,
              // backgroundColor: 'pink',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {editable ? (
              <TextInput
                value={user.userName}
                onChangeText={text => setUser({...user, userName: text})}
                style={{
                  width: width * 0.5,
                  height: height * 0.05,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                }}
              />
            ) : (
              <Text
                style={{
                  width: width * 0.8,
                  height: height * 0.05,
                  //    backgroundColor: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 30,
                  color: '#fdd',
                }}>
                {user.userName}
              </Text>
            )}
          </View>
          <View
            style={{
              marginTop: 10,
              width: width * 0.89,
              height: height * 0.08,
              backgroundColor: 'pink',
              alignSelf: 'center',
            }}>
            {editable ? (
              <TextInput
                placeholder="enter description"
                numberOfLines={3}
                multiline
                placeholder="Add your details, likes,dislikes. etc,."
                value={user.description}
                onChangeText={text => setUser({...user, description: text})}
                style={{
                  width: width * 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: height * 0.07,
                  borderRadius: height * 0.02,
                  alignSelf: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
              />
            ) : (
              <Text
                style={{
                  width: width * 0.89,
                  height: height * 0.08,
                  // backgroundColor: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#234',
                  // color: 'green',
                }}>
                {user.description}
              </Text>
            )}
          </View>
          {/* <View
            style={{
              marginTop: 5,
              width: width * 0.98,
              height: height * 0.08,
              // backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ReceivedRequests', {data: "Approach"})}
              style={{
                marginLeft: 2,
                width: width * 0.32,
                height: height * 0.07,
                backgroundColor: 'rgba(220, 231, 117, 0.3)',
                borderWidth: 3,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: width * 0.32,
                  height: height * 0.04,
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Approach
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ReceivedRequests', {data: "Shortlist"})}
              style={{
                marginLeft: 2,
                width: width * 0.32,
                height: height * 0.07,
                backgroundColor: 'rgba(220, 231, 117, 0.3)',
                borderWidth: 3,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: width * 0.32,
                  height: height * 0.04,
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Shortlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ReceivedRequests', {data: "Rejected"})}
              style={{
                marginLeft: 2,
                width: width * 0.32,
                height: height * 0.07,
                backgroundColor: 'rgba(220, 231, 117, 0.3)',
                borderWidth: 3,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: width * 0.32,
                  height: height * 0.04,
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Rejected
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View
          style={{
            marginTop: 5,
            width: width * 0.95,
            height: height * 0.55,
            // backgroundColor: 'rgba(220, 231, 117, 0.3)',
            alignSelf: 'center',
            alignItems: 'center',
            // borderWidth: 3,
            borderRadius: 10,
          }}>
          <View
            style={{
              marginTop: 5,
              width: width * 0.9,
              height: height * 0.2,
              //  backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: 'rgba(0, 125, 136, 0.8)',
              shadowOffset: {width: 2, height: 5},
              shadowOpacity: 3,
              elevation: 3,
            }}>
            <View style={{backgroundColor: '#162842', padding: 5}}>
              <View
                style={{
                  // marginLeft: 7,
                  width: width * 0.42,
                  justifyContent: 'center',
                  height: height * 0.12,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 10,
                  // borderWidth: 3,
                  alignItems: 'center',
                  borderBottomColor: '#00796b',
                  borderBottomWidth: 2,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    height: height * 0.04,
                    fontSize: 19,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    textAlign: 'center',
                    // backgroundColor: 'white',
                  }}>
                  Qualification
                </Text>
                {editable ? (
                  <TextInput
                    value={user.age}
                    onChangeText={text => setUser({...user, age: text})}
                    style={{
                      width: width * 0.3,
                      height: height * 0.06,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      marginTop: 3,
                      width: width * 0.4,
                      height: height * 0.035,
                      fontSize: 25,
                      fontWeight: 'bold',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    {user.age}
                  </Text>
                )}
              </View>
            </View>
            <View style={{backgroundColor: '#162842', padding: 5}}>
              <View style={style.cardA}>
                <Text
                  style={{
                    width: width * 0.4,
                    height: height * 0.04,
                    fontSize: 19,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  Experience
                </Text>
                {editable ? (
                  <TextInput
                    value={user.caste}
                    onChangeText={text => setUser({...user, caste: text})}
                    style={{
                      width: width * 0.3,
                      height: height * 0.06,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      marginTop: 3,
                      width: width * 0.4,
                      height: height * 0.035,
                      fontSize: 25,
                      fontWeight: 'bold',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    {user.caste}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 5,
              width: width * 0.9,
              height: height * 0.11,
              // backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: 'rgba(0, 125, 136, 0.8)',
              shadowOffset: {width: 2, height: 5},
              shadowOpacity: 3,
              elevation: 3,
            }}>
            <View style={style.cardbg}>
              <View style={style.cardA}>
                <Text
                  style={{
                    width: width * 0.4,
                    height: height * 0.04,
                    fontSize: 16,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    textAlign: 'center',
                    // backgroundColor: 'white',
                  }}>
                  Currency Company
                </Text>
                {editable ? (
                  <TextInput
                    value={user.height}
                    onChangeText={text => setUser({...user, height: text})}
                    style={{
                      width: width * 0.3,
                      height: height * 0.06,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      marginTop: 3,
                      width: width * 0.4,
                      height: height * 0.035,
                      fontSize: 25,
                      fontWeight: 'bold',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    {user.height}
                  </Text>
                )}
              </View>
            </View>
            {/* <View></View> */}
            <View style={style.cardbg}>
              <View style={style.cardA}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: '#000',
                    height: height * 0.04,
                    fontSize: 19,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  Certification
                </Text>
                {editable ? (
                  <TextInput
                    value={user.weight}
                    onChangeText={text => setUser({...user, weight: text})}
                    style={{
                      width: width * 0.3,
                      height: height * 0.06,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      marginTop: 3,
                      width: width * 0.4,
                      height: height * 0.035,
                      fontSize: 25,
                      fontWeight: 'bold',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    {user.weight}
                  </Text>
                )}
              </View>
            </View>
          </View>
          {editable ? (
            <View
              style={{
                width: width,
                paddingTop: height * 0.02,
                height: height * 0.07,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={{
                  height: height * 0.07,
                  width: width * 0.4,
                  // borderWidth: 3,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#162842',
                }}>
                <Text
                  style={{
                    fontSize: height * 0.024,
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity></TouchableOpacity> */}
            </View>
          ) : null}
          <View
            style={{
              marginTop: 5,
              width: width * 0.95,
              height: height * 0.15,
              // backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('ReceivedRequests', {
                  data: 'Approach',
                })
              }
              style={{
                marginLeft: 2,
                width: width * 0.28,
                height: height * 0.07,
                backgroundColor: '#162842',
                // borderWidth: 3,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                shadowRadius: 4,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: width * 0.32,
                  height: height * 0.04,
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Approach
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('ReceivedRequests', {
                  data: 'Shortlist',
                })
              }
              style={{
                marginLeft: 2,
                width: width * 0.28,
                height: height * 0.07,
                backgroundColor: '#162842',
                // borderWidth: 3,
                elevation: 3,
                shadowColor: 'rgba(0, 125, 136, 0.2)',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                shadowRadius: 4,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: width * 0.32,
                  height: height * 0.04,
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Shortlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('ReceivedRequests', {
                  data: 'Rejected',
                })
              }
              style={{
                marginLeft: 2,
                width: width * 0.28,
                height: height * 0.07,
                backgroundColor: '#162842',
                // borderWidth: 3,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                shadowRadius: 4,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: width * 0.32,
                  height: height * 0.04,
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Rejected
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  cardbg: {backgroundColor: '#162842', padding: 5},
  cardA: {
    // marginLeft: 7,
    width: width * 0.42,
    justifyContent: 'center',
    height: height * 0.12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    // borderWidth: 3,
    alignItems: 'center',
    borderBottomColor: '#00796b',
    borderBottomWidth: 2,
  },
});
export default ProfilePage;
