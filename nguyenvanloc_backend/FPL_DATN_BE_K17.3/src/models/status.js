import mongoose from 'mongoose';

const statusSchema = mongoose.Schema({
    status_name: {
        type: String,
        required: true,
        unique: true
    },
    status_description: {
        type: String
    }
});

export default mongoose.model('Status', statusSchema);