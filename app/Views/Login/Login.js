import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Button } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkController } from '../../Controllers/Networking'
import { QuizzlyAlert } from '../../Controllers/Alert'
import LinearGradient from 'react-native-linear-gradient';

type Props = {};

import LoginStyle from '../../Styles/login.js'
import * as colors from '../../Styles/colors.json'

var TestComponent = require('../Test/Test')

export class Login extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            role: "",
            navigation: this.props.navigation,
            loading: false
        };
        var value = AsyncStorage.getItem('@Quizzly:role');
        value.then((e) => {
            if (e) {
                if (e === 'admin') {
                    this.performRouting('AdminHome')
                } else {
                    this.performRouting('UserHome')
                }
            } else {
                this.performRouting('Login')
            }

        })
        this.animatedValue = new Animated.Value(0)
    }

    componentDidMount() {

        this.animate()
    }


    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.bounce
            }
        ).start(() => { })
    }

    login() {
        this.usernameField.blur()
        this.passwordField.blur()
        if (this.state.username == '') {
            QuizzlyAlert.errorAlert('Oopsie!', 'Username empty. You have to identify yourselves', () => {
                this.usernameField.focus()
            })
        } else {
            if (this.state.password == '') {
                QuizzlyAlert.errorAlert('Oopsie!', 'Cannot login without a password!', () => {
                    this.passwordField.focus()
                })
            } else {
                this.setState({
                    loading: true
                }, () => {
                    NetworkController.performPOST('/user/authenticate', { username: this.state.username, password: this.state.password }).then((response: any) => {
                        if (response.success) {
                            QuizzlyAlert.successAlert('Yay!', response.message, () => { })
                            AsyncStorage.setItem('@Quizzly:username', this.state.username).then(() => {
                                AsyncStorage.setItem('@Quizzly:role', response.role).then(() => {
                                    AsyncStorage.setItem('@Quizzly:userId', response.userid).then(() => {
                                        this.setState({
                                            loading: false
                                        }, () => {
                                            if (response.role === 'admin') {
                                                this.performRouting('AdminHome')
                                            } else {
                                                this.performRouting('UserHome')
                                            }
                                        })

                                    })
                                })
                            })
                        } else {
                            QuizzlyAlert.errorAlert('Oopsie!', response.message, () => {
                                this.setState({
                                    loading: false
                                })
                            })
                        }


                    })
                })
            }
        }
    }

    performRouting(screen: String) {
        this.state.navigation.navigate(String(screen), {
            navigation: this.state.navigation
        })
    }

    register() {
        this.performRouting('Register')
    }

    render() {
        const textSize = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 100]
        })
        return (
            <LinearGradient colors={['#FC466B', '#3F5EFB']} style={LoginStyle.background}>
                <View style={LoginStyle.container} pointerEvents={'box-none'}>
                    <Animated.Text style={{ color: colors.white, fontFamily: 'normal', fontSize: textSize, fontFamily: 'Login' }}>Lets Quizzly!</Animated.Text>
                    <TextInput onChange={(event) => this.setState({ username: event.nativeEvent.text })} placeholder="Username" style={LoginStyle.roundedInput} placeholderTextColor={colors.white} ref={(input) => { this.usernameField = input; }} value={this.state.username}></TextInput>
                    <TextInput onChange={(event) => this.setState({ password: event.nativeEvent.text })} placeholder="Password" secureTextEntry style={LoginStyle.roundedInput} placeholderTextColor={colors.white} ref={(input) => { this.passwordField = input; }} value={this.state.password} ></TextInput>
                    <TouchableOpacity onPress={this.login.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '80%', margin: 20, padding: 20 }}>
                        <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.register.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '80%', marginTop: 0, padding: 20 }}>
                        <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                            Register
                        </Text>
                    </TouchableOpacity>
                    {this.state.loading &&
                        <View style={LoginStyle.loading}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={LoginStyle.loadingText}>Quizzly On the Way!</Text>
                        </View>
                    }
                </View>
            </LinearGradient>
        );
    }
}