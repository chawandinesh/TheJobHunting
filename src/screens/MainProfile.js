import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ImageBackground,
  Alert,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import firebaseFireStore from '@react-native-firebase/firestore';
import firebaseStorage from '@react-native-firebase/storage'
import firebaseAuth from '@react-native-firebase/auth';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {DatingAppContext} from '../context/Context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Spinner} from 'native-base';
const {height, width} = Dimensions.get('window');

function MainProfile(props) {
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  console.log(user, 'from main');
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
        console.log(resSnap,'ressnap')
        setUser({...user, image: resSnap});
      });
    };

    const taskError = snapshot => {
      setLoading(false);
    };
    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  console.log(user.image)
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

  // const uploadDocuments = () => {

  // }

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
  return (
    <KeyboardAwareScrollView>
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
            <View
              style={{
                marginTop: height * 0.07,
                width: width * 1,
                height: height * 0.06,
                alignItems: 'center',
                flexDirection: 'row',
                //   backgroundColor: 'pink',
              }}>
              <View>
                <TouchableOpacity
                  style={{justifyContent: 'center', padding: 5}}
                  onPress={() => props.navigation.goBack()}>
                  <AntIcon
                    name="arrowleft"
                    style={{fontSize: height * 0.05, color: 'white'}}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // backgroundColor: 'orange',
                  width: width * 0.75,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: height * 0.03,
                    fontWeight: 'bold',
                    color: 'white',
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
                    style={{color: '#162842', color: 'white'}}
                    type="AntDesign"
                    fontSize={height * 0.04}
                  />
                ) : (
                  <Icon
                    name="edit"
                    style={{color: '#162842', color: 'white'}}
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
                //   backgroundColor: 'yellow',
                // justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => pickImage()}
                style={{
                  width: width * 0.37,
                  height: height * 0.16,
                  // backgroundColor: 'pink',
                  borderRadius: 100,
                  borderWidth: 4,
                  borderColor: 'white',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Image
                  style={{
                    width: width * 0.28,
                    height: height * 0.13,
                    alignSelf: 'center',
                  }}
                  source={require('../assets/prf.png')}
                /> */}
                 {user.image ? (
                <View>
                  <Image
                    source={{uri: user.image}}
                    style={{
                      width: width * 0.37,
                  height: height * 0.16,
                  // backgroundColor: 'pink',
                  borderRadius: 100,
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
                      user.gender === 'jobSeeker'
                        ? require('../assets/jobseeker.png')
                        : require('../assets/rec.png')
                    }
                  />
                </View>
              )}
              </TouchableOpacity>
              <View
                style={{
                  width: width * 0.55,
                  height: height * 0.17,
                  // backgroundColor: 'green',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginTop: 5,
                    width: width * 0.53,
                    height: height * 0.04,
                    //   backgroundColor: 'orange',
                    fontSize: height * 0.03,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#fbc02d',
                  }}>
                  Applicant Name :
                </Text>
                {editable ? (
                  <TextInput
                    placeholder="enter user name"
                    value={user.userName}
                    onChangeText={text => setUser({...user, userName: text})}
                    style={{
                      textAlign: 'center',
                      fontSize: height * 0.03,
                      fontWeight: 'bold',
                      color: '#fff',
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      marginTop: 5,
                      width: width * 0.53,
                      height: height * 0.06,
                      //   backgroundColor: 'orange',
                      fontSize: height * 0.03,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {user.userName}
                  </Text>
                )}
                <TouchableOpacity
                  style={{
                    padding: 4,
                    marginTop: 5,
                    width: width * 0.45,
                    height: height * 0.05,
                    backgroundColor: 'orange',
                    borderRadius: 10,
                    borderWidth: 2,
                  }}
                  onPress={() => handleSubmit()}>
                  <Text
                    style={{
                      fontSize: height * 0.03,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: 'white',
                      borderRadius: 2,
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 15,
              width: width * 1,
              height: height * 0.13,
              backgroundColor: 'rgba(0, 125, 136, 0.4)',
              borderRadius: 20,
              alignSelf: 'center',
              flexDirection: 'column',
            }}>
            <Text
              style={{
                marginTop: 2,
                marginLeft: height * 0.02,
                width: width * 0.45,
                height: height * 0.035,
                backgroundColor: 'rgba(139, 195, 74, 0.3)',
                fontSize: height * 0.03,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#162842',
                borderRadius: 3,
                borderWidth: 0.5,
              }}>
              Qualification :
            </Text>
            {editable ? (
              <TextInput
                onChangeText={text => setUser({...user, qualification: text})}
                value={user.qualification}
                style={{
                  marginTop: 8,
                  width: width * 0.95,
                  height: height * 0.06,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
                placeholder="Enter your qualification"
                placeholderTextColor="black"
              />
            ) : (
              <Text
                style={{
                  marginTop: 5,
                  width: width * 0.53,
                  height: height * 0.06,
                  //   backgroundColor: 'orange',
                  fontSize: height * 0.03,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                }}>
                {user.qualification}
              </Text>
            )}
          </View>
          <View
            style={{
              marginTop: -12,
              width: width * 1,
              height: height * 0.13,
              backgroundColor: 'rgba(139, 195, 74, 0.5)',
              borderRadius: 20,
              alignSelf: 'center',
              flexDirection: 'column',
            }}>
            <Text
              style={{
                marginTop: 2,
                marginLeft: height * 0.02,
                width: width * 0.45,
                height: height * 0.035,
                backgroundColor: 'rgba(0, 125, 136, 0.4)',
                fontSize: height * 0.03,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#162842',
                borderRadius: 3,
                borderWidth: 0.5,
              }}>
              Experience :
            </Text>
            {editable ? (
              <TextInput
                onChangeText={text => setUser({...user, experience: text})}
                value={user.experience}
                style={{
                  marginTop: 8,
                  width: width * 0.95,
                  height: height * 0.06,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
                placeholder="Enter your experience"
                placeholderTextColor="black"
              />
            ) : (
              <Text
                style={{
                  marginTop: 5,
                  width: width * 0.53,
                  height: height * 0.06,
                  //   backgroundColor: 'orange',
                  fontSize: height * 0.03,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                }}>
                {user.experience}
              </Text>
            )}
          </View>
          <View
            style={{
              marginTop: -12,
              width: width * 1,
              height: height * 0.13,
              backgroundColor: 'rgba(0, 125, 136, 0.4)',
              borderRadius: 20,
              alignSelf: 'center',
              flexDirection: 'column',
            }}>
            <Text
              style={{
                marginTop: 2,
                marginLeft: height * 0.02,
                width: width * 0.63,
                height: height * 0.035,
                backgroundColor: 'rgba(139, 195, 74, 0.3)',
                fontSize: height * 0.03,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#162842',
                borderRadius: 3,
                borderWidth: 0.5,
              }}>
              Currency Company :
            </Text>
            {editable ? (
              <TextInput
                onChangeText={text => setUser({...user, currentCompany: text})}
                value={user.currentCompany}
                style={{
                  marginTop: 8,
                  width: width * 0.95,
                  height: height * 0.06,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
                placeholder="Enter current company"
                placeholderTextColor="black"
              />
            ) : (
              <Text
                style={{
                  marginTop: 5,
                  width: width * 0.53,
                  height: height * 0.06,
                  //   backgroundColor: 'orange',
                  fontSize: height * 0.03,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                }}>
                {user.currentCompany}
              </Text>
            )}
          </View>
          <View
            style={{
              marginTop: -12,
              width: width * 1,
              height: height * 0.13,
              backgroundColor: 'rgba(139, 195, 74, 0.5)',
              borderRadius: 20,
              alignSelf: 'center',
              flexDirection: 'column',
            }}>
            <Text
              style={{
                marginTop: 2,
                marginLeft: height * 0.02,
                width: width * 0.45,
                height: height * 0.035,
                backgroundColor: 'rgba(0, 125, 136, 0.4)',
                fontSize: height * 0.03,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#162842',
                borderRadius: 3,
                borderWidth: 0.5,
              }}>
              Certification :
            </Text>
            {editable ? (
              <TextInput
                value={user.certification}
                onChangeText={text => setUser({...user, certification: text})}
                style={{
                  marginTop: 8,
                  width: width * 0.95,
                  height: height * 0.06,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
                placeholder="enter certification"
                placeholderTextColor="black"
              />
            ) : (
              <Text
                style={{
                  marginTop: 5,
                  width: width * 0.53,
                  height: height * 0.06,
                  //   backgroundColor: 'orange',
                  fontSize: height * 0.03,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                }}>
                {user.certification}
              </Text>
            )}
          </View>
          <View
            style={{
              width: width * 1,
              height: height * 0.07,
              backgroundColor: 'rgba(0, 125, 136, 0.4)',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <View
              style={{
                width: width * 1,
                height: height * 0.06,
                alignItems: 'center',
                flexDirection: 'row',
                //   backgroundColor: 'pink',
              }}>
              <View
                style={{
                  // backgroundColor: 'pink',
                  width: width * 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: height * 0.03,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Attached your files
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{justifyContent: 'center', padding: 5}}
                  onPress={() => props.navigation.navigate('')}>
                  <EntypoIcon
                    name="attachment"
                    style={{fontSize: height * 0.05, color: 'black'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 5,
              width: width * 0.95,
              height: height * 0.1,
              //   backgroundColor: 'yellow',
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
                Applied
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
                Accepted
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
        </KeyboardAwareScrollView>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}

export default MainProfile;
