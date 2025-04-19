export const Colors = {
  light: {
    primary: '#03045e',
    secondary: '#e6e9fd',//'#dee2ff',
    tertiary: '#d8dcfc',
    background: '#fafaff',
    backgroundGradient: 'rgba(0, 0, 0, 0.5)',
    gray: '#a3a2a2',
    surface: '#F5F5F5',
    mustard: '#f77f00',
    text: {
      high: '#000000',
      medium: '#4A4A4A',
      low: '#9E9E9E',
    },
    error: '#d62828',
  },
  dark: {
    primary: '#158B80',
    secondary: '#03DAC6',
    tertiary: '#d8dcfc',
    background: '#FFFFFF',
    backgroundGradient: 'rgba(0, 0, 0, 0.4)',
    gray: '#a3a2a2',
    surface: '#F5F5F5',
    mustard: '#f77f00',
    text: {
      high: '#000000',
      medium: '#4A4A4A',
      low: '#9E9E9E',
    },
    error: '#B00020',
  },
};

export type ThemeType = typeof Colors.light;
