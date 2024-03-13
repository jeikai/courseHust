import React from 'react'
import LessonHeader from '../components/header/LessonHeader'

const LessonLayout = ({children}) => {
  return (
    <>
        <LessonHeader />
        {children}
    </>
  )
}

export default LessonLayout