export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
}
