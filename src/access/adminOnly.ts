import { Access } from 'payload/config';
import Users, { RoleType } from '../collections/Users';

export const adminOnly: Access = ({ req: { user } }) => {
  return user?.collection === Users.slug && user?.role === RoleType.Admin;
};
