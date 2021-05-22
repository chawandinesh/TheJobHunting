import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  ImageBackground,
  Animated,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import firebaseAuth from '@react-native-firebase/auth';
import firebaseFirestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Spinner} from 'native-base';
const {width, height} = Dimensions.get('window');
function Signup(props) {
  const [loading, setLoading] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    if (loading) {
      startShake();
    }
  }, [loading]);
  const [signupState, setSignupState] = useState({
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
  });

  const handleRegister = () => {
    const {email, password, confirmPassword, gender, userName} = signupState;
    if (!email || !password || !confirmPassword || !gender || !userName) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please fill all details',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    } else if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Passwords not matched',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    } else {
      setLoading(true);
      firebaseAuth()
        .createUserWithEmailAndPassword(signupState.email, signupState.password)
        .then(res => {
          setLoading(false);
          firebaseFirestore()
            .collection('users')
            .doc(firebaseAuth().currentUser.uid)
            .set({
              userName: signupState.userName,
              email: signupState.email,
              password: signupState.password,
              createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
              age: null,
              gender: signupState.gender,
              description: '',
              image: '',
              likes: [],
              disLikes: [],
              approach: [],
              height: '',
              complexion: '',
              caste: '',
              weight: '',
              interests: '',
              blocks: [],
              userActions: {
                likes: [],
                disLikes: [],
                approach: [],
              },
              is_active: true,
            })
            .then(result => {
              console.log(result);
            })
            .catch(error => {
              console.log(error, 'error..');
            });
        })
        .catch(err => {
          setLoading(false);
          if (err.code === 'auth/invalid-email') {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Invalid Email',
              text2: 'Please enter a valid email',
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
          if (err.code === 'auth/weak-password') {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Weak Password',
              text2: 'Please provide a strong password',
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
          if (err.code === 'auth/email-already-in-use') {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Email Already Registered',
              text2: 'Please provide a different mail id',
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
        });
    }
  };
  return (
    <KeyboardAwareScrollView>
      <ImageBackground
        blurRadius={loading ? 10 : 0}
        source={require('../assets/grad.jpeg')}
        style={{height: height, width}}>
        <View
          style={{
            height: height,
            width,
            backgroundColor: loading ? 'rgba(255,255,255,0.5)' : null,
          }}>
          <View
            style={{
              width,
              height: height * 0.08,
              // backgroundColor: 'pink',
              alignContent: 'center',
              marginTop: height * 0.045,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                padding: 5,
                color: '#162842',
                alignSelf: 'flex-start',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 35,
              }}>
              Sign Up
            </Text>
          </View>
          <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
            <View
              style={{
                marginTop: 10,
                width: width * 0.97,
                height: height * 0.06,
                // backgroundColor: 'white',
                alignSelf: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#162842',
                }}>
                Already have an account?
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: 26,
                  color: '#00796b',
                  textDecorationLine: 'underline',
                }}>
                LogIn
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              marginTop: height * 0.01,
              width: width * 0.85,
              height: height * 0.6,
              // backgroundColor: '#4D4D4D',
              alignSelf: 'center',
              // borderTopColor: '#e91e63',
              // borderTopWidth: 10,
              // borderBottomColor: '#e91e63',
              // borderBottomWidth: 10,
            }}>
            <View
              style={{
                marginTop: 20,
                width: width * 0.8,
                height: height * 0.09,
                backgroundColor: '#162842',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#00796b',
                shadowOffset: {width: 3, height: 3},
                shadowOpacity: 3,
                elevation: 3,
                borderRadius: 2,
              }}>
              <TextInput
                style={{
                  marginTop: 1,
                  alignSelf: 'center',
                  width: width * 0.79,
                  height: height * 0.085,
                  borderBottomColor: '#00796b',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderBottomWidth: 2,
                  borderRadius: 2,
                  fontSize: 20,
                }}
                placeholder="Enter Your Email"
                onChangeText={text =>
                  setSignupState({...signupState, email: text})
                }
                value={signupState.email}
                placeholderTextColor="black"
              />
            </View>
            <View
              style={{
                marginTop: 20,
                width: width * 0.8,
                height: height * 0.09,
                backgroundColor: '#162842',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#00796b',
                shadowOffset: {width: 3, height: 3},
                shadowOpacity: 3,
                elevation: 3,
                borderRadius: 2,
              }}>
              <TextInput
                style={{
                  marginTop: 1,
                  alignSelf: 'center',
                  width: width * 0.79,
                  height: height * 0.085,
                  borderBottomColor: '#00796b',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderBottomWidth: 2,
                  borderRadius: 2,
                  fontSize: 20,
                }}
                onChangeText={text =>
                  setSignupState({...signupState, userName: text})
                }
                value={signupState.userName}
                placeholder="Username"
                placeholderTextColor="black"
              />
            </View>
            {loading ? (
              <Animated.View
                style={{
                  transform: [{translateX: shakeAnimation}],
                  position: 'absolute',
                  top: height * 0.3,
                  left: width * 0.3,
                  zIndex: 10,
                }}>
                <Image
                  source={require('../assets/hrtt.png')}
                  style={{height: height * 0.12, width: height * 0.13}}
                />
              </Animated.View>
            ) : null}
            <View
              style={{
                marginTop: 20,
                width: width * 0.8,
                height: height * 0.09,
                backgroundColor: '#162842',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#00796b',
                shadowOffset: {width: 3, height: 3},
                shadowOpacity: 3,
                elevation: 3,
                borderRadius: 2,
              }}>
              <TextInput
                style={{
                  marginTop: 1,
                  alignSelf: 'center',
                  width: width * 0.79,
                  height: height * 0.085,
                  borderBottomColor: '#00796b',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderBottomWidth: 2,
                  borderRadius: 2,
                  fontSize: 20,
                }}
                onChangeText={text =>
                  setSignupState({...signupState, password: text})
                }
                value={signupState.password}
                placeholder="Enter Your Password"
                placeholderTextColor="black"
              />
            </View>
            <View
              style={{
                marginTop: 20,
                width: width * 0.8,
                height: height * 0.09,
                backgroundColor: '#162842',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#00796b',
                shadowOffset: {width: 3, height: 3},
                shadowOpacity: 3,
                elevation: 3,
                borderRadius: 2,
              }}>
              <TextInput
                style={{
                  marginTop: 1,
                  alignSelf: 'center',
                  width: width * 0.79,
                  height: height * 0.085,
                  borderBottomColor: '#00796b',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderBottomWidth: 2,
                  borderRadius: 2,
                  fontSize: 20,
                }}
                onChangeText={text =>
                  setSignupState({...signupState, confirmPassword: text})
                }
                value={signupState.confirmPassword}
                placeholder="Repeat Password"
                placeholderTextColor="black"
              />
            </View>
            <View
              style={{
                marginTop: 20,
                width: width * 0.9,
                height: height * 0.07,
                alignSelf: 'center',
                flexDirection: 'row',
                // backgroundColor:'yellow',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  padding: 10,
                  width: width * 0.32,
                  height: height * 0.07,
                  textAlign: 'center',
                  alignItems: 'center',
                  color: '#00796b',
                  fontWeight: 'bold',
                  fontSize: 25,
                  // backgroundColor:'pink'
                }}>
                Recruiter
              </Text>
              <TouchableOpacity
                onPress={() => setSignupState({...signupState, gender: 'male'})}
                style={{
                  marginLeft: 5,
                  width: width * 0.09,
                  height: height * 0.043,
                  backgroundColor: 'rgba(0, 121, 107, 0.2)',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#162842',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                {signupState.gender === 'male' ? (
                  <Icon type="FontAwesome" name="check" />
                ) : null}
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 5,
                  padding: 10,
                  width: width * 0.35,
                  height: height * 0.07,
                  // backgroundColor: 'white',
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: '#00796b',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}>
                job seeker
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setSignupState({...signupState, gender: 'female'})
                }
                style={{
                  marginLeft: 10,
                  width: width * 0.09,
                  height: height * 0.043,
                  backgroundColor: 'rgba(0, 121, 107, 0.2)',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#162842',
                  alignSelf: 'center',
                }}>
                {signupState.gender === 'female' ? (
                  <Icon type="FontAwesome" name="check" />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              padding: 5,
              marginTop: 10,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              width: width * 0.9,
              height: height * 0.09,
              //    backgroundColor: 'pink',
              //   flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => handleRegister()}
              style={{
                //   marginLeft: 1,
                padding: 10,
                backgroundColor: '#162842',
                height: height * 0.07,
                width: width * 0.85,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: height * 0.04,
                shadowColor: 'black',
                shadowOpacity: 3,
                shadowOffset: {width: 3, height: 4},
                elevation: 3,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: height * 0.03,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                SIGN UP
              </Text>
            </TouchableOpacity>
          </View>
          <Toast ref={ref => Toast.setRef(ref)} />
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
    // </SafeAreaView>
  );
}
export default Signup;
