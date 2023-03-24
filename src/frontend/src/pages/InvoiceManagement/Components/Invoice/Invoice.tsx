import { Component, ReactNode } from "react";
import { Badge, Dropdown, Layout, Space, Table, TableColumnsType, Typography } from 'antd';
import { Invoice as InvoiceType } from "../../Helpers/types";
import { NavigationProps } from "../../../../hoc/Navigation";
import { formatCurrency } from "../../../../config/utils";

const { Title } = Typography;

interface InvoiceProps {
  invoices: InvoiceType[];
  totalInvoices: number;
  getInvoices: Function;
  navigationProps: NavigationProps;
}

interface InvoiceState {
  isLoading: boolean;
}

export default class Invoice extends Component<InvoiceProps, InvoiceState> {

  constructor(props: InvoiceProps) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount(): void {
    this.getInvoices();
  }

  getInvoices = () => {
    const { getInvoices, navigationProps } = this.props;
    this.setState({ isLoading: true });
    getInvoices({
      data: {
        page: navigationProps.searchParams.get('page') || 1,
      },
      onComplete: () => this.setState({ isLoading: false })
    });    
  }

  getColumns = () => {
    return [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
      },
      {
        key: 'customer',
        title: 'Customer',
        dataIndex: 'customer',
        children: [
          {
            key: 'customerName',
            title: 'Name',
            dataIndex: 'customerName'
          },
          {
            key: 'customerPhone',
            title: 'Phone',
            dataIndex: 'customerPhone'
          },
        ]
      },
      {
        key: 'payments',
        title: 'Payment',
        dataIndex: 'payments',
      },
    ];
  }

  expandedRowRender = (args: any) => {
    const { invoices } = this.props;
    const currentInvoice = invoices.find(invoice => invoice.id === args.key);
    if (!currentInvoice || !(currentInvoice ||{}).invoiceItems) return null;

    const { invoiceItems } = currentInvoice;

    const columns: TableColumnsType<any> = [
      { 
        title: 'Products', 
        children: [
          {
            key: 'brandName',
            title: 'Brand Name',
            dataIndex: 'brand'
          },
          {
            key: 'name',
            title: 'Name',
            dataIndex: 'name'
          },{
            key: 'type',
            title: 'Type',
            dataIndex: 'type',
          },
          { title: 'Price', dataIndex: 'itemPrice', key: 'itemPrice' },
          { title: 'Quantity', dataIndex: 'itemQuantity', key: 'itemQuantity' },
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
        ]     
      },
    ];
    
    return <Table columns={columns} pagination={false} dataSource={(invoiceItems || []).map(item => ({
      itemPrice: item.price,
      itemQuantity: item.quantity,
      brand: item.product.brand,
      name: item.product.name,
      type: item.product.type,
      quality: item.product.quality,
      height: item.product.height,
      width: item.product.width,
      netPrice: `${formatCurrency(item.price * item.quantity)} PKR`,
      unitMeasurements: item.product.height && item.product.width ? `${((item.product.height * item.product.width) / 1600)} meters` : null,
      netMeasurements: item.product.height && item.product.width ? `${((item.product.height * item.product.width * item.quantity) / 1600)} meters` : null
      
    }))} />;
  };

  render(): ReactNode {
    const columns = this.getColumns();
    const { isLoading } = this.state;
    const { invoices, totalInvoices, navigationProps } = this.props;
    const { searchParams, setSearchParams } = navigationProps;
    const pageNumber = parseInt(searchParams.get('page') || '');

    return (
      <Layout style={{ minWidth: '100%', overflowX: 'auto' }}>
        <Title level={2}>View Invoices</Title>
        <Table 
          loading={isLoading} 
          columns={columns} 
          expandable={{ expandedRowRender: this.expandedRowRender, defaultExpandedRowKeys: ['0'] }}
          pagination={{
            total: totalInvoices,
            pageSize: 10,
            current: (pageNumber || 1),
            onChange: (page: number) => setSearchParams({ page })
          }}
          dataSource={invoices.map((invoice, index) => ({
            key: invoice.id,
            id: (((pageNumber || 1) - 1) * 10) + (index + 1),
            customerName: (invoice.customer || {}).name,
            customerPhone: (invoice.customer || {}).phone,
            payments: invoice.payments.map(payment => `${formatCurrency(payment.amount)} PKR as ${payment.paymentType}`),
          }))} />
      </Layout>
    );
  }

}