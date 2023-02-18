import { Component, ReactNode } from "react";
import { Layout, Table, Typography } from 'antd';
import { Invoice as InvoiceType } from "../../Helpers/types";

const { Title } = Typography;

interface InvoiceProps {
  invoices: InvoiceType[];
  getInvoices: Function;
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
    const { getInvoices } = this.props;

    getInvoices({
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
        key: 'customerName',
        title: 'Customer Name',
        dataIndex: 'customerName',
      },
      {
        key: 'customerPhone',
        title: 'Customer Phone',
        dataIndex: 'customerPhone',
      },
      {
        key: 'productName',
        title: 'Product Name',
        dataIndex: 'productName',
      },
      {
        key: 'productQuantity',
        title: 'Product Quantity',
        dataIndex: 'productQuantity',
      },
      {
        key: 'productPrice',
        title: 'Product Price',
        dataIndex: 'productPrice',
      },
      {
        key: 'productMeasurements',
        title: 'Product Measurements',
        dataIndex: 'productMeasurements',
      },
      {
        key: 'netPayable',
        title: 'Net Price',
        dataIndex: 'netPayable',
      },
      {
        key: 'payments',
        title: 'Payment',
        dataIndex: 'payments',
      },
    ];
  }

  render(): ReactNode {
    const columns = this.getColumns();
    const { isLoading } = this.state;
    const { invoices } = this.props;
    

    return (
      <Layout style={{ minWidth: '100%', overflowX: 'auto' }}>
        <Title level={2}>View Invoices</Title>
        <Table 
          loading={isLoading} 
          columns={columns} 
          pagination={false}
          dataSource={[]} />
      </Layout>
    );
  }

}