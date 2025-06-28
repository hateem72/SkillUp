import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['debate', 'interview', 'speech'],
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
  feedback: {
    type: String, // Store JSON as string
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Feedback", feedbackSchema);