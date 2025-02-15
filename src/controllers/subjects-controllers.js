import { getDynamicQuestionModel, Subject } from "../models/subjects-models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { buildQueryForSubjects } from "../utils/queryBuilders.js";
import { checkModelExistence } from "../models/modelSchemas.js";
import mongoose from "mongoose";
import {
    AvailableBoards,
    AvailableMediums,
    AvailableStandards,
    AvailableSubjects,
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

    if (!Array.isArray(units)) {
        //TODO: validate keys of each unit object
        throw new ApiError(400, "Invalid input: units must be an array.");
    }

    try {
        // Update the units array in the subject
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { units },
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            throw new ApiError(404, "Subject not found.");
        }

        const QuestionModel = await checkModelExistence(
            updatedSubject.model_name
        );
        if (!QuestionModel) {
            throw new ApiError(
                404,
                `Question model '${updatedSubject.model_name}' not found`
            );
        }

        const unitStatuses = units.reduce((map, unit) => {
            map[unit._id] = unit.isActive;
            return map;
        }, {});

        const bulkOps = Object.entries(unitStatuses)
            .filter(
                ([unitId]) => unitId && mongoose.Types.ObjectId.isValid(unitId)
            )
            .map(([unitId, isActive]) => ({
                updateMany: {
                    filter: { unit: new mongoose.Types.ObjectId(unitId) },
                    update: { $set: { isActive } },
                },
            }));

        if (bulkOps.length > 0) {
            await QuestionModel.bulkWrite(bulkOps);
        }

        // for (const [unitId, isActive] of Object.entries(unitStatuses)) {
        //     if (unitId && mongoose.Types.ObjectId.isValid(unitId)) {
        //         await QuestionModel.updateMany(
        //             { unit: mongoose.Types.ObjectId(unitId) },
        //             { $set: { isActive } }
        //         );
        //     }
        // }

        res.status(200).json({
            success: true,
            message: "Units and questions updated successfully.",
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

const addOrUpdateMultipleQuestionTypes = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { questionTypes } = req.body;

    if (!Array.isArray(questionTypes) || questionTypes.length === 0) {
        throw new ApiError(
            400,
            "Invalid input: questionTypes must be a non-empty array."
        );
    }

    try {
        const subject = await Subject.findById(id);
        if (!subject) {
            throw new ApiError(404, "Subject not found.");
        }

        const existingQuestionTypeMap = new Map(
            subject.questionTypes.map((qt) => [qt._id.toString(), qt])
        );

        questionTypes.forEach((qt) => {
            if (qt._id && existingQuestionTypeMap.has(qt._id)) {
                const existingQT = existingQuestionTypeMap.get(qt._id);
                existingQT.name = qt.name;
                existingQT.description = qt.description;
            } else {
                subject.questionTypes.push(qt);
            }
        });

        await subject.save();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    subject,
                    "Question types updated successfully."
                )
            );
    } catch (error) {
        console.error("Error updating question types:", error);
        throw new ApiError(
            500,
            "An error occurred while updating question types.",
            error.message
        );
    }
});

const getAllConstants = asyncHandler(async (req, res) => {
    const constants = {
        boards: AvailableBoards,
        subjects: AvailableSubjects,
        mediums: AvailableMediums,
        standards: AvailableStandards,
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
    addOrUpdateMultipleQuestionTypes,
    getAllConstants,
};
