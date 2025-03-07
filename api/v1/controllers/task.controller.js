const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or: [
            {createdBy: req.user.id},
            {listUser: req.user.id}
        ],
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

    if (req.query.page) {
        objPagination.currentPage = parseInt(req.query.page);
    };

    if (req.query.limit) {
        objPagination.limit = parseInt(req.query.limit);
    }

    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limit;

    // End pagination

    // Search
    if (req.query.keyword) {
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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;

        const status = req.body.status;

        await Task.updateOne({ _id: id }, { status: status });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    };
};

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });

                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;

            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: Date.now()
                });

                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                });
                break

            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                });
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    };
};

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const task = await Task(req.body);
        const data = await task.save();
        

        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: data
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    };
};

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    };
};

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: Date.now()
        });
        res.json({
            code: 200,
            message: "Xóat thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    };
};