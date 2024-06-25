import { Access } from 'payload/config';
import Users, { RoleType } from '../collections/Users';

export const selfOrAdmin: Access = ({ req: { user } }) => {
  return user?.collection === Users.slug && user?.role === RoleType.Admin
    ? true
    : {
        id: {
          equals: user?.id,
        },
      };
};
