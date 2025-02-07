import { useState, useEffect } from "react";
import '../styles/categories.css'

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('https://inventory-management-server-hv7u.onrender.com/category')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCategories(data.rows)
            })
            .catch((err) => console.log(`Error fetching categories: `, err.message));

    }, [])
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
