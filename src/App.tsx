import React from 'react';
import { Stack, Text, Link, FontWeights } from 'office-ui-fabric-react';

import logo from './fabric.png';
import Consumer from './components/gridconsumer/gridconsumer';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

export const App: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      styles={{
        root: {
          width: '960px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c'
        }
      }}
      gap={15}
    >
      <Stack horizontal gap={15} horizontalAlign="center">
        <Consumer />
      </Stack>
    </Stack>
  );
};
