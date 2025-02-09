import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            default: "",
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

schema.plugin(mongooseAggregatePaginate);

schema.pre("save", async function (next) {
    const questionType = this;

    if (!questionType.isModified("name")) return next();

    const existingType = await mongoose.models.que_types.findOne({
        name: questionType.name,
    });

    if (existingType) {
        const err = new Error("Name must be unique.");
        err.statusCode = 400;
        return next(err);
    }

    next();
});

export const QuestionTypes = mongoose.model("que_types", schema);
