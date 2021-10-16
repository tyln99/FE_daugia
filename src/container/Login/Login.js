import React, { useState, Component } from "react";
import { Container, Card, Form, Button, Grid } from "semantic-ui-react";
import "./Login.css";
import { auth } from "../../Firebase/FirebaseConfig";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {API_HOST, API_HOST_DEV} from '../../config/endpoints';

function Login() {
  //router
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = (event) => {
    event.preventDefault();
    if (email && password) {
      axios.post(
        `${API_HOST}/api/auth`,
        {
          Username: email,
          Password: password
        }
      )
        .then(function (res) {
          // handle success
          console.log(res);
          localStorage.setItem('accessToken', res?.data?.accessToken);
          localStorage.setItem('refreshToken', res?.data?.refreshToken);
          history.push('/');
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    } else {
      alert("Please Enter all the fields");
    }
  };


  return (
    <div className="login">
      <Container>
        <Grid centered columns={3} doubling stackable>
          <Grid.Column>
            <Card className="card">
              <Card.Header className="card_header">ĐĂNG NHẬP</Card.Header>
              <Form className="login__form">
                <Form.Field required>
                  <label>Tên người dùng</label>
                  <input
                    placeholder="Tên người dùng"
                    type="text"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Mật khẩu</label>
                  <input
                    placeholder="Mật khẩu"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Field>
                <div className="center">
                  <Button className="button-3" color="green" type="submit" onClick={loginUser}>
                    Đăng nhập
                  </Button>
                </div>
              </Form>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default Login;
