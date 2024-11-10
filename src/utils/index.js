exports.catchAsyncError = (func) => (req, res, next) =>
    Promise.resolve(func(req, res, next)).catch((err) => next(err));

class APIFeature {
    query;
    model;
    condition = {};
    skip = 0;
    limit = 9;
    reqQuery = {};
    constructor(model, reqQuery) {
        this.reqQuery = reqQuery;
        this.model = model;
        this.query = this.model.find();
    }

    where(conditions) {
        this.condition = { ...this.condition, ...conditions };
        return this;
    }

    paginate() {
        this.limit = this.reqQuery?.limit || 9;
        this.skip = ((this.reqQuery?.page || 1) - 1) * this.limit;
        console.log("this.reqQuery?.page", this.reqQuery?.page);
        console.log("this.skip", this.skip);
        console.log("this.limit", this.limit);
        this.query = this.query.skip(this.skip).limit(this.limit);
        return this;
    }

    filter() {
        // Handle range filters
        if (!this.reqQuery?.filter) {
            return this;
        }
        for (const field in this.reqQuery?.filter) {
            if (this.reqQuery?.filter.hasOwnProperty(field)) {
                const filterValue = this.reqQuery?.filter[field];
                if (
                    typeof filterValue === "object" &&
                    (filterValue.min !== undefined ||
                        filterValue.max !== undefined)
                ) {
                    if (filterValue.min !== undefined) {
                        this.condition = {
                            ...this.condition,
                            [field]: { $gte: filterValue.min },
                        };
                    }
                    if (filterValue.max !== undefined) {
                        this.condition = {
                            ...this.condition,
                            [field]: { $lte: filterValue.max },
                        };
                    }
                    if (
                        filterValue.min !== undefined &&
                        filterValue.max !== undefined
                    ) {
                        this.condition = {
                            ...this.condition,
                            [field]: {
                                $lte: filterValue.max,
                                $gte: filterValue.min,
                            },
                        };
                    }
                } else {
                    // This is a string value filter
                    this.condition = {
                        ...this.condition,
                        [field]: filterValue,
                    };
                }

                if (
                    typeof filterValue === "object" &&
                    filterValue.in !== undefined
                ) {
                    this.condition = {
                        ...this.condition,
                        [field]: {
                            $in: [...filterValue?.in],
                        },
                    };
                }
                if (
                    typeof filterValue === "object" &&
                    this.reqQuery?.filter?.or !== undefined
                ) {
                    delete this.condition?.or;
                    const orArry = Object.keys(
                        this.reqQuery?.filter?.or || {},
                    ).map((key) => ({ [key]: this.reqQuery?.filter?.or[key] }));

                    this.condition = {
                        ...this.condition,
                        $or: [...orArry],
                    };
                }
            }
        }

        return this;
    }

    search() {
        if (this.reqQuery?.search) {
            this.condition = {
                ...this.condition,
                $text: { $search: this.reqQuery?.search },
            };
            this.query = this.query.sort({ score: { $meta: "textScore" } }); // Sort by score
        }
        return this;
    }

    projection(fields) {
        this.query = this.query.select(fields);
        return this;
    }

    orderby(sortFields) {
        this.query = this.query.sort(sortFields || { timestamp: "desc" });
        return this;
    }

    populate(path) {
        let buildQuery = {
            path,
            match: {
                ...this.condition,
                // $text: { $search: "B" },
            },
            skip: this.skip,
            limit: this.limit,
        };

        this.query = this.query.populate(buildQuery);

        return this;
    }

    singlePopulate(path) {
        this.query = this.query.populate(path);
        return this;
    }

    groupBy(field) {
        this.query = this.query.group({
            _id: `$${field}`,
            data: { $push: "$$ROOT" },
        });
        return this;
    }

    async count(model) {
        const totalRecord = await model.countDocuments(this.condition);

        return {
            count: totalRecord,
            totalPages: Math.ceil(
                totalRecord / (Number(this.reqQuery?.limit) || 9),
            ),
        };
    }

    async exec() {
        return this.query.where(this.condition).exec();
    }
}

exports.APIFeature = APIFeature;

exports.encode = async (data) => {
    return await jwt.sign({ ...data }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
};

exports.decode = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET);
};
