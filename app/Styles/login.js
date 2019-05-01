import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import * as colors from './colors.json'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roundedInput: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 45,
        borderWidth: 2,
        padding: 20,
        marginTop: 20,
        fontSize: 20,
        color: colors.white,
        width: '80%',
        textAlign: 'center'
    },
    background: {
        flex: 1,
    },
    loginButton: {
        height: 'auto',
        flexDirection: 'row',
        margin: 20,
        width: '80%',
        height: '20%',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 25,
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.90)'
    },
    loadingText:{
        color: colors.white,
        fontSize: 20,
        textAlign: 'center',
        margin: 20
    }

});