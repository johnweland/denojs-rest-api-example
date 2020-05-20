import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { Product } from '../types.ts';

let products: Product[] = [
    {
        id: "1",
        name: "Product One",
        description: "a clever description of Product One",
        price: 10.99,
    }, 
    {
        id: "2",
        name: "Product Two",
        description: "a less clever description of Product Two",
        price: 8.99,
    },
    {
        id: "3",
        name: "Product Three",
        description: "a now annoying description of Product Three",
        price: 1.99,
    }
];

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = ({ response }: { response: any }) => {
    response.body = {
        success: true,
        data: products
    }
}

// @desc    Get a single product
// @route   GET /api/v1/products/:id
const getProduct = ({ params, response }: { params: {id: string }, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id);
    if (product) {
        response.status = 200;
        response.body = {
            success: true,
            data: product
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            message: `No product found.`
        }
    }
}

// @desc    Add a product
// @route   POST /api/v1/products/
const addProduct = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body();
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            message: `No data.`
        }
    } else {
        const product: Product = body.value;
        product.id = v4.generate();
        products.push(product);
        response.status = 201;
        response.body = {
            success: true,
            data: product
        }
    }
}

// @desc    Update a single product
// @route   PUT /api/v1/products/:id
const updateProduct = async ({ params, request, response }: { params: {id: string }, request: any, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id);

    if (product) {
        const body = await request.body();
        const updateData: {name?: string, description?: string, price?: number} = body.value

        products = products.map(p => p.id === params.id ? { ...p, ...updateData } : p);
        response.status = 202;
        response.body = {
            success: true,
            data: products
        }

    } else {
        response.status = 404;
        response.body = {
            success: false,
            message: `No product found.`
        }
    }
}

// @desc    Delete a single product
// @route   DELETE /api/v1/products/:id
const deleteProduct = async ({ params, response }: { params: {id: string }, response: any }) => {
    products = products.filter(p => p.id !== params.id);
    response.status = 204;
        response.body = {
            success: true,
            message: `Product deleted.`
        }
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }