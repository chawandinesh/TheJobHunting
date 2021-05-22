import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  ImageBackground,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Button,
  Animated,
  Image,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import firebaseAuth from '@react-native-firebase/auth';
import {DatingAppContext} from '../context/Context';

const {width, height} = Dimensions.get('window');
function LoginPage(props) {
  const [loading, setLoading] = useState(false);
  const {state, setState} = useContext(DatingAppContext);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [shakeAnimation] = useState(new Animated.Value(0));

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    if (loading) {
      startShake();
    }
  }, [loading]);

  const handleLogin = () => {
    const {email, password} = loginInfo;
    if (!email || !password) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please enter email and password',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    } else {
      setLoading(true);
      firebaseAuth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          setLoading(false);
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          if (err.code === 'auth/invalid-email') {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Invalid Email',
              // text2: 'Please provide a different mail id',
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
          if (err.code === 'auth/user-not-found') {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'User Not found',
              // text2: 'Please provide a different mail id',
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
          if (err.code === 'auth/wrong-password') {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Wrong password',
              // text2: 'Please provide a different mail id',
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
    // <SafeAreaView style={{flex: 1}}>
    <KeyboardAwareScrollView>
      <ImageBackground
        source={require('../assets/grad.jpeg')}
        style={{height: height, width: width}}>
        <View
          style={{
            width,
            height: height * 0.07,
            //  backgroundColor: 'white',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.044,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              padding: 5,
              color: 'black',
              alignSelf: 'flex-start',
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: 35,
              color: '#162842',
              // backgroundColor:'pink'
            }}>
            Login
          </Text>
        </View>
        <View
          style={{
            marginTop: height * 0.015,
            width: width * 0.8,
            height: height * 0.24,
            // backgroundColor: 'pink',
            alignSelf: 'center',
            justifyContent: 'center',
            shadowColor: '#4D4D4D',
            shadowOffset: {width: 6, height: 6},
            shadowOpacity: 7,
            elevation: 3,
          }}>
          <Animated.View
            style={{
              transform: [{translateX: shakeAnimation}],
            }}>
            <Image
              source={require('../assets/bagss.png')}
              style={{
                width: width * 0.56,
                height: height * 0.25,
                alignSelf: 'center',
              }}
            />
          </Animated.View>
        </View>
        <View
          style={{
            marginTop: 30,
            width: width * 0.85,
            height: height * 0.34,
            // backgroundColor: '#4D4D4D',
            alignSelf: 'center',
            borderTopColor: 'black',
            alignItems: 'center',
            // justifyContent:'center',
            // borderTopWidth: 10,
            // borderTopColor: '#e91e63',
            // borderBottomColor: '#e91e63',
            // borderBottomWidth: 10,
          }}>
          <View
            style={{
              marginTop: 10,
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
                // borderBottomColor: '#F0F4',
                borderBottomColor: '#00796b',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderBottomWidth: 2,
                borderRadius: 2,
                fontSize: 20,
              }}
              onChangeText={text => setLoginInfo({...loginInfo, email: text})}
              value={loginInfo.email}
              placeholder="Enter Your Email"
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
              secureTextEntry
              style={{
                marginTop: 1,
                alignSelf: 'center',
                width: width * 0.79,
                height: height * 0.085,
                // borderBottomColor: '#F0F4',
                borderBottomColor: '#00796b',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderBottomWidth: 2,
                borderRadius: 2,
                fontSize: 20,
              }}
              onChangeText={text =>
                setLoginInfo({...loginInfo, password: text})
              }
              value={loginInfo.password}
              placeholder="Enter Your Password"
              placeholderTextColor="black"
            />
          </View>
          <View
            style={{
              marginTop: 10,
              width: width * 0.8,
              height: height * 0.08,
              alignSelf: 'center',
              alignItems: 'center',
              //  backgroundColor:'pink',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                width: width * 0.47,
                height: height * 0.03,
                // textAlign: 'center',
                alignContent: 'center',
                alignItems: 'center',
                //  backgroundColor:'yellow',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#162842',
              }}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}>
              <Text
                style={{
                  width: width * 0.3,
                  height: height * 0.047,
                  textAlign: 'center',
                  // backgroundColor:'yellow',
                  fontSize: 27,
                  fontWeight: 'bold',
                  color: '#00796b',
                  textDecorationLine: 'underline',
                }}>
                Sign Up
              </Text>
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
            onPress={() => handleLogin()}
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
              shadowOffset: {width: 3, height: 3},
              elevation: 3,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: height * 0.03,
                fontWeight: 'bold',
                color: 'white',
              }}>
              LOG IN
            </Text>
          </TouchableOpacity>
        </View>
        <Toast ref={ref => Toast.setRef(ref)} />
      </ImageBackground>
    </KeyboardAwareScrollView>
    // </SafeAreaView>
  );
}
export default LoginPage;
