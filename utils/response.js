function OK(res, status, data , message) {
    res.status(status).json({
        isError: false,
        data,
        message
    });
}

function ERR(res, status, message) {
    res.status(status).json({
        isError: true,
        message
    });
}

module.exports = {
    OK,
    ERR
};