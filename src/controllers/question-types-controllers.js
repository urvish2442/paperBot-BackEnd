import {
    AvailableBoards,
    AvailableSubjects,
    AvailableMediums,
    AvailableStandards,
} from "../constants.js";
import { QuestionTypes } from "../models/que-types-models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new Question Type
const createQuestionType = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const isAdmin = req.user.role === "ADMIN";
    const questionType = {
        name,
        description,
        created_by: req.user._id,
        isActive: isAdmin,
    };

    const createdQuestionType = await QuestionTypes.create(questionType);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdQuestionType,
                "Question Type created successfully"
            )
        );
});

// Get all Question Types with pagination
const getQuestionTypes = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const paginationOptions = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        customLabels: {
            totalDocs: "count",
            docs: "data",
        },
    };

    const questionTypes = await QuestionTypes.aggregatePaginate(
        QuestionTypes.aggregate([
            { $match: { isActive: true } },
            { $sort: { name: 1 } },
        ]),
        paginationOptions
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                questionTypes,
                "Active Question Types retrieved successfully"
            )
        );
});

// Get a single active Question Type by ID
const getQuestionTypeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const questionType = await QuestionTypes.findOne({
        _id: id,
        isActive: true,
    }).populate("created_by");

    if (!questionType) {
        throw new ApiError(404, "Active Question Type not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                questionType,
                "Active Question Type retrieved successfully"
            )
        );
});

// Update a Question Type by ID
const updateQuestionType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const questionType = await QuestionTypes.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    if (!questionType) {
        throw new ApiError(404, "Question Type not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                questionType,
                "Question Type updated successfully"
            )
        );
});

// Soft delete a Question Type by ID
const deleteQuestionType = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const questionType = await QuestionTypes.findById(id);

    if (!questionType) {
        throw new ApiError(404, "Question Type not found");
    }

    // Perform soft delete by setting isActive to false
    questionType.isActive = false;
    await questionType.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Question Type soft deleted successfully"
            )
        );
});

const getAllConstants = asyncHandler(async (req, res) => {
    const questionTypes = await QuestionTypes.find({ isActive: true })
        .sort({ name: 1 })
        .lean();

    const constants = {
        boards: AvailableBoards,
        subjects: AvailableSubjects,
        mediums: AvailableMediums,
        standards: AvailableStandards,
        questionTypes: questionTypes,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(200, constants, "All Filters fetched successfully")
        );
});

export {
    createQuestionType,
    getQuestionTypes,
    getQuestionTypeById,
    updateQuestionType,
    deleteQuestionType,
    getAllConstants,
};
