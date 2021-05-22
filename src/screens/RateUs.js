import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
// Libraries import
import Svg, {Path} from 'react-native-svg';
// Components import
import {Divider, Rating, AirbnbRating} from 'react-native-elements';
// constants
const {height, width} = Dimensions.get('window');
export default function AboutUs(props) {
    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerShown: true,
            headerTitleAlign:'center',
            // headerTitle: '',
            headerStyle: {
              elevation:0,
              shadowOpacity:0
            }
        })
    }, [props.navigation])
  return (
    <View style={{height: height}}>
          {/* <View style={{backgroundColor:'#fff', height : height * 0.07,}}>
          <Text style={{fontSize: height * 0.04, fontWeight:'bold', marginLeft: width * 0.05}}>Rate Us</Text>
        </View> */}

    <ImageBackground source={require('../assets/grad.jpeg')} style={styles.centeredView}>
      <View style={styles.modalView}>
        <Image
          style={{
            width: width * 0.2,
            height: width * 0.2,
            margin: height * 0.01,
          }}
          resizeMode="stretch"
          source={require('../assets/hrtt.png')}
        />
        
        <Text style={[{...styles.modalText, fontSize: 20, fontWeight: 'bold'}]}>
          Enjoying Dating App?
        </Text>
        <Text style={{fontSize: 15}}>Tap a star to rate it on the</Text>
        <Text style={{fontSize: 15}}>App Store.</Text>
        <Divider
          style={{backgroundColor: 'black', height: 1, width: width * 0.8}}
        />

        <View style={{paddingVertical: 10}}>
          <AirbnbRating showRating={false} />
        </View>
        <Divider
          style={{backgroundColor: 'black', height: 1, width: width * 0.8}}
        />

        {/* <View style={{borderWidth:1,width: width * 0.9, borderColor:'gray'}}></View> */}
        <TouchableOpacity
          // style={{...styles.openButton, backgroundColor: '#2196F3'}}
          onPress={() => {
            props.navigation.goBack()
          }}>
          <Text
            style={[
              {
                ...styles.textStyle,
                color: '#000',
                fontSize: height * 0.024,
                paddingTop: height * 0.012,
              },
            ]}>
            Not Now
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  // rest of the styles
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    // change the color property for better output
    color: '#fff',
    textAlign: 'center',
    marginTop: 35,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});