import React, { createContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { parseJwt } from '~/utils'

export const UserContext = createContext({})

export const UserProvider = (props) => {
  const [userInfo, setUserInfo] = useState()
  const navigate = useNavigate()
  const [searchParams, _] = useSearchParams() // eslint-disable-line

  useEffect(() => {
    let token = searchParams.get('token')

    if (token) {
      localStorage.setItem('jwt', token)
      navigate('/project/63fe47296edfc3b387628861/issues/general')
    } else {
      if (!userInfo && localStorage.getItem('jwt')) {
        setUserInfo(parseJwt(localStorage.getItem('jwt')))
      }
    }
  }, [userInfo, searchParams]) // eslint-disable-line

  return (
    <UserContext.Provider value={userInfo}>
      {props.children}
    </UserContext.Provider>
  )
}
