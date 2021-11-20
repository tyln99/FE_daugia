import React, { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import {
  Container,
  Grid,
  Segment,
  Dimmer,
  Loader,
  Menu,
  Input,
  Pagination,
  Dropdown,
  Header,
  Link,
} from "semantic-ui-react";
import "./Home.css";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import Alert from "../../Common/Alert";
import webSocket from "../../Common/WebSocket";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

function Home() {
  const [allProduct, setAllProduct] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [activeItem, setActiveItem] = useState("all");
  const [category, setCategory] = useState([]);

  const [postsPerPage] = useState(6);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [comingEndAuctionProduct, setComingEndAuctionProduct] = useState([]);
  const [highestPriceProduct, setHighestPriceProduct] = useState([]);
  const [displayComingAuctionProducts, setDisplayComingAuctionProducts] = useState([]);
  const [displayHighestPriceProduct, setDisplayHighestPriceProduct] = useState([]);

  useEffect(() => {
    moment.locale("vi");
    // get category
    axios.get(`${API_HOST}/api/category`).then(function (res) {
      setCategory(res?.data?.data);
    });

    // get product
    axios
      .get(`${API_HOST}/api/product`)
      .then(function (res) {
        setLoading(false);
        const data = res.data;

        // save all data
        setAllProduct(data);
        setPageCount(Math.ceil(data.length / postsPerPage));
      })
      .catch(function (error) {
        setAlertStatus(true);
        setAlertType("error");
      });

    // get danh sách sản phẩm sắp kết thúc đấu giá
    axios
      .post(`http://localhost:4000/api/product/auction-coming-end`)
      .then(function (res) {
        const data1 = res.data;
        // console.log(data.data)
        setComingEndAuctionProduct(data1.data)
      })
      .catch();
  }, []);

  const onMenuClick = async (menuValue) => {
    setActiveItem(menuValue);
    if (menuValue == 0) {
      setDisplayProducts(getProductData(allProduct));
    } else {
      var filteredProduct = allProduct.filter(
        (item) => item.IdCategory == menuValue
      );
      setDisplayProducts(getProductData(filteredProduct));
    }
  };

  webSocket.onopen = function () {
    //webSocket.send(JSON.stringify({message: 'What is the meaning of life, the universe and everything?'}));
    console.log("connected to server");
  };
  webSocket.onmessage = function (message) {
    if (JSON.parse(message.data)[0] === "newProduct") {
      let data = JSON.parse(message.data)[1];
      setProduct([...product, data]);
    }
  };

  const sortOptions = [
    {
      key: 1,
      text: "Giá từ cao đến thấp",
      value: 1,
      label: { color: "red", empty: true, circular: true },
    },
    {
      key: 2,
      text: "Giá từ thấp đến cao",
      value: 2,
      label: { color: "blue", empty: true, circular: true },
    },
    {
      key: 3,
      text: "Xem nhiều nhất",
      value: 3,
      label: { color: "green", empty: true, circular: true },
    },
  ];

  const onSort = (value) => {
    console.log(value);
  };

  const getProductData = (productData) => {
    return productData.map((product, index) => (
      <Grid.Column stretched key={index}>
        <Product
          id={product?.id}
          key={product?.id}
          title={product?.Name}
          nowPrice={product?.NowPrice}
          buyNowPrice={product?.buyNowPrice}
          dateCreated={product?.DateCreated}
          dateEnded={product?.DateEnd}
          biddeds={product?.UserBuyer?.length}
          highestBid={
            product.UserBuyer?.length > 0
              ? `*****${product.UserBuyer[0].Lastname}`
              : "Chưa có"
          }
          //rating={product.rating}
          images={product.images}
        ></Product>
      </Grid.Column>
    ));
  };

  const getAllPosts = () => {
    var slice = allProduct.slice(
      offset * postsPerPage,
      offset * postsPerPage + postsPerPage
    );
    // console.log(slice);
    // console.log(allProduct);
    setDisplayProducts(getProductData(slice));
  };

  const onPageChange = (event, data) => {
    setOffset(data.activePage - 1);
  };

  const getHighestPrice = () => {
    var result = allProduct.sort((item1, item2) => item2.NowPrice - item1.NowPrice)
    setHighestPriceProduct(result)
  }

  useEffect(() => {
    getAllPosts();
    getHighestPrice();
  }, [allProduct, offset]);

  // display danh sach san pham sap het han dau gia
  useEffect(() => {
    if (comingEndAuctionProduct) {
      setDisplayComingAuctionProducts(getProductData(comingEndAuctionProduct.slice(0, 5)))
    }
  }, [comingEndAuctionProduct])

  // display danh sach san pham co gia cao nhat
  useEffect(() => {
    if (highestPriceProduct) {
      setDisplayHighestPriceProduct(getProductData(highestPriceProduct.slice(0, 5)))
    }
  }, [highestPriceProduct])

  return (
    <div className="home">
      <Alert
        status={alertStatus} // true or false
        type={alertType} // success, warning, error, info
        title={alertTitle} // title you want to display
        setIsAlert={setAlertStatus}
      />
      {loading ? (
        <Segment className="home__segment">
          <Dimmer active inverted>
            <Loader size="large" className="home__loaderMessage">
              Đang tải...
            </Loader>
          </Dimmer>
        </Segment>
      ) : (
        <>
        <Container className="home-container">
          <Menu secondary>
            <Grid container columns={3} doubling stackable>
              <Menu.Item
                key={0}
                name="Tất cả"
                active={true}
                active={activeItem === 0}
                onClick={() => onMenuClick(0)}
              />
              {category.map((item, index) => {
                return (
                  <Menu.Item
                    key={index}
                    name={item.Name}
                    active={activeItem === item.id}
                    onClick={() => onMenuClick(item.id)}
                  />
                );
              })}
              <Menu.Item key={1000}>
                <Input icon="search" placeholder="Tìm kiếm..." />
              </Menu.Item>
              <Menu.Item>
                <Dropdown
                  onChange={(e, data) => onSort(data)}
                  placeholder="Sắp xếp"
                  clearable
                  options={sortOptions}
                  selection
                />
              </Menu.Item>
            </Grid>
          </Menu>
          <Header className="section-header">
            <div>Tất cả</div>
            <a href="/product/all">Xem thêm</a>
          </Header>
          <Grid container columns={3} doubling stackable>
            {displayProducts}
          </Grid>
        </Container>

        <hr className="break-line"/>

        <Container className="home-container coming-end-auction-section">
          <Header className="section-header">
            <div>Sản phẩm có giá cao nhất</div>
            <a href="/product/all?sortByPrice=1">Xem thêm</a>
          </Header>
          <Grid container columns={3} doubling stackable>
            {displayHighestPriceProduct}
          </Grid>
        </Container>

        <hr className="break-line"/>

        <Container className="home-container coming-end-auction-section">
          <Header className="section-header">
            <div>Sản phẩm sắp kết thúc đấu giá trong 5 ngày nữa</div>
            <a href="/product/coming-auction-end">Xem thêm</a>
          </Header>
          <Grid container columns={3} doubling stackable>
            {displayComingAuctionProducts}
          </Grid>
        </Container>
        </>
      )}   
    </div>
  );
}

export default Home;
