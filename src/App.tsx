import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRoutes from './Routes';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes></AppRoutes>
    </ThemeProvider>
  );
}

export default App;