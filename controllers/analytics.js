module.exports.overview = function(req, res) {
    res.status(200).json({
        login: true
    });
};

module.exports.analytics = function(req, res) {
    res.status(200).json({
        register: true
    });
};