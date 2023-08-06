import { createTheme } from '@mui/material/styles'
import ThunderStrike from './assets/Fonts/thunderstrike.ttf'

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'ThunderStrike';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('ThunderStrike'), url(${ThunderStrike});
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
  palette: {
    discord: {
      main: '#5865F2',
    },
    hollowKnight: {
      main: 'rgba(20, 87, 189, 0.2)',
    },
    mode: 'dark',
    modforge: {
      main: '#944527',
    },
    silksong: {
      main: 'rgba(164, 50, 38, 0.2)',
    },
    white: {
      main: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Raleway, Arial',
  },
})

export default theme
