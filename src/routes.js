import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import main from './pages/main';
import box from './pages/box';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={main} />
            <Route path="/box/:id" component={box} />
        </Switch>
    </BrowserRouter>
);

export default Routes;