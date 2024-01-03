import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";

const ContactSchema = mongoose.Schema({
    contact_name: {
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        unique: true,
        required: true
    },
    contact_phone: {
        type: String,
        required: true
    },
    contact_description: {
        type: String,
        required: true
    }
},
    { timestamps: true, versionKey: false });
ContactSchema.plugin(mongoosePaginate);
ContactSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Contact", ContactSchema)