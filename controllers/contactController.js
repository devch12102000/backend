const asyncHandler = require("express-async-handler");
const ContactModel = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await ContactModel.find({ user_id: req.user.id }).skip((req.query.pageNo-1)*req.query.pageSize).limit(req.query.pageSize);
  const allContacts = await ContactModel.find({ user_id: req.user.id })
  const response = {
    data: contacts,
    total: allContacts.length
  }
  res.status(200).json(response);
});

//@desc Create contact
//@route PUT /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json("All fields are mandatory !");
    throw new Error("All fields are mandatory !");
  }
  const createContactData = await ContactModel.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });
  res.status(201).json(createContactData);
});

//@desc Get contact by ID
//@route GET /api/contacts/:id
//@access private
const getContactByID = asyncHandler(async (req, res) => {
  const contactByID = await ContactModel.findById(req.params.id);
  if (!contactByID) {
    res.status(404).json("Contact not found");
    throw new Error("Contact not found");
  }
  if(contactByID.user_id.toString() != req.user.id){
    res.status(403);
    throw new Error ("User does now have permission to update other contacts")
  }
  res.status(200).json(contactByID);
});

//@desc Put contact by ID
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contactByID = await ContactModel.findById(req.params.id);
  if (!contactByID) {
    res.status(404).json("Contact not found");
    throw new Error("Contact not found");
  }
  if(contactByID.user_id.toString() != req.user.id){
    res.status(403);
    throw new Error ("User does now have permission to delete other contacts")
  }
  const updatedContact = await ContactModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  console.log(updatedContact);
  res.status(200).json(updatedContact);
});

//@desc Delete contact by ID
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contactByID = await ContactModel.findById(req.params.id);
  if (!contactByID) {
    res.status(404).json("Contact not found");
    throw new Error("Contact not found");
  }
  if(contactByID.user_id.toString() != req.user.id){
    res.status(403);
    throw new Error ("User does now have permission to update other contacts")
  }
  const result = await ContactModel.deleteOne(contactByID);
  res.status(200).json(result);
});

module.exports = {
  getAllContacts,
  getContactByID,
  updateContact,
  deleteContact,
  createContact,
};
