module.exports = (error, req, res, next) => {
    console.log('Error ==================: ',error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({status: status, message: message, data: data});
}