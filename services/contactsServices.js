import Contact from '../models/contact.js';
import HttpError from '../helpers/HttpError.js';

export async function listContacts() {
  try {
    const contacts = await Contact.findAll();
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error.message);
    return [];
  }
}

export async function getContactById(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    console.error("Error getting contact by ID:", error.message);
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    await contact.destroy();
    return contact;
  } catch (error) {
    console.error("Error removing contact:", error.message);
    return null;
  }
}

export async function addContact(data) {
  try {
    const newContact = await Contact.create(data);
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error.message);
    return null;
  }
}

export async function updateContact(contactId, data) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    
    await contact.update(data);
  } catch (error) {
    console.error("Error updating contact:", error.message);
    return null;
  }
}

export const updateStatusContact = async (contactId, { favorite }) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  
  await contact.update({ favorite });
  return contact;
};