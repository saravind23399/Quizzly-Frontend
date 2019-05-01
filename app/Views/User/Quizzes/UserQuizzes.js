import React, { Component } from 'react';
import { Text, View, Menu, MenuButton, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import ContainerStyle from '../../../Styles/container'
import { SideMenu, List, ListItem, Button } from 'react-native-elements'
import { BackHandler } from 'react-native'
import App from '../../../../App';
import container from '../../../Styles/container';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import login from '../../../Styles/login';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { NetworkController } from '../../../Controllers/Networking';
const colors = require('../../../Styles/colors.json')
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Card, Title, Paragraph } from 'react-native-paper';

type Props = {};
export class UserQuizzes extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            navigation: this.props.navigation,
            username: 'noUsername',
            loading: true,
            quizResults: [],
            postingQuiz: false
        }
        var username = AsyncStorage.getItem('@Quizzly:username')
        username.then((value) => {
            if (value) {
                this.setState({
                    username: value
                }, () => {
                    this.loadQuizResults()
                })
            } else {
                this.performRouting('Login')
            }
        })

    }

    loadQuizResults(username) {
        AsyncStorage.getItem('@Quizzly:userId').then((data) => {
            NetworkController.performPOST('/quiz/getUserScores', { userId: data }).then((response) => {
                this.setState({
                    loading: false,
                    quizResults: response.message
                }, () => {
                    console.log(response)
                })
            })
        })

    }

    performRouting(screen: String) {
        this.state.navigation.navigate(String(screen), {
            navigation: this.state.navigation
        })
    }

    render() {
        const config = {
            velocityThreshold: 0.75,
            directionalOffsetThreshold: 80
        }
        return (
            <GestureRecognizer
                onSwipeDown={() => { this.setState({ loading: true }, () => { this.loadQuizResults() }) }}
                config={config}
                style={{
                    flex: 1,
                    backgroundColor: 'transparent'
                }}
            >
                <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 30, fontFamily: 'Pacifico', margin: 10, marginTop: 20 }}>Hey! {this.state.username}</Text>

                <Text style={{ position: 'absolute', bottom: 30, alignSelf: 'center', fontSize: 17 }}>Swipe down from the top to reload</Text>
                <ScrollView>

                    <FlatList
                        data={this.state.quizResults}
                        renderItem={({ item }) => {
                            return (
                                // <ListItem title={item.quiz[0].quizTitle} titleStyle={{ fontSize: 20, alignSelf: 'center', color: colors.white, fontFamily: 'QuestionText' }} Component={TouchableOpacity} containerStyle={{ backgroundColor: colors.primary, marginTop: 10, borderRadius: 50, marginLeft: 10, marginRight: 10 }} />
                                <Card elevation={Number(10)} style={{ margin: 10, backgroundColor: colors.primary, borderRadius: 20, }}>
                                    <Card.Title title={item.quiz[0].quizTitle} titleStyle={{ color: 'white', fontFamily: 'Pacifico', fontSize: 20 }} />
                                    <Card.Content>
                                        <Text style={{ color: 'white' }}>Total Questions : {item.totalQuestions}</Text>
                                        <Text style={{ color: 'white' }}>Correct Responses : {item.correctResponses}</Text>
                                        <Text style={{ color: 'white' }}>Your Score : {(item.correctResponses / item.totalQuestions) * 100}</Text>

                                    </Card.Content>
                                </Card>
                            )
                        }
                        }
                        keyExtractor={(item) => item.quiz[0]._id.toString()}
                    />
                </ScrollView>
                {
                    this.state.quizResults.length == 0 &&
                    <Text style={{ alignSelf: 'center', position: 'relative', bottom: '50%', fontSize: 30 }}>Ouch! No quizzes taken!</Text>
                }

                {
                    this.state.loading &&
                    <View style={login.loading}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={login.loadingText}>We are Loading your Quiz Results</Text>
                    </View>
                }
            </GestureRecognizer >
        )
    }
}
