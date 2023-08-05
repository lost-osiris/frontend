import React from 'react'
import { useLocation } from 'react-router-dom'

export const Blog = () => {
  const location = useLocation()
  const data = location.state

  return <div dangerouslySetInnerHTML={{ __html: data }} />
}
