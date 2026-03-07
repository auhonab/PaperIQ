import mongoose from 'mongoose';

const PaperSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: [true, 'Please provide a file name'],
    trim: true,
  },
  fileSize: {
    type: Number,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  // Analysis counts
  elifCount: {
    type: Number,
    default: 0,
  },
  scholarSightCount: {
    type: Number,
    default: 0,
  },
  chatMessageCount: {
    type: Number,
    default: 0,
  },
  // Last accessed
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster queries
PaperSchema.index({ userId: 1, uploadedAt: -1 });

export default mongoose.models.Paper || mongoose.model('Paper', PaperSchema);
