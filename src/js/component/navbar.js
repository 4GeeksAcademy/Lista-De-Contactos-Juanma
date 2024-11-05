import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"; 

export const Navbar = () => {
    const { actions } = useContext(Context); 
    
    return (
        <nav className="navbar navbar-light bg-light mb-3">
            <Link to="/">
                <span className="navbar-brand mb-0 h1">Home</span>
            </Link>
            <div className="ml-auto">
                <Link to="/create">
                    <button 
                        onClick={() => actions.clearContact()} // Llama a clearContact correctamente
                        className="btn btn-success">
                        Create Contact
                    </button>
                </Link>
            </div>
        </nav>
    );
};