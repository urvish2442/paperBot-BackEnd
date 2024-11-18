import {
    getDynamicQuestionModel,
    Subject,
} from "../../../models/apps/paper-bot/subjects.models";
import { ApiResponse } from "../../../utils/ApiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import { buildQueryForSubjects } from "../../../utils/queryBuilders";

const generateModelName = (board, standard, name, medium, code) =>
    `${board}_${standard}_${name}_${code}_${medium}_QUESTIONS`.toUpperCase();

const getAllSubjects = asyncHandler(async (req, res) => {
    const { aggregatePipeline, paginationOptions } = buildQueryForSubjects(req);

    const subjects = await Subject.aggregatePaginate(
        aggregatePipeline,
        paginationOptions
    );

    if (!subjects || subjects.subjects.length === 0) {
        throw new ApiError(404, "No subjects found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

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

    const subjectData = {
        board,
        standard,
        name,
        medium,
        code,
        schools: [req.user._id],
        created_by: req.user._id,
        model_name: generatedModelName,
        price,
    };

    const newSubject = new Subject(subjectData);
    await newSubject.save();

    const QuestionModel = getDynamicQuestionModel(
        board,
        standard,
        name,
        medium,
        code
    );

    console.log(
        "🚀 ~ createSubject ~ QuestionModel.collection.collectionName - Dynamic collection created:",
        QuestionModel.collection.collectionName
    );

    return res
        .status(201)
        .json(new ApiResponse(201, newSubject, "Subject created successfully"));
});

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

const deleteSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Subject deleted successfully"));
});

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

const addMultipleUnits = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { units } = req.body;

    if (!Array.isArray(units) || units.length === 0) {
        throw new ApiError(400, "Units must be a non-empty array");
    }

    const subject = await Subject.findById(id);
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    subject.units.push(...units);
    await subject.save();

    return res
        .status(200)
        .json(new ApiResponse(200, subject.units, "Units added successfully"));
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
};
