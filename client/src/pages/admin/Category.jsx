import React from 'react'
import Bread from '../../components/Bread'
import Spring from '../../components/Spring'

const Category = () => {
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Category',
        },
    ]
  return (
    <Spring>
        <Bread title="Cateogries" items={breadcrumb} label={"Add new category"} link={'/add_category'} />

    </Spring>
  )
}

export default Category