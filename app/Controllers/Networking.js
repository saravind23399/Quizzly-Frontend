import { devServer as devURL } from '../../app.json';
import { QuizzlyAlert } from './Alert.js';
import AsyncStorage from '@react-native-community/async-storage';
import { reject } from 'rsvp';

export class NetworkController {

    static getUserId() {
        return AsyncStorage.getItem('@Quizzly:userId');
    }

    static getWorkingUrl(segment: String) {
        return devURL + segment
    }

    static fetchQuiz(quizId, userId) {
        return this.performPOST('/quiz/getQuiz', {
            quizId: quizId,
            userId: userId
        })
    }

    static postQuizResponses(quizId, answers: Array<any>): Promise<any> {
        return new Promise(function (resolve, reject) {
            if (answers.length == 0) {
                QuizzlyAlert.successAlert('Yay!', 'Quiz Submitted!')
                resolve(1)
            } else {
                currentAnswer = answers.pop()
                AsyncStorage.getItem('@Quizzly:userId').then((userId) => {
                    NetworkController.performPOST('/question/answerQuestion', {
                        questionId: currentAnswer.questionId,
                        userId: userId,
                        quizId: quizId,
                        optionResponded: currentAnswer.selectedOption,
                        correct: currentAnswer.correct
                    }).then((response) => {
                        NetworkController.postQuizResponses(quizId, answers).then(() => resolve(1))
                    })
                })
            }
        })

    }

    static performGET(segment: String) {
        return fetch(this.getWorkingUrl(segment), {
            method: 'get',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {
                return response
            }).catch((error) => {
                reject(error)
            })
    }

    static performPOST(segment: String, data: any) {
        return fetch(this.getWorkingUrl(segment), {
            method: 'post',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                return response
            })
    }

    static performGETTest() {
        return fetch(this.getWorkingUrl(''), {
            method: 'get',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {
                return response
            })
    }

    static postQuestions(quizId, questions: Array<any>) {
        return new Promise(function (resolve, reject) {
            if (questions.length == 0) {
                QuizzlyAlert.successAlert('Yay!', 'Quiz and Questions Upload Complete')
                resolve(1)
            } else {
                const question = questions.pop()
                question['quizId'] = quizId
                NetworkController.performPOST('/question/newQuestion', question).then((response) => {
                    NetworkController.postQuestions(quizId, questions).then(() => resolve(1))
                })
            }
        })

    }

    static submitQuiz(newQuiz: any) {
        return new Promise(function (resolve, reject) {
            AsyncStorage.getItem('@Quizzly:userId').then((data) => {
                const msg = {
                    createdBy: data,
                    quizTitle: newQuiz.title
                }
                NetworkController.performPOST('/quiz/postQuiz', msg).then((response) => {
                    if (response.success) {
                        NetworkController.postQuestions(response.quizId, newQuiz.questions).then(() => resolve(1))
                    } else {
                        QuizzlyAlert.errorAlert('Oopsie!', response.message)
                    }
                })
            })
        })
    }
}