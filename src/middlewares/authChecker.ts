import jwt from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import 'dotenv/config';
import Error from './errorHandler';
// import { Roles } from "../models/roles.entity";
// import * as _ from "lodash";
import { userModel } from '../model/user.mongo';
// import crypto from "../utils/crypto/index";
const contextService = require('request-context');

export type AuthParams = {
	roles?: string[];
	options?: {
		strict: boolean;
	};
};

const authChecker: AuthChecker<any, AuthParams> = async (
	{ context },
	[data = { roles: [], options: { strict: false } }] = [],
) => {
	try {
		const { options = { strict: false }, roles = [] } = data;
		const { strict } = options!;
		// Get headers from context
		let headers = context.req.headers;
		// Check that the headers contain the Authorization header
		if (!headers.authorization) {
			throw new Error('Missing Authorization Header', 401);
		}

		// Get the token from the authorization header
		const token = headers.authorization.split(' ')[1];
		// Validate the token
		const payload: any = jwt.verify(token, process.env.JWT_API_SECRET!);
		// const value: string = crypto.decrypt(payload.info);
		contextService.set('req:user', payload);

		let currentUser = await userModel.findOne({ id: payload.user });
		if (roles!.length) {
			const u_roles = currentUser?.role;

			if (strict) {
				// Check if the required permission exits in the user permissions
				if (!roles!.every((u: string) => u === String(u_roles).toString())) {
					throw new Error('Insufficient permissions for this request', 403);
				}
			} else {
				// Check if the required permission exits in the user permissions
				if (!roles!.some((u: string) => u === u_roles?.toString())) {
					throw new Error('Insufficient permissions for this request', 403);
				}
			}
		}
		context.payload = { id: payload.user, role: payload.role };

		return true;
	} catch ({ message, code }) {
		if (message === 'jwt expired') {
			code = 401;
		}
		throw new Error(message, code);
	}
};

export default authChecker;
