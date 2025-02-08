import { useState, useEffect } from "react";
import '../styles/dashboard.css'

const URL = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
    console.log(URL)
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [stocks, setStocks] = useState([]);
    const [total, setTotal] = useState(0);


    useEffect(() => {

        const fetchProductData = async () => {
            try {
                const response = await fetch(`${URL}/product`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Failed to fetch products: ${response.statusText}`);
                }

                setProducts(data.products);
                setProductCount(parseInt(data.productCount));
                setCategoryCount(parseInt(data.categoryCount));
                setTotal(parseInt(data.totalProductsValue));
                setStocks(Array.isArray(data.lowStock) ? data.lowStock : []);
            } catch (error) {
                console.error(`Error fetching products: ${error.message}`);
            }
        }
        fetchProductData();
    }, []);

    return (
        <div className="dashboard">
            <div className="total-products-div">
                <h2>Total Products</h2>
                <p>{productCount}pcs</p>
            </div>
            <div className="category-div">
                <h2>Category</h2>
                <p> {categoryCount}</p>
            </div>
            <div className="total-products-value-div">
                <h2>Total Products Value</h2>
                <p>PHP {total.toLocaleString()}</p>
            </div>
            <div className="low-stock-div">
                <h2>Low Stock</h2>
                <p>{stocks.length}</p>
                <ul>
                    {stocks.map((stock) => (
                        <li key={stock.id}>
                            {stock.name} - {stock.quantity}pcs
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default Dashboard
