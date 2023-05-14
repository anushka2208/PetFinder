import ngoModel from "../models/ngoModel.js";

import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();


export const createNgoController = async (req, res) => {
  try {
    const { name, description, phone,email} =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !phone:
        return res.status(500).send({ error: "Phone Number is Required" });
      case !email:
        return res.status(500).send({ error: "Email is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const ngos = new ngoModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      ngos.photo.data = fs.readFileSync(photo.path);
      ngos.photo.contentType = photo.type;
    }
    await ngos.save();
    res.status(201).send({
      success: true,
      message: "NGO Added Successfully",
      ngos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in adding ngo",
    });
  }
};

//get all products
export const getNgoController = async (req, res) => {
  try {
    const ngos = await ngoModel
      .find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: ngos.length,
      message: "AllNGO ",
      ngos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting ngos",
      error: error.message,
    });
  }
};
// get single product
export const getSingleNgoController = async (req, res) => {
  try {
    const ngo = await ngoModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
    res.status(200).send({
      success: true,
      message: "Single NGO Fetched",
      ngo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single ngo",
      error,
    });
  }
};

// get photo
export const ngoPhotoController = async (req, res) => {
  try {
    const ngo = await ngoModel.findById(req.params.pid).select("photo");
    if (ngo.photo.data) {
      res.set("Content-type", ngo.photo.contentType);
      return res.status(200).send(ngo.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteNgoController = async (req, res) => {
  try {
    await ngoModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "NGO Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting ngo",
      error,
    });
  }
};

//upate producta
export const updateNgoController = async (req, res) => {
  try {
    const { name, description, phone, email } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !phone:
        return res.status(500).send({ error: "phone is Required" });
      case !email:
        return res.status(500).send({ error: "Email is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const ngos = await ngoModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      ngos.photo.data = fs.readFileSync(photo.path);
      ngos.photo.contentType = photo.type;
    }
    await ngos.save();
    res.status(201).send({
      success: true,
      message: "Ngo Updated Successfully",
      ngos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte ngo",
    });
  }
};


// product count
export const ngoCountController = async (req, res) => {
  try {
    const total = await ngoModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in ngo count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const ngoListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const ngos = await ngoModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      ngos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchNgoController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await ngoModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Ngo API",
      error,
    });
  }
};