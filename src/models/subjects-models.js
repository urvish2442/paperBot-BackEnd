import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { QuestionSchema } from "./modelSchemas.js";
import {
    AvailableBoards,
    AvailableMediums,
    AvailableStandards,
    AvailableSubjects,
} from "../constants.js";
import { User } from "./user-models.js";

const subjectSchema = new Schema(
    {
        board: {
            type: String,
            enum: AvailableBoards,
            required: true,
        },
        schools: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            default: [],
        },
        standard: {
            type: String,
            enum: AvailableStandards,
            required: true,
        },
        name: {
            type: String,
            enum: AvailableSubjects,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        medium: {
            type: String,
            enum: AvailableMediums,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        units: {
            type: [
                {
                    number: { type: Number, required: true },
                    name: { type: String, required: true },
                    isActive: { type: Boolean, default: true },
                },
            ],
            default: [],
        },
        questionTypes: {
            type: [
                {
                    name: { type: String, required: true },
                    description: { type: String, required: true },
                },
            ],
            default: [],
        },
        outlines: {
            type: [
                {
                    marks: { type: Number },
                    outlineId: { type: Schema.Types.ObjectId, ref: "Outline" },
                },
            ],
            default: [],
        },
        model_name: {
            type: String,
            required: true,
            unique: true,
        },
        isSequenceRequired: {
            type: Boolean,
            default: false,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

subjectSchema.plugin(mongooseAggregatePaginate);
export const Subject = mongoose.model("Subject", subjectSchema);

export const getDynamicQuestionModel = (generatedName) => {
    if (mongoose.models[generatedName]) {
        return mongoose.models[generatedName];
    }
    return mongoose.model(generatedName, QuestionSchema);
};
