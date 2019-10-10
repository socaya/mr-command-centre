import React from 'react';

//models
import { View } from 'mobx-state-tree-router';

//components
import MR from '../components/MR';
import Pivot from '../components/Pivot'

const views = {
    home: View.create({
        path: '/',
        name: 'home',
        component: <MR />
    }),
    pivot: View.create({
        path: '/pivot',
        name: 'pivot',
        component: <Pivot />
    })
};
export default views;
