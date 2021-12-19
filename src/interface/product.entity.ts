export type ProductEntity = {
  id?: number;
  name: string;
  price: number;
};

export class Product implements ProductEntity {
  name: string;
  price: number;
}
