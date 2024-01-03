import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Brand', brandSchema);
