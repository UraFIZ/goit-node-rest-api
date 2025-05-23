import contactsService from "../services/contactsServices.js";


export const getAllContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    
    const result = await contactsService.listContacts(owner, req.query);
    
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        contacts: result.contacts,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const contactId = req.params.id;

    const contact = await contactsService.getContactById(contactId, userId);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const removeContact = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const contactId = req.params.id;

    const deletedContact = await contactsService.removeContact(contactId, userId);

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const newContact = await contactsService.addContact({ ...req.body, owner });
    res.status(201).json({
      id: newContact.id,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const contactId = req.params.id;

    const updatedContact = await contactsService.updateContact(contactId, req.body, userId);

    res.status(200).json({
      id: updatedContact.id,
      name: updatedContact.name,
      email: updatedContact.email,
      phone: updatedContact.phone
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { contactId } = req.params;
    const { favorite } = req.body;

    const contact = await contactsService.updateStatusContact(contactId, { favorite }, userId);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};
