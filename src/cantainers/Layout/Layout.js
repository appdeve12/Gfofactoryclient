// Layout.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import '../../assets/css/layout.css';
import { FaHome, FaArrowDown, FaArrowUp, FaFileAlt } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { ImProfile } from "react-icons/im";
import { FaUserFriends } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
const Header = ({ toggleSidebar, userData }) => {
  console.log("userData", userData?.user?.role)
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null)
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // You can dispatch logout action here
    console.log("Logout clicked");
    localStorage.removeItem('token');
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000)

  };

  const handleProfile = () => {
    navigate("/dashboard/profile");
  };
  const handleMultipleUser = () => {
    navigate("/dashboard/alladmin");
  }
  const handlePermissionManage = () => {
    navigate("/dashboard/permission");
  }

  const handleClickOutside = (event) => {
    // Agar click dropdown ke bahar hai to dropdown close karo
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up jab component unmount ho
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])
  return (
    <Navbar bg="dark" variant="dark" className="header justify-content-between px-3 position-relative">
      <div className="d-flex align-items-center">
        <Button variant="outline-light" onClick={toggleSidebar} className="me-3">
          ☰
        </Button>
        <Navbar.Brand>{userData?.user?.role}</Navbar.Brand>
      </div>

      <div className="d-flex align-items-center gap-2 text-light position-relative">
        <span>{userData?.user?.name}</span>
        <div className="position-relative" ref={dropdownRef}>
          <FaRegUserCircle
            size={24}
            style={{ cursor: "pointer" }}
            onClick={handleToggleDropdown}
          />

          {showDropdown && (
            <div className="dropdown-menu show p-2" style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              zIndex: 999,
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {userData?.user?.role == "supervisior" && <button className="dropdown-item" onClick={handleMultipleUser}><FaUserFriends /> Add Multiple User</button>}
              <button className="dropdown-item" onClick={handleProfile}><ImProfile /> View Profile</button>
              {/* <button className="dropdown-item" onClick={handlePermissionManage}><FaUserCheck /> Manage Permission</button> */}
              <button className="dropdown-item" onClick={handleLogout}><RiLogoutCircleLine /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  )
};




const Sidebar = ({ collapsed ,userData}) => (
  <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
    <Nav className="flex-column">
      <Nav.Link as={Link} to="/dashboard">
        <FaHome className="sidebar-icon" />
        {!collapsed && <span className="sidebar-label">Home</span>}
      </Nav.Link>
      <Nav.Link as={Link} to="materialdata">
        <FaArrowDown className="sidebar-icon" />
        {!collapsed && <span className="sidebar-label">Material Name</span>}
      </Nav.Link>
      <Nav.Link as={Link} to="stock-inward">
        <FaArrowDown className="sidebar-icon" />
        {!collapsed && <span className="sidebar-label">Stock In</span>}
      </Nav.Link>
      <Nav.Link as={Link} to="stock-outward">
        <FaArrowUp className="sidebar-icon" />
        {!collapsed && <span className="sidebar-label">Stock Out</span>}
      </Nav.Link>
     
  <Nav.Link as={Link} to="material-cost">
    <FaArrowUp className="sidebar-icon" />
    {!collapsed && <span className="sidebar-label">Material Cost</span>}
  </Nav.Link>
     
  <Nav.Link as={Link} to="all-order">
    <FaArrowUp className="sidebar-icon" />
    {!collapsed && <span className="sidebar-label">Orders</span>}
  </Nav.Link>


    </Nav>
  </div>
);

const Layout = () => {
  const userDt = useSelector(state => state.auth.userdata)
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} userData={userDt} />
      <div className="main">
        <Sidebar collapsed={collapsed} userData={userDt} />
        <div className="overflows" style={{ display: "contents" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default Layout;
