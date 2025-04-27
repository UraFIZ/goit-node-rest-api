import express from "express";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";
import {
  getAllContacts,
  getContactById,
  removeContact,
  createContact,
  updateContactById,
  updateStatusContact
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getContactById);

contactsRouter.delete("/:id", removeContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContactById);

contactsRouter.patch(
  "/:contactId/favorite", 
  validateBody(updateStatusSchema), 
  updateStatusContact
);

export default contactsRouter;
