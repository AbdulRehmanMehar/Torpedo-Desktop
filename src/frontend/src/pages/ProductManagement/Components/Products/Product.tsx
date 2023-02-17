import debounce from 'lodash/debounce';
import { Component, ReactNode } from "react";
import { Button, Input, Layout, Space, Table, Typography } from 'antd';
import { ProductResponse } from "../../../../config/types";
import { ColumnGroupType, ColumnsType, ColumnType, DataIndex } from "rc-table/lib/interface";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { formatCurrency } from '../../../../config/utils';
import { Link } from 'react-router-dom';
import { NavigationProps } from '../../../../hoc/Navigation';

const { Title } = Typography;

interface ProductProps {
  products: ProductResponse[];
  totalProducts: number;
  getProducts: Function;
  navigationProps: NavigationProps;
}

interface ProductState {
  isLoading: boolean;
}

export default class Product extends Component<ProductProps, ProductState> {

  constructor(props: ProductProps) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount(): void {
    this.getProducts();
  }

  getProducts = () => {
    const { getProducts, navigationProps } = this.props;
    this.setState({ isLoading: true });
    getProducts({
      data: {
        page: navigationProps.searchParams.get('page') || 1,
      },
      onComplete: () => this.setState({ isLoading: false })
    });    
  }

  componentDidUpdate(prevProps: Readonly<ProductProps>, prevState: Readonly<ProductState>, snapshot?: any): void {
    const prevPageNumber = prevProps.navigationProps.searchParams.get('page');
    const currentPageNumber = this.props.navigationProps.searchParams.get('page');
    
    if (prevPageNumber !== currentPageNumber) this.getProducts();
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
        fixed: 'left',
        width: 200,
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
          <a href={`/create-update-product/${row.key}`} onClick={(event) => {
            event.preventDefault();
            
            const { navigationProps } = this.props;
            const { navigate } = navigationProps;

            navigate(`/create-update-product/${row.key}`);
          }}><EditOutlined /> Edit</a>
        )
      },
    ];
  }

  render(): ReactNode {
    const columns = this.getColumns();
    const { isLoading } = this.state;
    const { products, totalProducts, navigationProps } = this.props;
    const { searchParams, setSearchParams } = navigationProps;
    const pageNumber = parseInt(searchParams.get('page') || '');

    return (
      <Layout style={{ minWidth: '100%', overflowX: 'auto' }}>
        <Title level={2}>View Products</Title>
        <Table 
          loading={isLoading} 
          columns={columns as (ColumnGroupType<any> | ColumnType<any>)[]} 
          pagination={{
            total: totalProducts,
            pageSize: 10,
            current: (pageNumber || 1),
            onChange: (page: number) => setSearchParams({ page })
          }}
          dataSource={(products || []).map(
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