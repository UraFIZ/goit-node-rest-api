import Contact from '../models/contact.js';
import HttpError from '../helpers/HttpError.js';

async function listContacts(owner, query = {}) {
  try {
    const { page = 1, limit = 20, favorite } = query;
    const skip = (page - 1) * limit;
    
    const whereConditions = { owner };
    
    if (favorite !== undefined) {
      whereConditions.favorite = favorite === 'true';
    }
    
    const contacts = await Contact.findAndCountAll({
      where: whereConditions,
      limit: Number(limit),
      offset: skip,
      order: [['createdAt', 'DESC']]
    });
    
    const totalItems = contacts.count;
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      contacts: contacts.rows,
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  } catch (error) {
    console.error("Error reading contacts:", error.message);
    return {
      contacts: [],
      page: 1,
      limit: Number(limit),
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    return contact;
  } catch (error) {
    console.error("Error getting contact by ID:", error.message);
    return null;
  }
}

async function removeContact(contactId) {
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

async function addContact(data) {
  try {
    const newContact = await Contact.create(data);
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error.message);
    return null;
  }
}

async function updateContact(contactId, data) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    
    await contact.update(data);
    return contact;
  } catch (error) {
    console.error("Error updating contact:", error.message);
    return null;
  }
}

async function updateStatusContact (contactId, { favorite }) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  
  await contact.update({ favorite });
  return contact;
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};