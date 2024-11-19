import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

questionSchema.plugin(mongooseAggregatePaginate);
export const QuestionSchema = questionSchema;

export const checkModelExistence = async (modelName) => {
    try {
        // Get the list of collections in the current database
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        // Check if the collection exists
        const collectionExists = collections.some(
            (collection) => collection.name === modelName
        );

        if (!collectionExists) {
            return false;
        }

        // Dynamically return the model if collection exists
        return mongoose.model(modelName); // Assumes the model is registered already
    } catch (error) {
        console.error("Error checking collection existence:", error);
        throw new Error("Unable to check collection existence");
    }
};
