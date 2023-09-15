import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function NavBar() {
  return (
    <nav className="navbar border border-dark shadow-sm mb-2 bg-white rounded">
      <div className="d-flex justify-content-between align-items-center w-100 my-2">
        <div className="border-1 w-25">
          <h1 className="logo">Logo</h1>
        </div>

        <div className="d-flex justify-content-center mx-auto">
          <div className=" d-flex">
            <div className="nav-item me-4">
              <button id="refreshButton"> refresh</button>
            </div>
            <div className="nav-item me-4">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </div>
            <div className="nav-item me-4">
              <Link to="/company" className="nav-link">
                Add
              </Link>
            </div>
            <div className="nav-item me-4">
              <Link to="/companyUP" className="nav-link">
                Delete
              </Link>
            </div>
          </div>
        </div>

        <div className="dropdown bg-dark px-2 py-2 mx-1">
          <a
            className="dropdown-toggle hidden-arrow"
            href="#"
            role="button"
            id="dropdownMenuIcon"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuIcon"
          >
            <li>
              <a className="dropdown-item" href="#">
                <i className="fas fa-user-alt pe-2"></i>My Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="fas fa-cog pe-2"></i>Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="fas fa-door-open pe-2"></i>Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
