import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema(
  {
    size_name: {
      type: String,
      required: true
    },
    size_height: {
      type: Number, //Chiều cao (cm)
      required: true
    },
    size_length: {
      type: Number, // Chiều dài (cm)
      required: true
    },
    size_weight: {
      type: Number, //trọng lượng hàng hóa (gram)
      required: true
    },
    size_width: {
      type: Number, //Chiều rộng (cm)
      required: true
    },
    size_price: {
      type: Number,
      required: true
    },
    size_info: {
      type: String,
      default: 'norma'
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Size', sizeSchema);
