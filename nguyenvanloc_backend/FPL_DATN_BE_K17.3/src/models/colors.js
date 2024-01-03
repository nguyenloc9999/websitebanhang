import mongoose from 'mongoose';

const colorSchema = mongoose.Schema({
    colors_name: {
        type: String,
        required: true,
    },
    color_price: {
        type: Number,
        required: true
    },
});

export default mongoose.model('Color', colorSchema);