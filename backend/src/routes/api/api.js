import express from "express";

const router = express.Router();

// import child routes
import tempRoutes from "./api-temp.js";
import tempUserRoute from"./tempUserRoute.js";
import upload from "./api-upload.js"
router.use("/messages", tempRoutes);
router.use("/userSelect", tempUserRoute);
router.use("/upload",upload )

export default router;
