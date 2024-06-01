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
        <Bread title="Categries" items={breadcrumb} label={"Add new category"} link={'/admin/add_category'} />

    </Spring>
  )
}

export default Category