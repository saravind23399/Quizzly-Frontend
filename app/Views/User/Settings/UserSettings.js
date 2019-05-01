import React, { Component } from 'react';
import { Text, View, Menu, MenuButton, StyleSheet, ActivityIndicator } from 'react-native';
import ContainerStyle from '../../../Styles/container'
import { SideMenu, List, ListItem, Button } from 'react-native-elements'
import { BackHandler } from 'react-native'
import App from '../../../../App';
import container from '../../../Styles/container';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import login from '../../../Styles/login';
import { TouchableOpacity } from 'react-native-gesture-handler';
const colors = require('../../../Styles/colors.json')


type Props = {};
export class UserSettings extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            navigation: this.props.navigation,
            username: 'noUsername',
            loggingOut: false
        }
        var username = AsyncStorage.getItem('@Quizzly:username')
        username.then((value) => {
            if (value) {
                this.setState({
                    username: value
                })
            } else {
                this.performRouting('Login')
            }
        })
    }

    logout() {
        this.setState({
            loggingOut: true
        }, () => {
            AsyncStorage.clear(() => {
                this.setState({
                    loggingOut: false
                })
                this.performRouting('Login')
            })
        })

    }

    performRouting(screen: String) {
        this.state.navigation.navigate(String(screen), {
            navigation: this.state.navigation
        })
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 30 }}>Hey! {this.state.username}</Text>
                <TouchableOpacity onPress={this.logout.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', width: '80%', padding: 20, margin: 20, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
                <Text style={{ position: 'absolute', bottom: 30, alignSelf: 'center', fontSize: 17 }}>More features on the Way!</Text>
                {this.state.loggingOut &&
                    <View style={login.loading}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={login.loadingText}>We hope to see you soon!</Text>
                    </View>
                }
            </View>
        )
    }
}
