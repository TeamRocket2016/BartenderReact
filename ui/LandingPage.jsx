import React from 'react';
import { Paper } from 'material-ui';

import WatsonLogo from './WatsonLogo.jsx';

const defaultPaperStyle = {
  padding: '1em',
  margin: '1em',
};

const LandingPage = () => (
  <div>
    <WatsonLogo />
    <Paper style={defaultPaperStyle}>
      Hello World
    </Paper>
  </div>
);

export default LandingPage;
