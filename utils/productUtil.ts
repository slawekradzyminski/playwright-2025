import { APIRequestContext, expect } from '@playwright/test';
import { getAllProducts } from '../http/getAllProductsClient';
import { ProductCreateDto, ProductDto } from '../types/product';
import { createProduct } from '../http/productsClient';

export async function getAllProductsFromAPI(request: APIRequestContext, token: string): Promise<ProductDto[]> {
  const response = await getAllProducts(request, token);
  expect(response.ok()).toBe(true);
  return await response.json();
}

export async function getProductsByCategory(request: APIRequestContext, token: string, category: string): Promise<ProductDto[]> {
  const products = await getAllProductsFromAPI(request, token);
  return products.filter((product: ProductDto) => product.category === category);
}

export async function searchProducts(request: APIRequestContext, token: string, searchTerm: string): Promise<ProductDto[]> {
  const products = await getAllProductsFromAPI(request, token);
  return products.filter((product: ProductDto) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export async function createProductViaAPI(request: APIRequestContext, productData: ProductCreateDto, token: string): Promise<ProductDto> {
  const response = await createProduct(request, productData, token);
  expect(response.ok()).toBe(true);
  return await response.json();
}