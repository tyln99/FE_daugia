import React, { useState, useEffect } from "react";
import {
  Grid,
  Menu,
  Segment,
  Item,
  Divider,
  Icon,
  Container,
  Button,
  Message,
} from "semantic-ui-react";
import "./AccountActivation.css";
import { useParams } from "react-router-dom";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import { useHistory, Redirect } from "react-router-dom";

function AccountActivation() {
  const history = useHistory();
  const { code } = useParams();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    console.log(code);
    axios
      .post(`${API_HOST}/api/otp/confirm`, {
        OTP: code,
      })
      .then(function (res) {
        setIsValid(true);
      })
      .catch(function (error) {
        setIsValid(false);
      });
  }, []);

  return (
    <div className="home">
      <Container>
        <Segment>
          {isValid ? (
            <div>
              <Message
                success
                header="Xác thực tài khoản thành công"
                content="Bây giờ bạn có thể đăng nhập bằng email bạn đã đăng ký "
              />
              <Button className="button-3" color="green" onClick={(e)=>{history.push('/login')}}>
                Đăng nhập ngay
              </Button>
            </div>
          ) : (
            <div>
              <Message
                negative
                header="Xác thực tài khoản thất bại"
                list={["Mã OTP không hợp lệ hoặc không tồn tại"]}
              />
              <Button color="blue" onClick={(e)=>{history.push('/')}}>
                Trang chủ
              </Button>
            </div>
          )}
        </Segment>
      </Container>
    </div>
  );
}

export default AccountActivation;