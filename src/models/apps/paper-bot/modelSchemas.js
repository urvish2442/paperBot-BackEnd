import mongoose, { Schema } from "mongoose";

// Define the fixed schema for questions
const questionSchema = new Schema(
    {
        type: { type: String, required: true },
        unit: {
            type: Schema.Types.ObjectId,
            ref: "Subject.units",
            required: true,
        },
        question: { type: String, required: true }, // HTML string for formatted questions
        answer: { type: String, required: true },
        queDetails: { type: String, required: true },
        isFormatted: { type: Boolean, default: false },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Export the schema to reuse dynamically
export const QuestionSchema = questionSchema;
