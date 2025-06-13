import { body, param, query } from "express-validator";
// import { AvailableQuestionTypes } from "../constants.js";

const createQuestionValidator = () => {
    return [
        param("modelName").notEmpty().withMessage("Subject Name is required"),
        body("type").trim().notEmpty().withMessage("Question type is required"),
        // .isIn(AvailableQuestionTypes)
        // .withMessage("Invalid question type"),
        body("unit").trim().notEmpty().withMessage("Unit is required"),
        body("question").custom((value) => {
            if (typeof value === "string") {
                // Validation for string type
                if (!value.trim()) {
                    throw new Error(
                        "Question must not be empty when it is a string"
                    );
                }
            } else if (typeof value === "object") {
                // Validation for object type
                if (
                    !value.blocks ||
                    !Array.isArray(value.blocks) ||
                    value.blocks.length === 0
                ) {
                    throw new Error(
                        "Question object must have at least one block"
                    );
                }
                value.blocks.forEach((block, index) => {
                    if (!block.type || typeof block.type !== "string") {
                        throw new Error(
                            `Block ${index + 1} is missing a valid 'type'`
                        );
                    }
                    if (!block.data || typeof block.data !== "object") {
                        throw new Error(
                            `Block ${index + 1} is missing valid 'data'`
                        );
                    }
                    if (
                        !(
                            (block.data.text &&
                                block.data.text.trim().length > 0) ||
                            (block.data.items &&
                                Array.isArray(block.data.items) &&
                                block.data.items.some(
                                    (item) =>
                                        item.content &&
                                        item.content.trim().length > 0
                                ))
                        )
                    ) {
                        throw new Error(
                            `Block ${index + 1} must have either 'text' or 'content'`
                        );
                    }
                });
            } else {
                throw new Error(
                    "Question must be either a string or an object"
                );
            }
            return true;
        }),
        body("answer").trim().notEmpty().withMessage("Answer is required"),
        // body("answer")
        //     .isObject()
        //     .withMessage("Answer must be an object")
        //     .custom((value) => {
        //         if (
        //             !value.blocks ||
        //             !Array.isArray(value.blocks) ||
        //             value.blocks.length === 0
        //         ) {
        //             throw new Error("Answer must have at least one block");
        //         }
        //         value.blocks.forEach((block, index) => {
        //             if (!block.type || typeof block.type !== "string") {
        //                 throw new Error(
        //                     `Block ${index + 1} is missing a valid 'type'`
        //                 );
        //             }
        //             if (!block.data || typeof block.data !== "object") {
        //                 throw new Error(
        //                     `Block ${index + 1} is missing valid 'data'`
        //                 );
        //             }
        //             if (
        //                 !(
        //                     (block.data.text &&
        //                         block.data.text.trim().length > 0) ||
        //                     (block.data.items &&
        //                         Array.isArray(block.data.items) &&
        //                         block.data.items.some(
        //                             (item) =>
        //                                 item.content &&
        //                                 item.content.trim().length > 0
        //                         ))
        //                 )
        //             ) {
        //                 throw new Error(
        //                     `Block ${index + 1} must have either 'text' or 'content'`
        //                 );
        //             }
        //         });
        //         return true;
        //     }),
        // body("queDetails")
        //     .trim()
        //     .notEmpty()
        //     .withMessage("Question details are required"),
        body("marks")
            .notEmpty()
            .withMessage("Marks are required")
            .isNumeric()
            .withMessage("Marks must be a numeric value"),
        body("isFormatted")
            // .optional()
            .isBoolean()
            .withMessage("isFormatted must be a boolean"),
        // body("isActive")
        //     .optional()
        //     .isBoolean()
        //     .withMessage("isActive must be a boolean"),
        // body("isVerified")
        //     .optional()
        //     .isBoolean()
        //     .withMessage("isVerified must be a boolean"),
    ];
};

const updateQuestionValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid question ID"),
        body("type").optional(),
        // .isIn(AvailableQuestionTypes)
        // .withMessage("Invalid question type"),
        body("unit").optional().isString().withMessage("Unit must be a string"),
        body("question").custom((value) => {
            if (typeof value === "string") {
                // Validation for string type
                if (!value.trim()) {
                    throw new Error(
                        "Question must not be empty when it is a string"
                    );
                }
            } else if (typeof value === "object") {
                // Validation for object type
                if (
                    !value.blocks ||
                    !Array.isArray(value.blocks) ||
                    value.blocks.length === 0
                ) {
                    throw new Error(
                        "Question object must have at least one block"
                    );
                }
                value.blocks.forEach((block, index) => {
                    if (!block.type || typeof block.type !== "string") {
                        throw new Error(
                            `Block ${index + 1} is missing a valid 'type'`
                        );
                    }
                    if (!block.data || typeof block.data !== "object") {
                        throw new Error(
                            `Block ${index + 1} is missing valid 'data'`
                        );
                    }
                    if (
                        !(
                            (block.data.text &&
                                block.data.text.trim().length > 0) ||
                            (block.data.items &&
                                Array.isArray(block.data.items) &&
                                block.data.items.some(
                                    (item) =>
                                        item.content &&
                                        item.content.trim().length > 0
                                ))
                        )
                    ) {
                        throw new Error(
                            `Block ${index + 1} must have either 'text' or 'content'`
                        );
                    }
                });
            } else {
                throw new Error(
                    "Question must be either a string or an object"
                );
            }
            return true;
        }),
        body("answer")
            .optional()
            .isString()
            .withMessage("Answer must be a string"),
        body("queDetails")
            .optional()
            .isString()
            .withMessage("Question details must be a string"),
        body("marks")
            .optional()
            .isNumeric()
            .withMessage("Marks must be a numeric value"),
        body("isFormatted")
            .optional()
            .isBoolean()
            .withMessage("isFormatted must be a boolean"),
        body("isActive")
            .optional()
            .isBoolean()
            .withMessage("isActive must be a boolean"),
        body("isVerified")
            .optional()
            .isBoolean()
            .withMessage("isVerified must be a boolean"),
    ];
};

const getQuestionByIdValidator = () => {
    return [param("id").isMongoId().withMessage("Invalid question ID")];
};

const deleteQuestionValidator = () => {
    return [param("id").isMongoId().withMessage("Invalid question ID")];
};

export {
    createQuestionValidator,
    updateQuestionValidator,
    getQuestionByIdValidator,
    deleteQuestionValidator,
};
