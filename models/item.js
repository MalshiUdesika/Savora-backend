import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        itemId : {
            type : String,
            required : true,
            unique : true
        },
        name : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        labelledPrice : {
            type : Number
        },
        category : {
            type : String,
            default : "Others"
        },
        images : {
            type : [String],
            default : ["/images/default-product-1.png", "/images/default-product-2.png"]
        },
        isVisible : {
            type : Boolean,
            default : true,
            required : true
        },
        qty : {
            type : Number,
            default : 100
        }

    }
)

const Item = mongoose.model("Item", itemSchema)

export default Item;