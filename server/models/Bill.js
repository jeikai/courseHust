const mongoose = require('mongoose')
const Schema = mongoose.Schema  
// bảng này dành cho hoá đơn
const BillSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    price: {type: Number},
    date_created: Date,
    date_updated: Date
})

const Bill = mongoose.model('Bill', BillSchema, 'bills')
exports.schema = Bill 

exports.create = async function(data){
    try {
        const billData = {
            userId: data.userId,
            price: data.price,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newBill = Enrollment(billData)
        await newBill.save()
        return newBill
    } catch (error) {
        return { error: error }
    }
}