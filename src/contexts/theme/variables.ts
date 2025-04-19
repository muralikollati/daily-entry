import {Colors} from './colors';
import {Fonts} from './fonts';

export const Variables = {
  light: {
    colors: Colors.light,
    fonts: Fonts,
  },
  dark: {
    colors: Colors.dark,
    fonts: Fonts,
  },
};

export type ThemeType = typeof Variables.light;
