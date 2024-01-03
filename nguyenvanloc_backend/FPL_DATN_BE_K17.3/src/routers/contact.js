import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";
import { addContact, getAllContact, getAllDeleteContact, getContactById, removeContact, removeForceContact, restoreContact, updateContact } from "../controllers/contact.js";

const routerContact = express.Router();

routerContact.get("/contact", getAllContact)
routerContact.get("/contact/:id", getContactById)
routerContact.get("/contact/delete", getAllDeleteContact)
routerContact.delete("/contact/:id", authenticate, authorization, removeContact)
routerContact.delete("/contact/force/:id", authenticate, authorization, removeForceContact)
routerContact.post("/contact", authenticate, authorization, addContact)
routerContact.patch("/contact/:id", authenticate, authorization, updateContact)
routerContact.patch("/contact/restore/:id", authenticate, authorization, restoreContact)

export default routerContact;