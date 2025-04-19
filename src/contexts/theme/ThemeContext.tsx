// theme/ThemeContext.tsx

import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeType, Variables } from './variables';
// import { Colors, ThemeType } from './colors';

const ThemeContext = createContext<ThemeType>(Variables.light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Variables.dark : Variables.light;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
