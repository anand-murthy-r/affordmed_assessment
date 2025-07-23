const logger = (req, res, next) => {
    console.log(`
[REQUEST BODY]:
url: ${req.body.url},
validity: ${req.body.validity || 'not provided'},
shortcode: ${req.body.shortcode || 'not provided'}
    `);
    next();
};


module.exports = { logger };