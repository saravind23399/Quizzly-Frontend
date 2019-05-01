import React, { Component } from 'react';
import { Text, View, Easing } from 'react-native';

import { Login } from './app/Views/Login/Login'
import { Test } from './app/Views/Test/Test'

import ContainerStyle from './app/Styles/container'

import { createStackNavigator, createAppContainer } from "react-navigation";
import { Register } from './app/Views/Register/Register';
import { AdminHome } from './app/Views/Admin/Home/AdminHome';
import AdminWrapper from './app/Views/Admin/AdminWrapper/AdminWrapper';
import UserWrapper from './app/Views/User/UserWrapper/UserWrapper';

type Props = {};
class App extends Component<Props> {
  constructor(props) {
    super(props)
  }
  static navigationOptions =
    {
      title: "Welcome!"
    };
  render() {
    return (
      <View style={ContainerStyle.container}>
        <Login navigation={this.props.navigation}></Login>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: App,
    navigationOptions: {
      header: null,
    }
  },
  Test: {
    screen: Test,
    navigationOptions: {
      header: null
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  AdminHome: {
    screen: AdminWrapper,
    navigationOptions: {
      header: null
    }
  },
  UserHome:{
    screen: UserWrapper,
    navigationOptions: {
      header: null
    }
  }
},
  {
    initialRouteName: 'AdminHome'
  });
export default createAppContainer(AppNavigator);