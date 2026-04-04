const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  timeLimit: {
    type: Number,
  },
  answer: {
    type: String,
  },
  feedback: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  confidence: {
    type: Number,
    default: 0,
  },
  communication: {
    type: Number,
    default: 0,
  },
  correctness: {
    type: String,
    default: 0,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "technical"],
      default: "technical",
      required: true,
    },
    resumeText: {
      type: String,
    },
    questions: [questionsSchema],
    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);
module.exports = Interview;