import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MainWrapper from './MainWrapper.jsx';
import LandingPage from './LandingPage.jsx';

// Init touchTap event system (required by material-ui)
injectTapEventPlugin();

// Inject React into HTML DOM
ReactDom.render((
  <Router history={hashHistory}>
    <Route path="/" component={MainWrapper}>
      <IndexRoute component={LandingPage} />
    </Route>
  </Router>
  /* global document */
), document.getElementById('root'));
