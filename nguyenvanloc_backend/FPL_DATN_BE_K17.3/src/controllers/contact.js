
import Contact from "../models/contact.js";
import { ContactSchema } from "../schemas/contact.js";

export const getAllContact = async (req, res) => {
    const {
        _limit = 10,
        _sort = "createdAt",
        _order = "desc",
        _page = 1,
        q,
    } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [(_sort === "createdAt" ? "createdAt" : _sort)]: _order === "desc" ? -1 : 1,
        },
    };

    const searchQuery = q ? { name: { $regex: q, $options: "i" } } : {};
    try {
        const contact = await Contact.paginate(searchQuery, options);
        if (contact.length === 0) {
            return res.status(404).json({
                message: "Không có liên hệ!",
            });
        }
        return res.status(200).json({
            message: "Lấy tất cả liên hệ thành công!",
            contact,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const getAllDeleteContact = async (req, res) => {
    try {
        const contact = await Contact.findWithDeleted({ deleted: true });
        return res.status(200).json({
            message: "Lấy tất cả liên hệ đã bị xóa thành công",
            contact
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact || contact.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy liên hệ",
            });
        }
        return res.status(200).json({
            message: "Lấy 1 liên hệ thành công",
            contact,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const removeContact = async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await Contact.deleteById(id);
        return res.status(200).json({
            message: "Xoá liên hệ thành công!",
            contact
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const removeForceContact = async (req, res) => {
    try {
        const contact = await Contact.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Xoá liên hệ vĩnh viễn",
            contact
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const addContact = async (req, res) => {
    try {
        const { contact_email } = req.body;
        const formData = req.body;
        const data = await Contact.findOne({ contact_email });
        if (data) {
            return res.status(400).json({
                message: "Email liên hệ đã tồn tại",
            });
        }
        const { error } = ContactSchema.validate(formData, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const contact = await Contact.create(formData);
        if (!contact || contact.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy liên hệ",
            });
        }
        return res.status(200).json({
            message: "Thêm liên hệ thành công",
            contact,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const restoreContact = async (req, res) => {
    try {
        const restoredContact = await Contact.restore({ _id: req.params.id }, { new: true });
        if (!restoredContact) {
            return res.status(400).json({
                message: "Liên hệ không tồn tại hoặc đã được khôi phục trước đó.",
            });
        }
        return res.status(200).json({
            message: "Khôi phục liên hệ thành công.",
            contacts: restoredContact,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const updateContact = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = ContactSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const contact = await Contact.findOneAndUpdate({ _id: id }, body, {
            new: true,
        });
        if (!contact || contact.length === 0) {
            return res.status(400).json({
                message: "Cập nhật tin tức thất bại",
            });
        }
        return res.status(200).json({
            message: "Cập nhật tin tức thành công",
            contact,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
