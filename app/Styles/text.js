import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import * as colors from './colors.json'

export default StyleSheet.create({
    newQuizTitle: {
        color: colors.primary,
        fontSize: 40,
        textAlign: 'center',
        margin: 20
    },
    newQuizInput: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 45,
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        fontSize: 15,
        color: colors.primary,
        width: '80%',
        textAlign: 'center'
    }

});