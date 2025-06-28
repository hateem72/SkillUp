import Feedback from "../models/feedback.model.js";
import createError from "../utils/createError.js";

export const saveFeedback = async (req, res, next) => {
  const { type, topic, trainerName, feedback } = req.body;

  if (!type || !topic || !trainerName || !feedback) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
   
    JSON.parse(feedback);
    const feedbackEntry = new Feedback({
      userId: req.userId,
      type,
      topic,
      trainerName,
      feedback,
    });
    await feedbackEntry.save();
   
    res.status(201).json({ feedbackId: feedbackEntry._id, feedback: feedbackEntry });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(400).json({ error: 'Invalid feedback JSON or server error' });
  }
};

export const getUserFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ userId: req.userId });
    res.json(feedback);
  } catch (err) {
    console.error('Feedback fetch error:', err);
    res.status(500).json({ error: 'Server error while fetching feedback' });
  }
};


export const deleteFeedback = async (req, res, next) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findOne({ _id: id, userId: req.userId });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found or you are not authorized' });
    }
    await Feedback.deleteOne({ _id: id });
    console.log('Feedback deleted:', { feedbackId: id });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('Feedback deletion error:', err);
    res.status(500).json({ error: 'Server error while deleting feedback' });
  }
};