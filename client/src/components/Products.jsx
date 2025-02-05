import { useState, useEffect } from "react";
import '../styles/products.css';
import emptyProduct from '../assets/images/no-order.png'

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

    useEffect(() => {
        if (query.trim() === '') {
            fetch('http://localhost:3000/product')
                .then((response) => response.json())
                .then((data) => setProducts(data.products))
                .catch((err) => console.error(`Error fetching products:`, err.message));
            return;
        }

        fetch(`http://localhost:3000/product/search?query=${query}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Searched Products:", data);
                setProducts(data);
            })
            .catch((err) => {
                console.error(`Error fetching products:`, err.message);
            });
    }, [query]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setNewProduct({
                ...newProduct,
                [name]: value.charAt(0).toUpperCase() + value.slice(1)
            });
        } else {
            setNewProduct({
                ...newProduct,
                [name]: value
            });
        }
    };

    const handleAddProduct = (e) => {
        e.preventDefault();

        const productData = {
            name: newProduct.name,
            price: newProduct.price,
            quantity: newProduct.quantity,
            category: newProduct.category
        };
        console.log('Adding new product:', newProduct);

        // Send data to the backend
        fetch('http://localhost:3000/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Product added:', data);
                // Close modal after adding the product
                setIsModalOpen(false);
                // Re-fetch the products list
                fetch('http://localhost:3000/product')
                    .then((response) => response.json())
                    .then((data) => setProducts(data.products))
                    .catch((err) => console.error(`Error fetching products:`, err.message));
            })
            .catch((err) => {
                console.error('Error adding product:', err.message);
            });
    };

    const handeDeleteProduct = (id) => {

        const alertMessage = `Are you sure you want to delete this product?`;

        if (window.confirm(alertMessage)) {

            fetch(`http://localhost:3000/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Product deleted:', data);
                    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));

                    // Re-fetch the products list
                    fetch('http://localhost:3000/product')
                        .then((response) => response.json())
                        .then((data) => setProducts(data.products))
                        .catch((err) => console.error(`Error fetching products:`, err.message));
                })
                .catch((err) => {
                    console.error('Error adding product:', err.message);
                });
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
                                    <option value="Medecine">Medecine</option>

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

                            <button className="delete-button" type="submit" onClick={() => handeDeleteProduct(product.id)}>Delete</button>
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
