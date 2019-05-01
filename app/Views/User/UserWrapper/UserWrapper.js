import React from 'react';
import { Text, View } from 'react-native';
import {Icon} from 'react-native-elements'
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { UserHome } from '../Home/UserHome';
import { UserSettings } from '../Settings/UserSettings';
import { UserQuizzes } from '../Quizzes/UserQuizzes';
const colors = require('../../../Styles/colors.json')


const TabNavigator = createBottomTabNavigator({
    UserHome: {
        screen: UserHome,
        navigationOptions: {
            tabBarLabel: "Home",
            tabBarIcon: ({tintColor}) => <Icon name='home' color={tintColor} size={25}/>,
        }
    },
    UserQuizzes:{
        screen: UserQuizzes,
        navigationOptions:{
            tabBarLabel: "Quizzes",
            tabBarIcon: ({tintColor}) => <Icon name='help' color={tintColor} size={25}/>,
        }
    },
    UserSettings: {
        screen: UserSettings,
        navigationOptions: {
            tabBarLabel: "Settings",
            tabBarIcon: ({tintColor}) => <Icon name='settings' color={tintColor} size={25}/>,
        }
    },
}, {
        initialRouteName: 'UserHome',
        animationEnabled: true,
        tabBarOptions: {
            activeTintColor: 'white',
            inactiveTintColor: colors.primary,
            activeBackgroundColor: colors.primary,
            inactiveBackgroundColor: 'white',
            labelStyle: {
                fontSize: 20,
            },
            showIcon: true,
            tabStyle:{
                height: '100%',
                paddingTop: 5,
                borderRadius: 25,
                marginLeft: 10,
                marginRight: 10,
                borderTopColor: 'white',
            },
        }
    });

export default createAppContainer(TabNavigator);