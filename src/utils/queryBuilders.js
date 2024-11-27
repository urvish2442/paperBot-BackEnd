import {
    AvailableBoards,
    AvailableSubjects,
    AvailableMediums,
    AvailableStandards,
    AvailableQuestionTypes,
} from "../constants.js";
export const buildQueryForSubjects = (req) => {
    const reqQuery = { ...req.query };
    let match = {};
    let sort = { name: 1 };

    const page = Number(reqQuery.page) || 1;
    const limit = Number(reqQuery.limit) || 10;
    const skip = (page - 1) * limit;

    for (const key of Object.keys(reqQuery)) {
        if (!reqQuery[key]) continue;

        switch (key) {
            case "board":
                if (AvailableBoards.includes(reqQuery.board)) {
                    match.board = reqQuery.board;
                }
                break;
            case "name":
                if (AvailableSubjects.includes(reqQuery.name)) {
                    match.name = reqQuery.name;
                }
                break;
            case "medium":
                if (AvailableMediums.includes(reqQuery.medium)) {
                    match.medium = reqQuery.medium;
                }
                break;
            case "standard":
                if (AvailableStandards.includes(reqQuery.standard)) {
                    match.standard = reqQuery.standard;
                }
                break;
            case "search":
                match.$or = [
                    { name: { $regex: reqQuery.search, $options: "i" } },
                    { model_name: { $regex: reqQuery.search, $options: "i" } }, // Add more fields as needed
                ];
                break;
            case "isActive":
                match.isActive = reqQuery.isActive === "true";
                break;
            case "sortBy":
                if (reqQuery.sortBy) {
                    const field = reqQuery.sortBy.startsWith("-")
                        ? reqQuery.sortBy.slice(1) // Remove the "-" prefix
                        : reqQuery.sortBy;

                    if (["name", "board", "standard"].includes(field)) {
                        sort[field] = reqQuery.sortBy.startsWith("-") ? -1 : 1; // Descending for "-" prefix
                    } else {
                        sort.subject = 1; // Default sorting
                    }
                }
                break;

            default:
                break;
        }
    }

    return {
        aggregatePipeline: [
            { $match: match },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ],
        paginationOptions: {
            page,
            limit,
            customLabels: {
                totalDocs: "count",
                docs: "data",
            },
        },
    };
};

export const buildQueryForQuestions = (req) => {
    const reqQuery = { ...req.query };
    let match = { isActive: true, isVerified: true };
    let sort = {};

    const page = Number(reqQuery.page) || 1;
    const limit = Number(reqQuery.limit) || 15;
    const skip = (page - 1) * limit;

    for (const key of Object.keys(reqQuery)) {
        if (!reqQuery[key]) continue;

        switch (key) {
            case "type":
                if (AvailableQuestionTypes.includes(reqQuery.type)) {
                    match.type = reqQuery.type;
                }
                break;
            case "unit":
                match.unit = reqQuery.unit;
                break;
            case "search":
                match.$or = [
                    { question: { $regex: reqQuery.search, $options: "i" } },
                    { answer: { $regex: reqQuery.search, $options: "i" } },
                    { queDetails: { $regex: reqQuery.search, $options: "i" } },
                ];
                break;
            case "createdBy":
                match.created_by = reqQuery.createdBy;
                break;
            case "marks":
                match.marks = Number(reqQuery.marks);
                break;
            case "isActive":
                match.isActive = reqQuery.isActive === "true";
                break;
            case "isVerified":
                match.isVerified = reqQuery.isVerified === "true";
                break;
            case "sortBy":
                if (["type", "unit", "created_by"].includes(reqQuery.sortBy)) {
                    sort[reqQuery.sortBy] =
                        reqQuery.sortOrder === "desc" ? -1 : 1;
                } else {
                    sort.created_by = 1; // Default sorting
                }
                break;
            default:
                break;
        }
    }

    return {
        match,
        sort,
        paginationOptions: {
            page,
            limit,
            customLabels: {
                totalDocs: "count",
                docs: "docs",
            },
        },
    };
};
