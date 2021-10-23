import React, { useEffect, useState } from "react";
import { Menu, Icon } from "semantic-ui-react";

import "./Header.css";
import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider/StateProvider";

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();

  const login = () => {
    if (user) {
      dispatch({ type: "SET_USER", user: null });
      localStorage.clear();
    }
  };

  return (
    <div className="header">
      <Menu stackable>
        <Menu.Menu position="left">
          <Menu.Item>
            <Link to="/" className="header__leftItem">
              <img
                className="header__logo"
                src="https://img.icons8.com/plasticine/100/000000/auction.png"
                alt="secondhand store logo"
              />
              <p className="header__companyName">Đấu Giá Online</p>
            </Link>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {user ? (
            <div>
              <Link to="/profile">
                <Menu.Item>
                  <Icon name="user" />
                  {`
                ${user.email ? user.email : "your email here"} 
              `}
                </Menu.Item>
              </Link>
            </div>
          ) : (
            <></>
          )}
          {(user?.scope == 15) ? (
            <div>
              <Link to="/uploadImage">
                <Menu.Item>
                  <Icon name="upload" /> Add product
                </Menu.Item>
              </Link>
            </div>
          ) : (
            <></>
          )}
          {(user?.scope == 25) ? (
            <div>
              <Link to="/uploadImage">
                <Menu.Item>
                  <Icon name="upload" /> Admin
                </Menu.Item>
              </Link>
            </div>
          ) : (
            <></>
          )}
          {user ? (
            <div>
              <Link to="/checkout">
                <Menu.Item>
                  <Icon name="shop" /> {basket?.length}
                </Menu.Item>
              </Link>
            </div>
          ) : (
            <Link to="/register">
                <Menu.Item>
                  <Icon name="user plus" /> Đăng ký
                </Menu.Item>
              </Link>
          )}
          <Link to="/login">
            <Menu.Item>
              {user ? (
                <div onClick={login}>
                  <Icon name="sign-out" />
                  Đăng xuất
                </div>
              ) : (
                <>
                  <Icon name="sign-in" />
                  Đăng nhập
                </>
              )}
            </Menu.Item>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default Header;
