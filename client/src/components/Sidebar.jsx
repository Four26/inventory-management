import '../styles/sidebar.css';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import dashboardImg from '../assets/images/dashboard.png';
import categoryImg from '../assets/images/menu.png';
import productImg from '../assets/images/delivery-box.png';

const Sidebar = ({ setSelectedView }) => {
    // const [isSidebarVisible, setSidebarVisible] = useState(false);

    // const toogleSidebar = () => {
    //     setSidebarVisible(!isSidebarVisible);

    // }

    const navigate = useNavigate();

    const handleViewChange = (view) => {
        setSelectedView(view);
        navigate(`/${view}`);
    };

    return (
        <>
            {/* <button onClick={toogleSidebar} className='show-sidebar'>&#9776;</button> */}
            <div className="sidebar">
                <ul>
                    <li onClick={() => handleViewChange('dashboard')}>
                        <span><img className='dashboardImg' src={dashboardImg} alt={dashboardImg} /></span>
                        <span>Dashboard</span>
                    </li>
                    <li onClick={() => handleViewChange('categories')}>
                        <span><img className='categoryImg' src={categoryImg} alt={categoryImg} /></span>
                        <span>Categories</span>
                    </li>
                    <li onClick={() => handleViewChange('products')}>
                        <span><img className='productImg' src={productImg} alt={productImg} /></span>
                        <span>Products</span>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Sidebar;

Sidebar.propTypes = {
    setSelectedView: PropTypes.func,
};
