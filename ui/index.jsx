import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, Paper } from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Init touchTap event system (required by material-ui)
injectTapEventPlugin();

const MainWrapper = ({ children }) => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title='Cognitive Bartender'
        showMenuIconButton={false}
      />
      <div
        className="container"
        style={{ marginTop: '1em' }}
      >
        {children}
      </div>
    </div>
  </MuiThemeProvider>
);

MainWrapper.propTypes = {
  children: React.PropTypes.node.isRequired,
};

const LandingPage = () => (
  <Paper style={{ padding: '1em' }}>
    Hello World
  </Paper>
);

// Inject React into HTML DOM
ReactDom.render((
  <Router history={hashHistory}>
    <Route path="/" component={MainWrapper}>
      <IndexRoute component={LandingPage} />
    </Route>
  </Router>
  /* global document */
), document.getElementById('root'));
