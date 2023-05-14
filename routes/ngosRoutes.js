import express from "express";
import {
  createNgoController,
  deleteNgoController,
  getNgoController,
  getSingleNgoController,
  ngoCountController,
  ngoListController,
  ngoPhotoController,
  searchNgoController,
  updateNgoController,
} from "../controllers/ngoController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-ngo",
  requireSignIn,
  isAdmin,
  formidable(),
  createNgoController
);
//routes
router.put(
  "/update-ngo/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateNgoController
);

//get products
router.get("/get-ngo", getNgoController);

//single product
router.get("/get-ngo/:slug", getSingleNgoController);

//get photo
router.get("/ngo-photo/:pid", ngoPhotoController);

//delete rproduct
router.delete("/delete-ngo/:pid", deleteNgoController);

//product count
router.get("/ngo-count", ngoCountController);

//product per page
router.get("/ngo-list/:page", ngoListController);

//search product
router.get("/search/:keyword", searchNgoController);

export default router;