const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContactByID,
  updateContact,
  deleteContact,
  createContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

router.route("/").get(getAllContacts);

router.route("/").post(createContact);

router.route("/:id").get(getContactByID);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

module.exports = router;
