module.exports.getAll = function(req, res) {
    res.status(200).json({
        login: true
    });
};

module.exports.create = function(req, res) {
    res.status(200).json({
        register: true
    });
};