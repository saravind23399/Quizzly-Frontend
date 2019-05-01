import { Alert } from 'react-native';

export class QuizzlyAlert {
    static errorAlert(alertTitle, alertMessage, onOkPressed){
        Alert.alert(
            alertTitle,
            alertMessage,
            [
                {
                    text: 'OK', onPress: onOkPressed
                },
            ],
            { cancelable: false },
        );
    }

    static successAlert(alertTitle, alertMessage, onOkPressed){
        Alert.alert(
            alertTitle,
            alertMessage,
            [
                {
                    text: 'OK', onPress: onOkPressed
                },
            ],
            { cancelable: false },
        );
    }
}
