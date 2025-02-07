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
        fetch(`${URL}/product`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setProducts(data.products)
                setProductCount(parseInt(data.productCount))
                setCategoryCount(parseInt(data.categoryCount))
                setTotal(parseInt(data.totalProductsValue))
                setStocks(Array.isArray(data.lowStock) ? data.lowStock : []);
            })
            .catch((err) => console.log(`Error fetching products: `, err.message));

    }, [])
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
