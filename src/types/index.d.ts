import Prisma from '@prisma/client';

export interface CustomRequest extends Express.Request {
  user?: Prisma.User;
}
