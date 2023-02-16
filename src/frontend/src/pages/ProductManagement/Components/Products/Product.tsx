import debounce from 'lodash/debounce';
import { Component, ReactNode } from "react";
import { Button, Input, Layout, Space, Table, Typography } from 'antd';
import { ProductResponse } from "../../../../config/types";
import { ColumnGroupType, ColumnsType, ColumnType, DataIndex } from "rc-table/lib/interface";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { formatCurrency } from '../../../../config/utils';
import { Link } from 'react-router-dom';

const { Title } = Typography;

interface ProductProps {
  products: ProductResponse[];
  getProducts: Function;
}

interface ProductState {
  isLoading: boolean;
}

export default class Product extends Component<ProductProps, ProductState> {

  constructor(props: ProductProps) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount(): void {
    const { getProducts } = this.props;

    getProducts({
      onComplete: () => this.setState({ isLoading: false })
    });    
  }

  getColumnSearchProps = (dataIndex: DataIndex) => ({
    width: '200px',
    filterDropdown: () => (
      <Input 
        prefix={<SearchOutlined />} 
        placeholder={`Filter by ${dataIndex}`} 
        onChange={debounce((event) => {alert(event.target.value)}, 5000)} 
      />
    ),
    onFilter: (value: any, record: any) => {
      console.log({ value, record })
      return false
    },
  });


  getColumns = () => {
    return [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
      },
      {
        key: 'brand',
        title: 'Brand Name',
        dataIndex: 'brand',
        fixed: 'left',
        width: 200,
      },
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        width: 200,
      },
      {
        key: 'type',
        title: 'Type',
        dataIndex: 'type',
      },
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
      },
      {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
      },
      {
        key: 'netPrice',
        title: 'Total Price',
        dataIndex: 'netPrice',
        
      },
      {
        key: 'quality',
        title: 'Quality',
        dataIndex: 'quality',
        
      },
      {
        key: 'width',
        title: 'Width',
        dataIndex: 'width',
      },
      {
        key: 'height',
        title: 'Height',
        dataIndex: 'height',
      },
      {
        key: 'unitMeasurements',
        title: 'Unit Measurements',
        dataIndex: 'unitMeasurements',
        
      },
      {
        key: 'netMeasurements',
        title: 'Total Measurements',
        dataIndex: 'netMeasurements',
        
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        dataIndex: 'operation',
        width: 100,
        render: (text: string, row: any) => (
          <a href='#' onClick={(event) => {
            event.preventDefault();
            console.log({ navigateTo: row.key });
            
          }}><EditOutlined /> Edit</a>
        )
      },
    ];
  }

  render(): ReactNode {
    const columns = this.getColumns();
    const { isLoading } = this.state;
    const { products } = this.props;
    

    return (
      <Layout style={{ minWidth: '100%', overflowX: 'auto' }}>
        <Title level={2}>View Products</Title>
        <Table 
          loading={isLoading} 
          columns={columns as (ColumnGroupType<any> | ColumnType<any>)[]} 
          pagination={false}
          dataSource={products.map(
            ({ id, brand, name, price, quantity, quality, height, width, type }, index) => ({
              key: id,
              id: (index + 1),
              brand,
              name,
              price,
              quantity,
              quality,
              height,
              width,
              type,
              netPrice: `${formatCurrency(price * quantity)} PKR`,
              unitMeasurements: height && width ? `${((height * width) / 1600)} meters` : null,
              netMeasurements: height && width ? `${((height * width * quantity) / 1600)} meters` : null
            })
          )} />
      </Layout>
    );
  }

}