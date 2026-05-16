import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export default function authorizeUser(req, res, next) {
	const header = req.header("Authorization");

	if (header != null) {
		const token = header.replace("Bearer ", "");

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err || decoded == null) {
				res.status(401).json({
					message: "Invalid token please login again",
				});
				return;
			} else {
				req.user = decoded;
				next();
			}
		});
	} else {
		next();
	}
}