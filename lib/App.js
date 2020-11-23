import React from 'react';
import { Stack, FontWeights } from 'office-ui-fabric-react';
import Consumer from './components/gridconsumer/gridconsumer';
const boldStyle = {
    root: { fontWeight: FontWeights.semibold }
};
export const App = () => {
    return (React.createElement(Stack, { horizontalAlign: "center", verticalAlign: "center", verticalFill: true, styles: {
            root: {
                width: '960px',
                margin: '0 auto',
                textAlign: 'center',
                color: '#605e5c'
            }
        }, gap: 15 },
        React.createElement(Stack, { horizontal: true, gap: 15, horizontalAlign: "center" },
            React.createElement(Consumer, null))));
};
