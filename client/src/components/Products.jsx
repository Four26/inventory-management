import { useState, useEffect, useCallback } from "react";
import '../styles/products.css';
import emptyProduct from '../assets/images/no-order.png';

const URL = import.meta.env.VITE_SERVER_URL;


const Products = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        category: ''
    });

    const fetchProductData = useCallback(
        async () => {
            try {
                const checkQuery = query.trim() === '' ? `${URL}/product` : `${URL}/product/search?query=${encodeURIComponent(query)}`;
                const response = await fetch(checkQuery);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Failed to fetch products: ${response.statusText}`);
                }

                setProducts(query.trim() === '' ? data.products : data);
            } catch (error) {
                console.error(`Error fetching products: ${error.message}`);
            }
        }, [query]);

    useEffect(() => { fetchProductData() }, [fetchProductData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewProduct({
            ...newProduct,
            [name]: name === 'name' ? value.charAt(0).toUpperCase() + value.slice(1) : value
        });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}/product`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to add product: ${response.statusText}`);
            }

            console.log(`Product added: ${data.message}`);
            setIsModalOpen(false);
            await fetchProductData();
        } catch (error) {
            console.error(`Error adding product: ${error.message}`);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const alertMessage = `Are you sure you want to delete this product?`;

            if (window.confirm(alertMessage)) {

                const productToDelete = products.find((product) => product.id === id);

                const response = await fetch(`${URL}/product/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || `Failed to delete product: ${response.statusText}`);
                }

                console.log(`Product deleted: ${productToDelete.name}`);
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
                await fetchProductData();
            }
        } catch (error) {
            console.error(`Error deleting product: ${error.message}`);
        }
    }

    const handleCloseModal = () => {
        // Reset the form inputs by clearing the newProduct state
        setNewProduct({
            name: '',
            price: '',
            quantity: '',
            category: ''
        });
        setIsModalOpen(false);
    };


    return (
        <div className="products">
            <div className="add-product-div">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search a product"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Product
                </button>
            </div>

            {/* Modal for adding product */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Product</h2>
                        <form onSubmit={handleAddProduct}>
                            <div>
                                <label htmlFor="name">Product Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category">Category:</label>
                                <select name="category" id="category" value={newProduct.category} onChange={handleInputChange} required>
                                    <option value="">Select a category</option>
                                    <option value="Appliances">Appliances</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Food">Food</option>
                                    <option value="Medicine">Medicine</option>

                                </select>
                            </div>
                            <div>
                                <label htmlFor="price">Price:</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={newProduct.quantity}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Add Product</button>
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="products-list-div">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className={`product-con ${product.category}`} key={product.id}>
                            <h2>{product.name}</h2>
                            <p>Category: {product.category}</p>
                            <p>Price: PHP {product.price}</p>
                            <p>Quantity: {product.quantity}</p>

                            <button className="delete-button" type="submit" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <div className="empty-products">
                        <img src={emptyProduct} alt="No products" />
                        <h3>No Products Found</h3>
                        <p>Try adjusting your search or add a new product</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
