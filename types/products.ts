export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: string;
    imageUrl: string;
}

export interface ProductResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}
