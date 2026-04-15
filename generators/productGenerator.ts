import { CreateProductRequest } from "../types/products"
import { faker } from '@faker-js/faker';

export const generateProduct = (): CreateProductRequest => {

    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stockQuantity: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        imageUrl: faker.image.url()
    }

}