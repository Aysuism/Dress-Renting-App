import { NavLink, Outlet } from "react-router";

const AdminPanel = () => {

  return (
    <div className="sm:p-6">
      <div className="flex space-x-4 bg-gray-100 p-4 my-5 rounded shadow-sm">
        <NavLink
          to="product-management"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Product
        </NavLink>

        <NavLink
          to="category-management"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Category
        </NavLink>

        <NavLink
          to="subcategory-management"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition-colors break-words ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          SubCategory
        </NavLink>

        <NavLink
          to="brand-management"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Brands
        </NavLink>
      </div>

      <Outlet />
    </div >
  );
};

export default AdminPanel;