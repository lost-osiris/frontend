import React from "react";
import Routes from './routes'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Context";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider as ReduxProvider  } from "react-redux";
import { store } from "./Utils/store"

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"


const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <BrowserRouter>
            <UserProvider>
              <DndProvider backend={HTML5Backend}>
              <Routes /> 
              </DndProvider>
            </UserProvider>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
