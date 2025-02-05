import '../styles/content.css';
import Proptypes from 'prop-types';
import Dashboard from '../components/Dashboard';
import Products from '../components/Products';
import Categories from '../components/Categories';
const Content = ({ selectedView }) => {
    return (
        <div className="content">
            {selectedView === 'dashboard' && <Dashboard />}
            {selectedView === 'categories' && <Categories />}
            {selectedView === 'products' && <Products />}

        </div>
    )
}

export default Content;

Content.propTypes = {
    selectedView: Proptypes.string.isRequired
}