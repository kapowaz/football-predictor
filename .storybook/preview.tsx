import '../src/theme.css';
import '../src/App.css';

import type { Preview } from '@storybook/react-vite';
import React, { useEffect } from 'react';

const withColorMode: Preview['decorators'] = [
  (Story, context) => {
    const colorMode = context.globals.colorMode ?? 'dark';

    useEffect(() => {
      document.documentElement.setAttribute('data-color-mode', colorMode);
    }, [colorMode]);

    return <Story />;
  },
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    colorMode: {
      description: 'Global color mode for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Color Mode',
        icon: 'paintbrush',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorMode: 'dark',
  },
  decorators: withColorMode,
};

export default preview;
