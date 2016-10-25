import React from 'react';
import { white } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import { AppBar } from 'material-ui';

const purple50 = 'rgb(152, 85, 212)';
const indigo90 = 'rgb(32, 32, 65)';
const gray80 = 'rgb(50, 50, 50)';

const mainTheme = (() => {
  const mainTheme = darkBaseTheme;
  mainTheme.palette = darkBaseTheme.palette || {};
  mainTheme.palette.primary2Color =
    mainTheme.palette.primary1Color = purple50;
  mainTheme.palette.canvasColor = gray80;
  mainTheme.palette.textColor = white;
  return mainTheme;
})();

const MainWrapper = ({ children }) => (
  <MuiThemeProvider
    muiTheme={getMuiTheme(mainTheme)}
  >
    <div>
      <AppBar
        title="Cognitive Bartender"
        titleStyle={{ color: white, fontSize: '3em', textAlign: 'center' }}
        showMenuIconButton={false}
        style={{ fontFamily: 'MIB', backgroundColor: indigo90 }}
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
