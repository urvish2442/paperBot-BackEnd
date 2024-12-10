import { getDynamicQuestionModel, Subject } from "../models/subjects-models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { buildQueryForSubjects } from "../utils/queryBuilders.js";
import {
    AvailableBoards,
    AvailableSubjects,
    AvailableMediums,
    AvailableStandards,
    AvailableQuestionTypes,
} from "../constants.js";

const generateModelName = (board, standard, name, medium, code) =>
    `${board}_${standard}_${name}_${code}_${medium}_QUESTIONS`.toLowerCase();

//** Get All Subjects */
const getAllSubjects = asyncHandler(async (req, res) => {
    const { aggregatePipeline, paginationOptions } = buildQueryForSubjects(req);
    const subjects = await Subject.aggregatePaginate(
        Subject.aggregate(aggregatePipeline),
        paginationOptions
    );

    if (!subjects) {
        throw new ApiError(404, "No subjects found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

//** Create Subject */
const createSubject = asyncHandler(async (req, res) => {
    const { board, standard, name, medium, code, price } = req.body;

    if (!board || !standard || !name || !medium || !code) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const generatedModelName = generateModelName(
        board,
        standard,
        name,
        medium,
        code
    );
    const existingSubject = await Subject.findOne({
        model_name: generatedModelName,
    });
    if (existingSubject) {
        throw new ApiError(
            400,
            `Subject with model name '${generatedModelName}' already exists.`
        );
    }

    const subjectData = {
        board,
        standard,
        name,
        medium,
        code,
        created_by: req?.user._id,
        model_name: generatedModelName,
        price,
    };

    const newSubject = new Subject(subjectData);
    await newSubject.save();

    const QuestionModel = getDynamicQuestionModel(generatedModelName);

    console.log(
        "🚀 ~ createSubject ~ QuestionModel.collection.collectionName - Dynamic collection created:",
        QuestionModel.collection.collectionName
    );

    return res
        .status(201)
        .json(new ApiResponse(201, newSubject, "Subject created successfully"));
});

//** Get Subject by ID */
const getSubjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findById(id).populate("schools created_by");
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject fetched successfully"));
});

//** Update Subject */
const updateSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedSubject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedSubject, "Subject updated successfully")
        );
});

//**ADD Multiple Units */

const addMultipleUnits = asyncHandler(async (req, res) => {
    const { id } = req.params; // Subject ID from URL
    const { units } = req.body; // Units array from request body

    // Validate input
    if (!Array.isArray(units)) {
        throw new ApiError(400, "Invalid input: units must be an array.");
    }

    try {
        // Update the units array
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { units },
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            throw new ApiError(404, "Subject not found.");
        }

        res.status(200).json({
            success: true,
            message: "Units updated successfully.",
            data: updatedSubject,
        });
    } catch (error) {
        console.error("Error updating units:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating units.",
            error: error.message,
        });
    }
});

//** Delete Subject */
const deleteSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    throw new ApiError(404, "Subject Delete is not permitted");
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Subject deleted successfully"));
});

//** Add School to Subject */
const addSchoolToSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { schoolId } = req.body;

    if (!schoolId) {
        throw new ApiError(400, "School ID is required");
    }

    const subject = await Subject.findByIdAndUpdate(
        id,
        { $addToSet: { schools: schoolId } },
        { new: true }
    );

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "School added successfully"));
});

//** Remove School from Subject */
const removeSchoolFromSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { schoolId } = req.body;

    if (!schoolId) {
        throw new ApiError(400, "School ID is required");
    }

    const subject = await Subject.findByIdAndUpdate(
        id,
        { $pull: { schools: schoolId } },
        { new: true }
    );

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "School removed successfully"));
});

//** Toggle Subject Status */
const toggleSubjectStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
        throw new ApiError(400, "Invalid status value");
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
    );

    if (!updatedSubject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedSubject,
                `Subject ${isActive ? "activated" : "deactivated"} successfully`
            )
        );
});

const getAllConstants = asyncHandler(async (req, res) => {
    const constants = {
        boards: AvailableBoards,
        subjects: AvailableSubjects,
        mediums: AvailableMediums,
        standards: AvailableStandards,
        questionTypes: AvailableQuestionTypes,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(200, constants, "All Filters fetched successfully")
        );
});

export {
    getAllSubjects,
    createSubject,
    getSubjectById,
    updateSubject,
    deleteSubject,
    addSchoolToSubject,
    removeSchoolFromSubject,
    toggleSubjectStatus,
    addMultipleUnits,
    getAllConstants,
};
