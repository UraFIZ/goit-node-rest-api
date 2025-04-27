import HttpError from "../helpers/HttpError.js";
import { 
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
} from "../services/contactsServices.js";


export const getAllContacts = async (_, res, next) => {
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
    const updatedContact = await updateContact(req.params.id, req.body);
    
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    
    const contact = await updateStatusContact(contactId, { favorite });
    res.json(contact);
  } catch (error) {
    next(error);
  }
};
