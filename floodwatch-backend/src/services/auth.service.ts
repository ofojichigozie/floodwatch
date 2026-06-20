import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model';
import { env } from '../config/env';
import { LoginInput } from '../validations/auth.validation';

export const loginAdmin = async (input: LoginInput) => {
  const admin = await Admin.findOne({ email: input.email });
  if (!admin) throw { statusCode: 401, message: 'Invalid email or password' };

  const isMatch = await admin.comparePassword(input.password);
  if (!isMatch) throw { statusCode: 401, message: 'Invalid email or password' };

  const token = jwt.sign(
    { id: admin._id, username: admin.username, email: admin.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  return {
    token,
    admin: { id: admin._id, username: admin.username, email: admin.email },
  };
};
