import {
    AvailableBoards,
    AvailableSubjects,
    AvailableMediums,
    AvailableStandards,
} from "../constants.js";
export const buildQueryForSubjects = (req) => {
    const reqQuery = { ...req.query };
    let match = {};
    let sort = {};

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
            case "subject":
                if (AvailableSubjects.includes(reqQuery.subject)) {
                    match.subject = reqQuery.subject;
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
                match.name = { $regex: reqQuery.search, $options: "i" };
                break;
            case "sortBy":
                if (
                    ["subject", "board", "standard"].includes(reqQuery.sortBy)
                ) {
                    sort[reqQuery.sortBy] =
                        reqQuery.sortOrder === "desc" ? -1 : 1;
                } else {
                    sort.subject = 1;
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
                totalDocs: "totalSubjects",
                docs: "subjects",
            },
        },
    };
};
