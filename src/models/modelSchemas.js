import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the fixed schema for questions
const questionSchema = new Schema(
    {
        type: {
            type: Schema.Types.ObjectId,
            ref: "Subject.questionTypes",
            required: true,
        },
        isFormatted: { type: Boolean, default: false },
        question: {
            type: Schema.Types.Mixed,
            required: true,
            validate: {
                validator: function (value) {
                    return (
                        typeof value === "string" || typeof value === "object"
                    );
                },
                message: "Question must be either a string or an object.",
            },
        },
        answer: {
            type: String,
            required: true,
        },
        // queDetails: { type: String, required: true },
        marks: { type: Number, required: true },
        unit: {
            type: Schema.Types.ObjectId,
            ref: "Subject.units",
            required: true,
        },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

questionSchema.plugin(mongooseAggregatePaginate);
export const QuestionSchema = questionSchema;

export const checkModelExistence = async (modelName) => {
    try {
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        const collectionExists = collections.some(
            (collection) => collection.name === modelName
        );

        if (!collectionExists) {
            return false;
        }

        return mongoose.model(modelName, QuestionSchema);
    } catch (error) {
        console.error("Error checking collection existence:", error);
        throw new Error("Unable to check collection existence");
    }
};
