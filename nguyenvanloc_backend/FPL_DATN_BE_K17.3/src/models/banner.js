import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import MongooseDelete from "mongoose-delete";

const bannerSchema = mongoose.Schema({
  image: {
    type: Object,
    required: true,
  },
},
{ timestamps: true, versionKey: false });
bannerSchema.plugin(mongoosePaginate);
bannerSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true });
export default mongoose.model("Banner", bannerSchema)
