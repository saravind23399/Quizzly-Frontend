import React, { Component } from 'react';
import { Text, View, Menu, MenuButton, StyleSheet, ActivityIndicator, Image, TouchableHighlight, TextInput, Picker, PermissionsAndroid } from 'react-native';
import ContainerStyle from '../../../Styles/container'
import { SideMenu, List, ListItem, Button, Icon } from 'react-native-elements'
import { BackHandler } from 'react-native'
import App from '../../../../App';
import container from '../../../Styles/container';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import login from '../../../Styles/login';
import { TouchableOpacity, RotationGestureHandler, ScrollView } from 'react-native-gesture-handler';
const colors = require('../../../Styles/colors.json')
import Modal from "react-native-modal";
import text from '../../../Styles/text';
import { RadioButton } from 'react-native-paper';
import { QuizzlyAlert } from '../../../Controllers/Alert';
import ImagePicker from 'react-native-image-picker';
import { NetworkController } from '../../../Controllers/Networking';

type Props = {};
export class AdminHome extends Component<Props> {

    newQuiz = {
        title: '',
        questions: []
    }

    constructor(props) {
        super(props)
        this.state = {
            navigation: this.props.navigation,
            username: this.props.username,
            loggingOut: false,
            newQuiz: false,
            newQuizTitle: '',
            addingQuestions: false,
            currentQuestionNumber: 1,
            questionText: '',
            questionOption1: '',
            questionOption2: '',
            questionOption3: '',
            questionOption4: '',
            correctOption: 1,
            questionImage: '',
            postingQuiz: false,
        }
        var username = AsyncStorage.getItem('@Quizzly:username')
        username.then((value) => {
            if (value) {
                this.setState({
                    username: value
                }, () => {
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
                })
            } else {
                this.performRouting('Login')
            }
        })

    }

    toggleNewQuiz() {
        this.setState({ newQuiz: !this.state.newQuiz });
    }

    toggleQuestions() {
        this.setState({
            addingQuestions: !this.state.addingQuestions
        })
    }

    quizOk() {
        if (this.state.questionText === '') {
            QuizzlyAlert.errorAlert('Oopsie!', 'You should tell what you want to ask!', () => {
                this.questionField.focus()
            })
        } else {
            if (this.state.questionOption1 === '' || this.state.questionOption2 === '' || this.state.questionOption3 === '' || this.state.questionOption4 === '') {
                QuizzlyAlert.errorAlert('Oopsie!', 'Some of your options are empty! ', () => {
                    this.option1Field.focus()
                })
            } else {
                if (this.state.questionText === '') {
                    QuizzlyAlert.errorAlert('Oopsie!', 'Image has not been uploaded!', () => {
                    })
                } else {
                    this.newQuiz.questions.push({
                        questionNumber: this.state.currentQuestionNumber,
                        questionText: this.state.questionText,
                        option1Text: this.state.questionOption1,
                        option2Text: this.state.questionOption2,
                        option3Text: this.state.questionOption3,
                        option4Text: this.state.questionOption4,
                        correctOptionNumber: this.state.correctOption,
                        questionImage: this.state.questionImage,
                        //questionImage: 'burr'
                    })
                    this.setState({
                        loggingOut: false,
                        newQuiz: false,
                        newQuizTitle: '',
                        addingQuestions: false,
                        currentQuestionNumber: 1,
                        questionText: '',
                        questionOption1: '',
                        questionOption2: '',
                        questionOption3: '',
                        questionOption4: '',
                        correctOption: 1,
                        questionImage: '',
                        postingQuiz:true
                    }, () => {
                        NetworkController.submitQuiz(this.newQuiz).then(()=>{
                            this.setState({
                                postingQuiz: false
                            })
                        })
                    })

                }
            }
        }
    }

    addAQuiz() {
        this.toggleNewQuiz()
    }

    titleOk() {
        if (this.state.newQuizTitle === '') {
            QuizzlyAlert.errorAlert('Oopsie!', 'A quiz title must be provided!', () => {
                this.titleField.focus()
            })
        } else {
            this.newQuiz.title = this.state.newQuizTitle
            this.toggleNewQuiz()
            this.toggleQuestions()
        }
    }

    uploadImage() {
        const options = {
            title: 'Select an Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                this.setState({
                    questionImage: response.data,
                }, () => {
                    QuizzlyAlert.successAlert('Yay!', 'Image Successfully registered')
                });
            }
        });
    }

    questionOk() {
        if (this.state.questionText === '') {
            QuizzlyAlert.errorAlert('Oopsie!', 'You should tell what you want to ask!', () => {
                this.questionField.focus()
            })
        } else {
            if (this.state.questionOption1 === '' || this.state.questionOption2 === '' || this.state.questionOption3 === '' || this.state.questionOption4 === '') {
                QuizzlyAlert.errorAlert('Oopsie!', 'Some of your options are empty! ', () => {
                    this.option1Field.focus()
                })
            } else {
                if (this.state.questionText === '') {
                    QuizzlyAlert.errorAlert('Oopsie!', 'Image has not been uploaded!', () => {
                    })
                } else {
                    this.newQuiz.questions.push({
                        questionNumber: this.state.currentQuestionNumber,
                        questionText: this.state.questionText,
                        option1Text: this.state.questionOption1,
                        option2Text: this.state.questionOption2,
                        option3Text: this.state.questionOption3,
                        option4Text: this.state.questionOption4,
                        correctOptionNumber: this.state.correctOption,
                        questionImage: this.state.questionImage,
                        //questionImage: 'burr'
                    })
                    this.setState({
                        currentQuestionNumber: this.state.currentQuestionNumber + 1,
                        questionText: '',
                        questionImage: '',
                        questionOption1: '',
                        questionOption2: '',
                        questionOption3: '',
                        questionOption4: '',
                        correctOptionNumber: 1
                    }, () => {
                        QuizzlyAlert.successAlert('Yay!', 'Question ' + (this.state.currentQuestionNumber - 1) + ' added Successfully!', () => {
                            console.log(this.newQuiz)
                        })
                    })
                }
            }
        }
    }

    previousQuestion() {
        const lastQues = this.newQuiz.questions.pop()
        this.setState({
            currentQuestionNumber: lastQues.questionNumber,
            questionText: lastQues.questionText,
            questionOption1: lastQues.option1Text,
            questionOption2: lastQues.option2Text,
            questionOption3: lastQues.option3Text,
            questionOption4: lastQues.option4Text,
            questionImage: lastQues.questionImage,
            correctOption: lastQues.correctOptionNumber
        }, () => {
            console.log(this.newQuiz)
        })
    }

    performRouting(screen: String) {
        this.state.navigation.navigate(String(screen), {
            navigation: this.state.navigation
        })
    }

    render() {
        const checked = this.state.correctOption;

        return (

            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>

                <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 30 }}>Hey! {this.state.username}</Text>
                <TouchableOpacity onPress={this.addAQuiz.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', width: '80%', padding: 20, margin: 20, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                        Add a Quiz!
                    </Text>
                </TouchableOpacity>
                <Text style={{ position: 'absolute', bottom: 30, alignSelf: 'center', fontSize: 17 }}>More features on the Way!</Text>

                {this.state.newQuiz &&
                    <View style={container.newQuiz}>
                        <Text style={text.newQuizTitle}>Aha! A new Quiz!</Text>
                        <TextInput onChange={(event) => this.setState({ newQuizTitle: event.nativeEvent.text })} placeholder="What do you want to call it?" style={text.newQuizInput} placeholderTextColor={colors.primary} ref={(input) => { this.titleField = input; }} value={this.state.newQuizTitle} ></TextInput>

                        <TouchableOpacity onPress={this.titleOk.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', width: '80%', padding: 20, margin: 20, alignSelf: 'center' }}>
                            <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                                Okay!
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.addAQuiz.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', width: '80%', padding: 20, margin: 20, alignSelf: 'center' }}>
                            <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                                Nah! Not Now!
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {this.state.addingQuestions &&
                    <View style={container.newQuiz}>
                        <Text style={text.newQuizTitle}>Question {this.state.currentQuestionNumber}</Text>
                        <TextInput onChange={(event) => this.setState({ questionText: event.nativeEvent.text })} placeholder="What do you want to ask?" style={text.newQuizInput} placeholderTextColor={colors.primary} ref={(input) => { this.questionField = input; }} value={this.state.questionText} ></TextInput>
                        <Text style={{ fontSize: 20, marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>What's the correct Option?</Text>
                        <ScrollView contentContainerStyle={{ flexDirection: 'column' }}>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                <RadioButton
                                    value={1}
                                    status={checked === 1 ? 'checked' : 'unchecked'}
                                    onPress={() => { this.setState({ correctOption: 1 }); }}
                                />
                                <TextInput onChange={(event) => this.setState({ questionOption1: event.nativeEvent.text })} placeholder="Option 1" style={text.newQuizInput} placeholderTextColor={colors.primary} ref={(input) => { this.option1Field = input; }} value={this.state.questionOption1} ></TextInput>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                                <RadioButton
                                    value={2}
                                    status={checked === 2 ? 'checked' : 'unchecked'}
                                    onPress={() => { this.setState({ correctOption: 2 }); }}
                                />
                                <TextInput onChange={(event) => this.setState({ questionOption2: event.nativeEvent.text })} placeholder="Option 2" style={text.newQuizInput} placeholderTextColor={colors.primary} ref={(input) => { this.option2Field = input; }} value={this.state.questionOption2} ></TextInput>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                                <RadioButton
                                    value={3}
                                    status={checked === 3 ? 'checked' : 'unchecked'}
                                    onPress={() => { this.setState({ correctOption: 3 }); }}
                                />
                                <TextInput onChange={(event) => this.setState({ questionOption3: event.nativeEvent.text })} placeholder="Option 3" style={text.newQuizInput} placeholderTextColor={colors.primary} ref={(input) => { this.option3Field = input; }} value={this.state.questionOption3} ></TextInput>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                                <RadioButton
                                    value={4}
                                    status={checked === 4 ? 'checked' : 'unchecked'}
                                    onPress={() => { this.setState({ correctOption: 4 }); }}
                                />
                                <TextInput onChange={(event) => this.setState({ questionOption4: event.nativeEvent.text })} placeholder="Option 4" style={text.newQuizInput} placeholderTextColor={colors.primary} ref={(input) => { this.option4Field = input; }} value={this.state.questionOption4} ></TextInput>
                            </View>
                            <TouchableOpacity onPress={this.uploadImage.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', width: '90%', padding: 20, margin: 20, alignSelf: 'center' }}>
                                <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                                    Upload Image
                                    </Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'flex-start', justifyContent: 'center' }}>
                                {this.state.currentQuestionNumber != 1 &&
                                    <TouchableOpacity onPress={this.previousQuestion.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', width: '90%', padding: 20, margin: 20, alignSelf: 'center' }}>
                                        <Icon name="arrow-back" size={30} color="white" />
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={this.quizOk.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', width: '90%', padding: 20, margin: 20, alignSelf: 'center' }}>
                                    <Text style={{ fontSize: 20, color: colors.white, textAlign: 'center', backgroundColor: 'transparent', }}>
                                        Finish
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.questionOk.bind(this)} style={{ borderRadius: 100, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', width: '90%', padding: 20, margin: 20, alignSelf: 'center' }}>
                                    <Icon name="arrow-forward" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                }

                {this.state.loggingOut &&
                    <View style={login.loading}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={login.loadingText}>We hope to see you soon!</Text>
                    </View>
                }

                {this.state.postingQuiz &&
                    <View style={login.loading}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={login.loadingText}>Please wait while we upload the quiz!</Text>
                    </View>
                }
            </ScrollView>
        )
    }
}
