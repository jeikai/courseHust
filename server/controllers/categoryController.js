const categoryModel = require('../models/Category')
const utility = require('../helper/utility')

exports.create = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['title', 'description'])

        const checkCategory = await categoryModel.get(data.title)
        if(checkCategory) return res.status(400).json({message: 'Category existed!'})

        const newcategory = await categoryModel.create(data)
        if(newcategory.error) return res.status(500).json({message: newcategory.error})

        return res.status(200).json({message: 'Create Category Successfully', data: newcategory})

    }catch(e){
        return res.status(500).json({message: e.message})
    }
}