import React, { createContext, useState } from 'react'

export const AlertsContext = createContext({ alerts: [], pushAlert: () => {} })

export const AlertsProvider = (props) => {
  const [alerts, setAlerts] = useState([])

  return (
    <AlertsContext.Provider
      value={{
        alerts: alerts,
        pushAlert: (alert) => {
          setAlerts([...alerts, alert])
        },
      }}
    >
      {props.children}
    </AlertsContext.Provider>
  )
}
