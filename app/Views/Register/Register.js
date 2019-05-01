import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkController } from '../../Controllers/Networking'
import { QuizzlyAlert } from '../../Controllers/Alert'

import LinearGradient from 'react-native-linear-gradient';

type Props = {};

import LoginStyle from '../../Styles/login.js'
import * as colors from '../../Styles/colors.json'

export class Register extends Component<Props> {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            navigation: this.props.navigation,
            loading: false
        };
        this.animatedValue = new Animated.Value(0)
    }

    componentDidMount() {
        var value = AsyncStorage.getItem('@Quizzly:username');
        value.then((e) => {
            if (e) {
                this.performRouting()
            }
        })
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

    register() {
        if (this.state.username == '') {
            QuizzlyAlert.errorAlert('Oopsie!', 'Username empty. You have to identify yourselves', () => {
                this.setState({
                    password: '',
                    confirmPassword: ''
                }, () => {
                    this.usernameField.focus()
                })
            })
        } else {
            if (this.state.password == '') {
                QuizzlyAlert.errorAlert('Oopsie!', 'Cannot register without a password!', () => {
                    this.setState({
                        password: '',
                        confirmPassword: ''
                    }, () => {
                        this.passwordField.focus()
                    })
                })
            } else {
                if (this.state.password !== this.state.confirmPassword) {
                    QuizzlyAlert.errorAlert('Oopsie!', 'Passwords dont match!', () => {
                        this.setState({
                            password: '',
                            confirmPassword: ''
                        }, () => {
                            this.passwordField.focus()
                        })
                    })
                } else {
                    this.setState({
                        loading: true
                    }, () => {
                        NetworkController.performPOST('/user/register', { username: this.state.username, password: this.state.password }).then((value: any) => {
                            if (value.success) {
                                QuizzlyAlert.successAlert('Yay!', "You've Successfully registerd with Quizzly!", () => {
                                    this.performRouting('Login')
                                })
                            } else {
                                QuizzlyAlert.errorAlert('Oopsie!', value.message, () => { })
                            }
                            this.setState({
                                loading: false
                            }, () => { })
                        })
                    })

                }
            }
        }


    }

    performRouting(screen) {
        this.state.navigation.navigate(String(screen), {
            navigation: this.state.navigation
        })
    }

    signIn() {
        this.state.navigation.pop()
    }

    render() {
        const textSize = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 100]
        })
        return (
            <LinearGradient colors={['#03001e', '#7303c0', '#ec38bc', '#fdeff9']} style={LoginStyle.background}>
                <View style={LoginStyle.container} pointerEvents={'box-none'}>
                    <Animated.Text style={{ color: colors.white, fontFamily: 'normal', fontSize: textSize,  fontFamily: 'Login' }}>Join Quizzly!</Animated.Text>
                    <TextInput onChange={(event) => this.setState({ username: event.nativeEvent.text })} placeholder="Username" style={LoginStyle.roundedInput} placeholderTextColor={colors.white} value={this.state.username} ref={(input) => { this.usernameField = input; }} ></TextInput>
                    <TextInput onChange={(event) => this.setState({ password: event.nativeEvent.text })} placeholder="Password" secureTextEntry style={LoginStyle.roundedInput} placeholderTextColor={colors.white} value={this.state.password} ref={(input) => { this.passwordField = input; }}></TextInput>
                    <TextInput onChange={(event) => this.setState({ confirmPassword: event.nativeEvent.text })} placeholder="Confirm Password" secureTextEntry style={LoginStyle.roundedInput} placeholderTextColor={colors.white} value={this.state.confirmPassword}></TextInput>
                    <TouchableOpacity onPress={this.register.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '80%', margin: 20, padding: 20 }}>
                        <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                            Yay! Join!
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.signIn.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '80%', marginTop: 0, padding: 20 }}>
                        <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                    {this.state.loading &&
                        <View style={LoginStyle.loading}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={LoginStyle.loadingText}>Please wait while we take care of your registration!</Text>
                        </View>
                    }
                </View>
            </LinearGradient>
        );
    }
}