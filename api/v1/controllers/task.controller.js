const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    };

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    };
    // End Sort

    // pagination
    const objPagination = {
        currentPage: 1,
        limit: 2
    };

    if(req.query.page) {
        objPagination.currentPage = parseInt(req.query.page);
    };

    if(req.query.limit) {
        objPagination.limit = parseInt(req.query.limit);
    }

    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limit;

    // End pagination

    // Search
    if(req.query.keyword) {
        find.title = new RegExp(req.query.keyword, "i");
    };
    // End search

    const tasks = await Task.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip);

    res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(task);

    } catch (error) {
        res.json("Không tìm thấy!");
    }
};