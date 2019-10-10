import React from 'react';
import ReactDOM from 'react-dom';
import { RouterStore, startRouter } from 'mobx-state-tree-router';

//mobx
import { Provider } from 'mobx-react';
import { Store } from './store/Store';
//router
import views from './config/views';

import App from './App';
const store = Store.create({
    router: RouterStore.create({
        views: views
    })
});
startRouter(store.router);
ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));



