import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


import ContainerStyle from '../../Styles/container'

type Props = {};
export class Test extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.navigation.getParam('username', 'No Username')
        }

    }

    componentWillMount() {
        var value = AsyncStorage.getItem('@Quizzly:username');
        value.then((e) => {
        })
    }

    render() {
        return (
            <View style={ContainerStyle.container}>
                <Text>You have reached The test Component. Happy Navigating!</Text>
                <Button title="Go Back" onPress={() => { this.props.navigation.goBack() }}></Button>
            </View>
        );
    }
}