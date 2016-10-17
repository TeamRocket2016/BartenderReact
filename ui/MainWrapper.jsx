import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import { AppBar } from 'material-ui';

const MainWrapper = ({ children }) => (
  <MuiThemeProvider
    muiTheme={getMuiTheme(darkBaseTheme)}
  >
    <div>
      <AppBar
        title="Cognitive Bartender"
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

export default MainWrapper;
