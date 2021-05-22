import { Icon } from 'native-base';
import React from 'react';
import {View, Text, ImageBackground,TouchableOpacity, Dimensions, FlatList} from 'react-native';

const {height, width} = Dimensions.get('window');
export default function AllDetails(props) {
  //   const {categoryItem} = props.route.params;
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: 'About Us',
      headerStyle: {backgroundColor: '#96DBFC'},
      headerTintColor: '#000',
    });
  }, [props.navigation]);

  return (
    <ImageBackground
      style={{width, height, alignItems: 'center', justifyContent: 'center'}}
      source={require('../assets/grad.jpeg')}>
          <TouchableOpacity onPress={() => props.navigation.openDrawer()} style={{position:'absolute', top: 25,left:20}}>
              <Icon name="menu" type="Entypo" style={{color:'#fff'}}/>
          </TouchableOpacity>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.7,
          alignItems: 'center',
          padding: height * 0.02,
          //   justifyContent:'center',
        //   backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <Text
          style={{fontSize: height * 0.04, fontWeight: 'bold', color: '#fff', marginBottom: height * 0.05}}>
          About Us
        </Text>

        <Text
          style={{
            fontSize: height * 0.03,
            fontWeight: 'bold',
            color: '#ebe459',
            textAlign: 'center',
          }}>
          This is simple, amazing and ads free app for functions to help you to find your match.
        </Text>
        <Text
          style={{
            fontSize: height * 0.03,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            paddingTop: height * 0.04,
          }}>
          In this app, You will get the details of the person and you can check their profile.
        </Text>
        <Text
          style={{
            fontSize: height * 0.03,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            paddingTop: height * 0.05,
          }}>
          On the basis of their profile you can choose to approach them or not.{'\n'}
        </Text>
        <Text
          style={{
            fontSize: height * 0.03,
            fontWeight: 'bold',
            color: '#37f',
            textAlign: 'center',
            paddingTop: height * 0.01,
          }}>
          Enjoy the App
        </Text>
      </View>
    </ImageBackground>
  );
}