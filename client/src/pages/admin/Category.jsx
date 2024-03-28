import React from 'react'
import Bread from '../../components/Bread'

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
    <section>
        <Bread title="Cateogries" items={breadcrumb} label={"Add new category"} link={'/add_category'} />

    </section>
  )
}

export default Category