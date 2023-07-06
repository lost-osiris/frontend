import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from '~/routes'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider, CategoriesProvider } from '~/context'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '~/store'

import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme'
import '~/styles/index.scss'

const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <div className='App'>
          <BrowserRouter>
            <UserProvider>
              <CategoriesProvider>
                <DndProvider backend={HTML5Backend}>
                  <Routes />
                </DndProvider>
              </CategoriesProvider>
            </UserProvider>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
)
