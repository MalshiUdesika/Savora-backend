const Food = require("../models/food");

const Category = require("../models/category");

const createFood = async (
  req,
  res
) => {

  try {

    const {
      name,
      description,
      price,
      category,
      image,
      ingredients,
      preparationTime
    } = req.body;

    const categoryExists =
      await Category.findById(
        category
      );

    if (!categoryExists) {

      return res.status(404)
      .json({
        success: false,
        message:
          "Category not found"
      });

    }

    const food =
      await Food.create({

        name,
        description,
        price,
        category,
        image,
        ingredients,
        preparationTime,

        createdBy:
          req.user._id

      });

    res.status(201).json({

      success: true,

      message:
        "Food created successfully",

      food

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getFoods = async (
  req,
  res
) => {

  try {

    const foods =
      await Food.find()

      .populate(
        "category",
        "name"
      )

      .sort({
        createdAt: -1
      });

    res.status(200).json({

      success: true,

      count:
        foods.length,

      foods

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getFoodById = async (
  req,
  res
) => {

  try {

    const food =
      await Food.findById(
        req.params.id
      )

      .populate(
        "category",
        "name"
      );

    if (!food) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Food not found"

      });

    }

    res.json({

      success: true,

      food

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const updateFood = async (
  req,
  res
) => {

  try {

    const food =
      await Food.findById(
        req.params.id
      );

    if (!food) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Food not found"

      });

    }

    Object.assign(
      food,
      req.body
    );

    await food.save();

    res.json({

      success: true,

      message:
        "Food updated successfully",

      food

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const deleteFood = async (
  req,
  res
) => {

  try {

    const food =
      await Food.findById(
        req.params.id
      );

    if (!food) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Food not found"

      });

    }

    await food.deleteOne();

    res.json({

      success: true,

      message:
        "Food deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

module.exports = {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood
};