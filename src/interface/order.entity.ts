import { UserEntity } from './user.entity';
import { Product } from './product.entity';

export type Order = {
  id: number;
  username: string;
  user: UserEntity;
  product: Product;
  product_id: number;
};

export class Purchase {
  username: { username: string; email: string };
  product: Product[];
  price: number;
}
