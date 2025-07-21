//In postman the token should be passed in headers with a key named authorization

//value should be in format of :

//Bearer token       (word bearer is compulsory, followed by token without any quotation marks)



const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided or incorrect format' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            // Attach user data to request object
            req.userData = decoded;
            next();
        });

    } catch (error) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};
