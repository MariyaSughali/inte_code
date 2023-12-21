const express = require("express");
const router = express.Router();

const aws = require("aws-sdk");

const pool = require("../config/db");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_accessKeyId,
  secretAccessKey: process.env.AWS_secretAccessKey,
  signatureVersion: "v4",
  region: "ap-south-1",
  endpoint: "https://s3.ap-south-1.amazonaws.com",
});
// middleware for object storage
const multer = require("multer");
const multerS3 = require("multer-s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "tranxify",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const upload_picture = async (req, res) => {
  try {
    const id = req.params.id;
    res.send({ data: req.file, message: "Successfully uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while uploading image");
  }
};

const get_picture = async (req, res) => {
  const params = {
    Bucket: "tranxify",
    Key: req.params.filename,
    Expires: 604799,
  };
  const id = req.params.id;
  s3.getSignedUrl("getObject", params, async function (err, url) {
    if (err) {
      res.status(500).json({ message: "Error in generating signed URL" });
      console.log(err);
    } else {
      try {
        const imageUrl = url;
        // Update the PostgreSQL database with the generated URL
        let response = await pool.query(
          "UPDATE user_table SET profile_pic_link=$1 WHERE id=$2",
          [imageUrl, id]
        );

        res.status(200).json({ imageUrl });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while generating signed URL");
      }
    }
  });
};

module.exports = { upload, upload_picture, get_picture };
