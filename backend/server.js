const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const {
  insertPicture,
  getUrls,
  removePicture,
  editPicture,
} = require("./database_functions/pictures.js");

const app = express();
const port = process.env.PORT || 1000;

// Configure CORS
const corsOrigins =
  process.env.CORS_ORIGINS ||
  "http://localhost:3000,https://campushunt.onrender.com";
app.use(cors({ origin: corsOrigins.split(",") }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Delete Image Route
app.post("/deleteImage", async (req, res) => {
  const name = req.body.data.public_id;
  try {
    await cloudinary.uploader.destroy(name);
    const sql = await removePicture(name);
    if (sql === "database error") {
      return res.status(500).json({ error: "Database error occurred" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting image" });
  }
});

// Get URLs Route
app.get("/get_urls", async (req, res) => {
  try {
    const urls = await getUrls();
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching URLs" });
  }
});

// Upload Route
app.post("/upload", upload.array("files"), async (req, res) => {
  console.log(req.body);
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files provided" });
  }

  try {
    for (const [index, file] of files.entries()) {
      // Retrieve metadata for each file from req.body, using the correct index
      const description = req.body[`captions[${index}][description]`];
      const latitude = parseFloat(req.body[`captions[${index}][latitude]`]);
      const longitude = parseFloat(req.body[`captions[${index}][longitude]`]);

      console.log(
        `Description: ${description}, Latitude: ${latitude}, Longitude: ${longitude}`
      );

      // Check if metadata is valid
      if (!description || isNaN(latitude) || isNaN(longitude)) {
        return res
          .status(400)
          .json({ error: `Metadata for file ${index} is missing or invalid` });
      }

      // Set context metadata for Cloudinary upload
      const context = { description, latitude, longitude };

      // Upload file buffer to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: "Princeton", context },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res
              .status(500)
              .json({ error: "Error uploading to Cloudinary" });
          }

          const fileUrl = result.secure_url;
          const publicId = result.public_id;

          // Check if upload was successful
          if (fileUrl) {
            // Insert metadata and file URL into the database
            const insert = await insertPicture(
              fileUrl,
              [latitude, longitude],
              description,
              publicId
            );

            if (insert === "database error") {
              return res.status(500).json({ error: "Database error occurred" });
            }
          } else {
            console.error(
              `Error: Upload for file ${index} did not return a URL.`
            );
          }
        }
      );

      // Pass the buffer data to the Cloudinary upload stream
      file.stream.pipe(result);
    }
    // Respond with success message if all files were processed successfully
    res.json({ success: true });
  } catch (error) {
    console.error(`Error uploading files: ${error}`);
    res.status(500).json({ error: "Error uploading files" });
  }
});

// Edit Image Route
app.post("/editImage", async (req, res) => {
  const { currentID, description, latitude, longitude } = req.body;
  try {
    const update = await editPicture(
      currentID,
      latitude,
      longitude,
      description
    );
    if (update === "database error") {
      return res.status(500).json({ error: "Database error occurred" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error editing image" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
