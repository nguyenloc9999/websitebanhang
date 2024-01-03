import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";

const newsSchema = mongoose.Schema({
  new_name: {
    type: String,
    minLength: 3,
    maxlength: 50,
  },
  new_image: {
    type: Object,
    required: true
  },
  new_description: {
    type: String, 
    required: true
  },
},
  { timestamps: true, versionKey: false });

newsSchema.plugin(mongoosePaginate);
newsSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
export default mongoose.model("News", newsSchema)