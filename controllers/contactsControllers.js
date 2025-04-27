import HttpError from "../helpers/HttpError.js";
import { 
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
} from "../services/contactsServices.js";


export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await removeContact(req.params.id);
    
    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }
    
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    
    if (Object.keys(body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    
    const updatedContact = await updateContact(id, body);
    
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
