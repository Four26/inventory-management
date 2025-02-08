import { useState, useEffect } from "react";
import '../styles/categories.css';

const URL = import.meta.env.VITE_SERVER_URL;

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${URL}/category`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Failed to fetch categories: ${response.statusText}`);
                }

                const data = await response.json();
                setCategories(data.rows);
            } catch (error) {
                console.error(`Error fetching categories: ${error.message}`);
            }
        }
        fetchCategory();
    }, []);

    return (
        <div className="categories">
            {categories.map((category) => (
                <div className={`categories-div ${category.category_name}`} key={category.category_id}>
                    <h3>{category.category_name}</h3>
                    <p>Items Total: {category.total_quantity}</p>
                    <p>Items total value: PHP{category.total_value}</p>
                </div>
            ))}
        </div>
    )
}

export default Categories
