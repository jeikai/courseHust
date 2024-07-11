import React from 'react'
import LessonHeader from '../components/header/LessonHeader'

const LessonLayout = ({children}) => {
  return (
    <>
        <div className='h-full'>
          <LessonHeader />
          {children}
        </div>
    </>
  )
}

export default LessonLayout