const Category = require("../models/category");

const createCategory =
async (req, res) => {

  try {

    const {
      name,
      description
    } = req.body;

    const existingCategory =
      await Category.findOne({
        name
      });

    if (existingCategory) {

      return res.status(400).json({
        success: false,
        message:
          "Category already exists"
      });

    }

    const category =
      await Category.create({

        name,
        description

      });

    res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};

const getCategories =
async (req, res) => {

  try {

    const categories =
      await Category.find()
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count:
        categories.length,
      categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};

const getCategoryById =
async (req, res) => {

  try {

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404)
      .json({
        success: false,
        message:
          "Category not found"
      });

    }

    res.status(200).json({
      success: true,
      category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};

const updateCategory =
async (req, res) => {

  try {

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404)
      .json({
        success: false,
        message:
          "Category not found"
      });

    }

    category.name =
      req.body.name ||
      category.name;

    category.description =
      req.body.description ||
      category.description;

    await category.save();

    res.status(200).json({
      success: true,
      message:
        "Category updated",
      category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};


const deleteCategory =
async (req, res) => {

  try {

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404)
      .json({
        success: false,
        message:
          "Category not found"
      });

    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Category deleted"
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
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};