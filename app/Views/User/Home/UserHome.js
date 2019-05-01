import React, { Component } from 'react';
import { Text, View, Menu, MenuButton, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import ContainerStyle from '../../../Styles/container'
import { SideMenu, List, ListItem, Button } from 'react-native-elements'
import { BackHandler } from 'react-native'
import App from '../../../../App';
import container from '../../../Styles/container';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import login from '../../../Styles/login';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { QuizzlyAlert } from '../../../Controllers/Alert';
import { NetworkController } from '../../../Controllers/Networking';
import { RadioButton } from 'react-native-paper'
const colors = require('../../../Styles/colors.json')

type Props = {};
export class UserHome extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            navigation: this.props.navigation,
            username: 'noUsername',
            loggingOut: false,
            quizzes: [],
            inQuiz: false,
            quiz: {},
            questions: [],
            answers: [],
            questionCount: 0,
            currentQuestion: {},
            inQuizSplash: false,
            selectedOption: 1,
            postingQuiz: false,
            loadingQuiz: false
        }
        var username = AsyncStorage.getItem('@Quizzly:username')
        username.then((value) => {
            if (value) {
                this.setState({
                    username: value
                }, () => {
                    this.loadQuizzes()
                })
            } else {
                this.performRouting('Login')
            }
        })
    }

    loadQuizzes() {
        NetworkController.performGET('/quiz/allQuizes').then((response: any) => {
            this.setState({
                quizzes: response.message
            })
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

    pressQuiz(id) {
        var quiz: any
        var questions: Array<any>
        this.setState({
            loadingQuiz: true
        })
        NetworkController.getUserId().then((userId) => {
            NetworkController.fetchQuiz(id, userId).then((response) => {
                if (response.message.questions) {
                    questions = response.message.questions
                    questions.sort((a, b) => {
                        return b.questionNumber - a.questionNumber
                    })
                    this.setState({
                        inQuizSplash: true,
                        questionCount: questions.length,
                        quiz: response.message.quiz,
                        questions: response.message.questions
                    }, () => {
                        this.setState({
                            loadQuiz: false
                        })
                    })
                } else {
                    QuizzlyAlert.errorAlert('Oopsie!', response.message)
                }
            })
        })

    }

    loadQuiz() {
        currentQ = this.state.questions.pop()
        this.setState({
            inQuizSplash: false,
            inQuiz: true,
            currentQuestion: currentQ
        })
    }

    cancelQuestion() {
        this.setState({
            inQuiz: false,
            answers: []
        })
    }

    cancelQuiz() {
        this.setState({
            inQuizSplash: false,
            answers: []
        })
    }

    answerQuestion() {
        var answers = this.state.answers
        answers.push({
            questionId: this.state.currentQuestion._id,
            questionNumber: this.state.currentQuestion.questionNumber,
            selectedOption: this.state.selectedOption,
            correct: this.state.currentQuestion.correctOptionNumber == this.state.selectedOption ? true : false
        })
        if (this.state.questions.length == 0) {
            this.setState({
                answers: answers
            }, () => {
                // Pass it to Network Controller
                this.setState({
                    inQuiz: false,
                    inQuizSplash: false,
                    postingQuiz: true
                }, () => {
                    NetworkController.postQuizResponses(this.state.quiz._id, this.state.answers).then(() => {
                        this.setState({
                            postingQuiz: false
                        })
                    })

                })
            })
        } else {
            var questions = this.state.questions
            var currentQuestion = questions.pop()
            this.setState({
                answers: answers,
                questions: questions,
                currentQuestion: currentQuestion
            }, () => {
            })
        }
    }

    render() {
        const checked = this.state.selectedOption;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }} >
                <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 30, marginTop: 40, marginBottom: 10, fontFamily: 'Pacifico' }}>Hey! {this.state.username}</Text>
                <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 30, margin: 10 }}>Quizzes you should take!</Text>
                <ScrollView style={{ margin: 10 }}>
                    <FlatList
                        data={this.state.quizzes}
                        renderItem={({ item }) => {
                            return (
                                <ListItem title={item.quizTitle} titleStyle={{ fontSize: 20, alignSelf: 'center', color: colors.white, fontFamily: 'QuestionText' }} Component={TouchableOpacity} containerStyle={{ backgroundColor: colors.primary, marginTop: 10, borderRadius: 50, marginLeft: 10, marginRight: 10 }} onPress={this.pressQuiz.bind(this, item._id)} />
                            )
                        }
                        }
                        keyExtractor={(item) => item._id.toString()}
                    />
                </ScrollView>
                {
                    this.state.inQuizSplash &&
                    <View style={container.quizScreen}>
                        <Text style={{ color: 'white', fontFamily: 'Pacifico', fontSize: 50, alignContent: 'center', textAlign: 'center' }}>{this.state.quiz.quizTitle}</Text>
                        <TouchableOpacity onPress={this.loadQuiz.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.primary, alignContent: 'center', justifyContent: 'center', width: '80%', marginTop: 10, padding: 20 }}>
                            <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignSelf: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                Yay! Take Quiz!
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.cancelQuiz.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.secondary, alignContent: 'center', justifyContent: 'center', width: '80%', marginTop: 10, padding: 20 }}>
                            <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignSelf: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                Nah! Not Now!
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    this.state.inQuiz &&
                    <View style={container.questionScreen}>
                        <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Pacifico', alignContent: 'center', textAlign: 'center', marginTop: 10, marginBottom: 10 }}>{this.state.quiz.quizTitle}</Text>
                        <Text style={{ color: 'white', fontSize: 15, alignContent: 'center', textAlign: 'center', margin: 10 }}>Question {this.state.currentQuestion.questionNumber} </Text>
                        <View style={{ flex: 1, width: '100%' }}>
                            <ScrollView contentContainerStyle={container.questionScrollable} >
                                <Image style={{ width: '100%', height: 200, resizeMode: 'contain', backgroundColor: 'rgba(0,0,0,0.3)', marginTop: 10 }} source={{ uri: 'data:image/png;base64,' + this.state.currentQuestion.questionImage }} />
                                <Text style={{ fontSize: 30, fontFamily: 'Pacifico', color: colors.white, backgroundColor: 'transparent', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                                    {this.state.currentQuestion.questionText}
                                </Text>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <RadioButton
                                            value={1}
                                            status={checked === 1 ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ selectedOption: 1 }); }} />

                                    </View>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignContent: 'stretch', width: '100%', alignSelf: 'stretch', margin: 3 }}>
                                            {this.state.currentQuestion.option1Text}
                                        </Text>
                                    </View>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <RadioButton
                                            value={1}
                                            status={checked === 2 ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ selectedOption: 2 }); }} />

                                    </View>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignContent: 'stretch', width: '100%', alignSelf: 'stretch', margin: 3 }}>
                                            {this.state.currentQuestion.option2Text}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <RadioButton
                                            value={1}
                                            status={checked === 3 ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ selectedOption: 3 }); }} />

                                    </View>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignContent: 'stretch', width: '100%', alignSelf: 'stretch', margin: 3 }}>
                                            {this.state.currentQuestion.option3Text}
                                        </Text>
                                    </View>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <RadioButton
                                            value={1}
                                            status={checked === 4 ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ selectedOption: 4 }); }} />

                                    </View>
                                    <View style={{ margin: 3, alignSelf: 'flex-start' }}>
                                        <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignContent: 'stretch', width: '100%', alignSelf: 'stretch', margin: 3 }}>
                                            {this.state.currentQuestion.option4Text}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', margin: 30 }}>
                                    <View style={{ alignItems: 'stretch', width: '50%', alignSelf: 'stretch', margin: 3 }}>
                                        <TouchableOpacity onPress={this.answerQuestion.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.primary, alignContent: 'center', justifyContent: 'center', width: '100%', marginTop: 10, padding: 20 }}>
                                            <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignSelf: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                                {this.state.questions.length === 0 ? 'Finish Quiz' : 'Answer'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'stretch', width: '50%', alignSelf: 'stretch', margin: 3 }}>
                                        <TouchableOpacity onPress={this.cancelQuestion.bind(this)} style={{ borderRadius: 50, backgroundColor: colors.secondary, alignContent: 'center', justifyContent: 'center', width: '100%', marginTop: 10, padding: 20 }}>
                                            <Text style={{ fontSize: 20, color: colors.white, backgroundColor: 'transparent', alignSelf: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                                Close
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                }

                {this.state.postingQuiz &&
                    <View style={login.loading}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={login.loadingText}>Please wait while we submit your responses!</Text>
                    </View>
                }

                {this.state.loadingQuiz &&
                    <View style={login.loading}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={login.loadingText}>Your quiz is currently loading</Text>
                    </View>
                }
            </View >
        )
    }
}
