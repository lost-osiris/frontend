import React, { createContext, useState, useEffect, useContext } from 'react'
import { UserContext } from './Authentication'
import * as api from '~/api'

export const CategoriesContext = createContext({})

export const CategoriesProvider = (props) => {
  const userInfo = useContext(UserContext)
  const [categories, setCategories] = useState()

  useEffect(() => {
    if (!categories && userInfo) {
      api
        .requests('get', '/api/project/63fe47296edfc3b387628861/categories')
        .then((data) => setCategories(data))
    }
  }, [categories, userInfo])

  return (
    <CategoriesContext.Provider value={categories}>
      {props.children}
    </CategoriesContext.Provider>
  )
}
