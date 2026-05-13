import Item from "../models/item.js";
import { isAdmin } from "./userController.js";

export async function createItem(req, res) {

    if(!isAdmin(req)){
        res.status(403).json({ message : "Access denied. Admins only"});
        return;
    }
    console.log(req.body.images)

    try{

        const existingItem = await Item.findOne({
            itemId : req.body.itemId
        });

        if(existingItem){
            res.status(400).json({ message : "Item with given itemId already exists"});
            return;
        }

        const data = {};

        data.itemId = req.body.itemId;

        if(req.body.name == null){
            res.status(400).json({ message : "Item name is required"});
            return;
        }

        data.name = req.body.name;
        data.description = req.body.description || ""
        data.altNames = req.body.altNames || [];

        if(req.body.price == null){
            res.status(400).json({message : "Item price is required"});
            return
        }

        data.price = req.body.price;
        data.labelledPrice = req.body.labelledPrice || req.body.price
        data.category = req.body.category || "Others"
        data.images = req.body.images || ["/images/default-item-1.png", "/images/default-item-2.png"]
        data.isVisible = req.body.isVisible
       

        const newItem = new Item(data);

        await newItem.save();

        res.status(201).json({message : "Item created successfully", item: newItem});

    

    } catch(error){
        res.status(500).json({ message : "Error creating item", error: error});
    }
}

export async function getItems(req, res) {
        
        try{

            if(isAdmin(req)){
                const items = await Item.find();
                res.status(200).json(items);
            } else {
                const items = await Item.find({ isVisible: true});
                res.status(200).json(items);
            }

        } catch(error){
            res.status(500).json({message : "Error fetching items", error:error})
        }
}

export async function deleteItem(req, res){
    if(!isAdmin(req)){
        res.status(403).json({message: "Access denied. Admins only"});
        return;
    }
    try{

        const itemId = req.params.itemId;

        await Item.deleteOne({ itemId : itemId});

        res.status(200).json({ message : "Item delete successfully"});

    }catch(error) {
        res.status(500).json({message: "Error deleting item", error: error});
    }
}

export async function updateItem(req, res) {
    if(!isAdmin(req)){
        res.status(403).json({ message : "Access denied. Admins only"});
        return;
    }

    try{

        const itemId = req.params.itemId;

        const data = {};
       
        if(req.body.name == null){
            res.status(400).json({ message : "Item name is required"});
            return;
        }

        data.name = req.body.name;
        data.description = req.body.description || ""
        data.altNames = req.body.altNames || []

        if(req.body.price == null){
            res.status(400).json({message : "Item price is required"});
            return
        }

        data.price = req.body.price;
        data.labelledPrice = req.body.labelledPrice || req.body.price
        data.category = req.body.category || "Others"
        data.images = req.body.images || ["/images/default-item-1.png", "/images/default-item-2.png"]
        data.isVisible = req.body.isVisible

        await Item.updateOne({itemId: itemId}, data);

        res.status(201).json({message : "Item updated successfully"});

    

    } catch(error){
        res.status(500).json({ message : "Error updating item", error: error});
    }
}

export async function getItemById(req, res){

    try{
        const itemId = req.params.itemId;
        const item = await Item.findOne({itemId: itemId});

        if(item == null){
            res.status(404).json({message : "Item not found"});
            return;
        }

        if(!item.isVisible){
            if(!isAdmin(req)){
                res.status(404).json({message : "Item not found"});
                return;
            }
        }
        res.status(200).json(item);
    } catch(error){
        res.status(500).json({message : "Error fetching item", error : error});
    }

}

export async function searchItems(req , res){

	const query = req.params?.query||"";

	try{

		const items = await Item.find(
			{ 
				$or : [
					{ name : { $regex : query , $options : "i" } },
					{description : { $regex : query , $options : "i" } },
					{ altNames: { $elemMatch: { $regex: query, $options: "i" } } }
				],
				isVisible : true				
			}
		)

		res.status(200).json(items);



	}catch(error){
		res.status(500).json({message : "Error searching items" , error : error});
	}

}


