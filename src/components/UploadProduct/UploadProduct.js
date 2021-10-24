import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import 'antd/dist/antd.css';
import './UploadProduct.css';
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import { useStateValue } from "../../StateProvider/StateProvider";
const { Option } = Select;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} không được bỏ trống!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} phải lớn hơn ${min} và nhỏ hơn ${max}',
    },
};



const UploadProduct = () => {
    const [{ user }, dispatch] = useStateValue();
    const [category, setCategory] = useState([]);

    useEffect(() => {            
        axios
            .get(`${API_HOST}/api/category`)
            .then(function (res) {
                setCategory(res?.data?.data);
            })
            .catch(function (error) {
            });

    }, [])

    const onFinish = (values) => {
        values.product.IdUserSeller = user?.userId;
        console.log(user);
        console.log(values);
        axios
            .post(`${API_HOST}/api/product/add`, values.product)
            .then(function (res) {
                console.log(res)
            })
            .catch(function (error) {
            });
    };

    return (
        <div className="add-product-container">
            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <h2 className="header">Thêm sản phẩm mới</h2>
                <Form.Item
                    name={['product', 'Name']}
                    label="Tên sản phẩm"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name={['product', 'IdCategory']} label="Loại" rules={[{ required: true }]}>
                    <Select
                        placeholder="Chọn loại sản phẩm"
                        allowClear
                    >
                        {
                            category.map((item, index) => (
                                <Option key={index} value={item.id}>{item.Name}</Option>        
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name={['product', 'StartingPrice']}
                    label="Giá khởi điểm"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 1000000000,
                        },
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber style={{ width: 150 }} />
                </Form.Item>
                <Form.Item
                    name={['product', 'StepPrice']}
                    label="Bước giá"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 1000000000,
                        },
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber style={{ width: 150 }} />
                </Form.Item>
                <Form.Item
                    name={['product', 'NowPrice']}
                    label="Giá hiện tại"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 1000000000,
                        },
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber style={{ width: 150 }} />
                </Form.Item>
                <Form.Item name={['product', 'IsCheckReturn']} label="Loại" rules={[{ required: true }]}>
                    <Select
                        placeholder="Tự động gia hạn"
                        allowClear
                    >
                        <Option value={0}>Có</Option>        
                        <Option value={1}>Không</Option>        
                    </Select>
                </Form.Item>
                <Form.Item
                    name={['product', 'Description']}
                    label="Mô tả"
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>

    );
};

export default UploadProduct;