import React from 'react';
import { Text, View } from 'react-native';
import {Icon} from 'react-native-elements'
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { AdminHome } from '../Home/AdminHome';
import { AdminSettings } from '../Settings/AdminSettings';
import { addResult } from '@jest/test-result';
const colors = require('../../../Styles/colors.json')


const TabNavigator = createBottomTabNavigator({
    AdminHome: {
        screen: AdminHome,
        navigationOptions: {
            tabBarLabel: "Home",
            tabBarIcon: ({tintColor}) => <Icon name='home' color={tintColor} size={25}/>,
        }
    },
    AdminSettings: {
        screen: AdminSettings,
        navigationOptions:{
            tabBarLabel:"Settings",
            tabBarIcon: ({tintColor}) => <Icon name='settings' color={tintColor} size={25}/>
        }
    },
}, {
        initialRouteName: 'AdminSettings',
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