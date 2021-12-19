import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {User} from "./interface/user.entity";

@Injectable()
export class ShopRepository {
  constructor(@Inject() private readonly prismaClient: typeof PrismaClient) {}
  async create(params):Promise<User>  {
    const user = {
      username: params.username,
      email: params.email,
      balance: params.balance,
    };
    const create = await this.prismaClient.user.create({ data: user });
    return {     username: params.username,
      email: params.email,
      balance: params.balance,};
  }
}
