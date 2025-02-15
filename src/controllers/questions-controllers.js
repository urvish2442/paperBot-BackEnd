import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { buildQueryForQuestions } from "../utils/queryBuilders.js";
import { checkModelExistence } from "../models/modelSchemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRolesEnum } from "../constants.js";
import { Subject } from "../models/subjects-models.js";
import mongoose from "mongoose";

// Get All Questions
export const getQuestions = asyncHandler(async (req, res) => {
    const { modelName } = req.params;

    const QuestionModel = await checkModelExistence(modelName);

    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }

    const { match, sort, paginationOptions } = buildQueryForQuestions(req);

    const questions = await QuestionModel.aggregatePaginate(
        [{ $match: match }, { $sort: sort }],
        paginationOptions
    );

    // if (!questions || questions?.count === 0) {
    //     throw new ApiError(404, "No questions found");
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(200, questions, "Questions fetched successfully")
        );
});

// Create Question
export const createQuestion = asyncHandler(async (req, res) => {
    const { modelName } = req.params;
    const { unit, type } = req.body;

    const [QuestionModel, subject] = await Promise.all([
        checkModelExistence(modelName),
        Subject.findOne({ model_name: modelName }),
    ]);

    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    const unitSet = new Set(subject.units.map((u) => u._id.toString()));
    const typeSet = new Set(subject.questionTypes.map((t) => t._id.toString()));

    if (!unitSet.has(unit)) {
        throw new ApiError(400, "Invalid unit. Not found in subject units.");
    }
    if (!typeSet.has(type)) {
        throw new ApiError(
            400,
            "Invalid type. Not found in subject questionTypes."
        );
    }

    // Determine verification status based on user role
    const isVerified = req.user.role === UserRolesEnum.ADMIN;
    const question = { ...req.body, created_by: req.user._id, isVerified };

    const createdQuestion = await QuestionModel.create(question);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdQuestion,
                "Question created successfully"
            )
        );
});

// Get Question by ID
export const getQuestionById = asyncHandler(async (req, res) => {
    const { modelName, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid question ID format");
    }

    const QuestionModel = await checkModelExistence(modelName);
    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }

    const question = await QuestionModel.findById(id);
    if (!question) throw new ApiError(404, "Question not found");

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question fetched successfully"));
});

// Update Question
export const updateQuestion = asyncHandler(async (req, res) => {
    const { modelName, id } = req.params;
    const { unit, type } = req.body;

    const [QuestionModel, subject] = await Promise.all([
        checkModelExistence(modelName),
        Subject.findOne({ model_name: modelName }),
    ]);

    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    const unitSet = new Set(subject.units.map((u) => u._id.toString()));
    const typeSet = new Set(subject.questionTypes.map((t) => t._id.toString()));

    if (unit && !unitSet.has(unit)) {
        throw new ApiError(400, "Invalid unit. Not found in subject units.");
    }
    if (type && !typeSet.has(type)) {
        throw new ApiError(
            400,
            "Invalid type. Not found in subject questionTypes."
        );
    }

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
        }
    );

    if (!updatedQuestion) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedQuestion,
                "Question updated successfully"
            )
        );
});

// Delete Question
export const deleteQuestion = asyncHandler(async (req, res) => {
    const { modelName, id } = req.params;

    const QuestionModel = await checkModelExistence(modelName);
    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }

    const question = await QuestionModel.findByIdAndDelete(id);
    if (!question) throw new ApiError(404, "Question not found");

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Question deleted successfully"));
});

// Toggle Question Status
export const toggleQuestionStatus = asyncHandler(async (req, res) => {
    const { modelName, id } = req.params;

    const QuestionModel = await checkModelExistence(modelName);
    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }

    const question = await QuestionModel.findById(id);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    // Fetch the subject and directly filter for the required unit
    const subject = await Subject.findOne(
        { model_name: modelName, "units._id": question.unit },
        { "units.$": 1 }
    );
    if (!subject || !subject.units.length) {
        throw new ApiError(404, "Unit not found");
    }

    const unit = subject.units[0];

    if (!unit.isActive && !question.isActive) {
        throw new ApiError(400, "Question cannot be active for this unit");
    }

    question.isActive = !question.isActive;
    await question.save();

    res.status(200).json(
        new ApiResponse(200, question, "Question status toggled successfully")
    );
});
