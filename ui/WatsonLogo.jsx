import React from 'react';
import { Paper } from 'material-ui';

const WatsonLogo = () => (
  <Paper
    style={{
      width: '15vh',
      height: '15vh',
      padding: '.5em',
      margin: '0 auto',
    }}
  >
    <img
      style={{
        margin: '0 auto',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
      role="presentation"
      src="http://www.ibm.com/cognitive/uk-en/outthink/i/outthink/logo.gif"
    />
  </Paper>
);

export default WatsonLogo;
