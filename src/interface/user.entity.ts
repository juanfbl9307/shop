import { Order } from './order.entity';

export interface UserEntity {
  id?: number;
  username: string;
  email: string;
  balance?: number;
  order?: Order[];
}

export class Sender implements UserEntity {
  email: string;
  username: string;
}

export class User implements UserEntity {
  email: string;
  username: string;
  balance: number;
}

export class UserTransfer {
  Sender: Sender;
  Receptor: User;
}
