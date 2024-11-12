// pictures.js
const { Pool } = require("pg");
require("dotenv").config();
const dbLink = process.env.DATABASE_URL;

// Configure a new pool
const pool = new Pool({
  connectionString: dbLink,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Insert a picture record
async function insertPicture(url, coordinates, description, public_id) {
  const query = `
    INSERT INTO Princeton_pictures (URL, Coordinates, label_description, public_id)
    VALUES ($1, $2, $3, $4);
  `;

  try {
    await pool.query(query, [url, coordinates, description, public_id]);
    console.log("Record inserted successfully.");
  } catch (error) {
    console.error("Database error:", error);
  }
}

// Print all rows
async function printRows() {
  const query = "SELECT * FROM Princeton_pictures";
  try {
    const result = await pool.query(query);
    result.rows.forEach((row) => console.log(row));
  } catch (error) {
    console.error("Error retrieving rows:", error);
  }
}

// Clear the table and reset sequence
async function clearTable() {
  const deleteQuery = "DELETE FROM Princeton_pictures";
  const resetSequenceQuery =
    "ALTER SEQUENCE princeton_pictures_id_seq RESTART WITH 1";

  try {
    await pool.query(deleteQuery);
    await pool.query(resetSequenceQuery);
    console.log("Table cleared and sequence reset.");
  } catch (error) {
    console.error("Error clearing table:", error);
  }
}

// Get URLs and public IDs
async function getUrls() {
  const query = "SELECT URL, public_id FROM Princeton_pictures";
  try {
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      url: row.url,
      public_id: row.public_id,
    }));
  } catch (error) {
    console.error("Error retrieving URLs:", error);
    return [];
  }
}

// Remove a picture by public ID
async function removePicture(public_id) {
  const query = "DELETE FROM Princeton_pictures WHERE public_id = $1";
  try {
    await pool.query(query, [public_id]);
    console.log("Record deleted successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error deleting record:", error);
    return { error: "Database error" };
  }
}

// Edit picture metadata
async function editPicture(
  public_id,
  newLatitude = null,
  newLongitude = null,
  newDescription = null
) {
  const selectQuery =
    "SELECT coordinates[1], coordinates[2], label_description FROM Princeton_pictures WHERE public_id = $1";
  const updateQuery = `
    UPDATE Princeton_pictures
    SET coordinates = ARRAY[$1, $2], label_description = $3
    WHERE public_id = $4;
  `;

  try {
    // Retrieve current values if any fields are missing
    const result = await pool.query(selectQuery, [public_id]);
    if (result.rowCount === 0) {
      console.log("Record not found.");
      return { error: "Record not found." };
    }

    const [currentLatitude, currentLongitude, currentDescription] =
      result.rows[0];
    const latitude = newLatitude || currentLatitude;
    const longitude = newLongitude || currentLongitude;
    const description = newDescription || currentDescription;

    // Update the record
    await pool.query(updateQuery, [
      latitude,
      longitude,
      description,
      public_id,
    ]);
    console.log("Record updated successfully.");
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Database error" };
  }
}

module.exports = {
  insertPicture,
  printRows,
  clearTable,
  getUrls,
  removePicture,
  editPicture,
};
