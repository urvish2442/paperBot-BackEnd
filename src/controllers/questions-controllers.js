import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { buildQueryForQuestions } from "../utils/queryBuilders.js";
import { checkModelExistence } from "../models/modelSchemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRolesEnum } from "../constants.js";
import { Subject } from "../models/subjects-models.js";

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

    const QuestionModel = await checkModelExistence(modelName);
    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }
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

    const QuestionModel = await checkModelExistence(modelName);
    if (!QuestionModel) {
        throw new ApiError(404, `Question model '${modelName}' not found`);
    }

    const question = await QuestionModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!question) throw new ApiError(404, "Question not found");

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question updated successfully"));
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
