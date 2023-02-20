import { AutoComplete, Button, Form, Input, InputRef, Layout, Popconfirm, Select, Space, Spin, Typography } from "antd";
import { Component, createRef, forwardRef, Fragment, SyntheticEvent, ReactNode, Ref, RefObject } from "react";
import { NavigationProps } from "../../../../hoc/Navigation";
import { toast } from 'react-toastify';
import { MinusOutlined } from '@ant-design/icons';

import {
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import ReactDOM from "react-dom";
import { Invoice } from "../../Helpers/types";
import { addInvoice } from "../../Store/Actions";
import { InvoiceSuggestions } from "../../../../config/types";
import { FormProps } from "../../../../hoc/AntForm";
import { FormInstance } from "antd/lib/form/Form";


const { Item } = Form;
const { Option } = Select;
const { Title } = Typography;

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

interface FormFields {
  label: string;
  suggestions?: [];
  placeholder?: string;
  value?: string;
  options?: string[];
}

interface InvoiceFormProps {
  navigationProps: NavigationProps;
  suggestions: InvoiceSuggestions;
  // getInvoices: Function;
  addInvoice: Function;
  formProps: FormProps;
}

interface InvoiceFormState {
  options: any[];
  formInputs: Record<any, any>;
  initialValues: any;
  isProcessing: boolean;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

export default class InvoiceForm extends Component<InvoiceFormProps, InvoiceFormState> {

  private inputRefs: RefObject<any>[];
  private numberOfFormFields: number;
  private submitButtonRef: RefObject<HTMLButtonElement>;
  private formRef: RefObject<FormInstance<any>>;
  
  constructor(props: InvoiceFormProps) {
    super(props);

    this.state = {
      options: [],
      formInputs: {},
      initialValues: {},
      isProcessing: false,
    };

    this.numberOfFormFields = Object.keys(this.getFormFields()).length;

    const numberOfRefs = this.numberOfFormFields + 1/** for add payment information button */;
    this.inputRefs = [...Array(numberOfRefs)].map(() => createRef());

    this.submitButtonRef = createRef();
    this.formRef = createRef<FormInstance>();
  }

  componentDidMount(): void {
    document.addEventListener('keyup', this.listenForKeyPress);
  }

  listenForKeyPress = (event: any) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    if (event.ctrlKey) {      
      
      this.submitButtonRef &&
        this.submitButtonRef.current && 
        this.submitButtonRef.current.click();

      // return;
    }
    
    // const firstInputEl = this.inputRefs[0];
    
    // if (firstInputEl.current) firstInputEl.current.focus();
  }

  // componentDidUpdate(prevProps: Readonly<InvoiceFormProps>, prevState: Readonly<InvoiceFormState>): void { 
  //   const { payments } = this.state.formInputs;
  //   const { payments: paymentsOld } = prevState.formInputs;

  //   if (payments && payments.length && (!paymentsOld || paymentsOld.length !== payments.length)) {
  //     const index = this.inputRefs.length - 4;
  //     const currentRefEl = this.inputRefs[index];
  //     let loopItr = 1;
  //     let nextRef = this.inputRefs[index + loopItr];
  //     while (nextRef && !nextRef.current && this.inputRefs.length > (index + loopItr)){
  //       nextRef = this.inputRefs[index + loopItr];
  //       loopItr++;
  //     }
      
  //     currentRefEl.current && currentRefEl.current.focus(); // focus on recently added fields
  //   }

  //   // const { invoices } = this.props;
  //   // const { invoices: oldInvoices } = prevProps;

  //   // if (JSON.stringify(invoices) !== JSON.stringify(oldInvoices)) {
  //   //   const productName = Array.from(new Set(invoices.map(invoice => `${invoice.productName}`))).map(value => ({ value }));
  //   //   const productPrice = Array.from(new Set(invoices.map(invoice => `${invoice.productPrice}`))).map(value => ({ value }));
  //   //   const customerName = Array.from(new Set(invoices.map(invoice => `${invoice.customerName}`))).map(value => ({ value }));
  //   //   const customerPhone = Array.from(new Set(invoices.map(invoice => `${invoice.customerPhone}`))).map(value => ({value }));
  //   //   const productQuantity = Array.from(new Set(invoices.map(invoice => `${invoice.productQuantity}`))).map(value => ({ value }));
  //   //   const productMeasurements = Array.from(new Set(invoices.map(invoice => `${invoice.productMeasurements}`))).map(value => ({ value }));

  //   //   this.setState({ 
  //   //     suggestions: {
  //   //       productName,
  //   //       productPrice,
  //   //       customerName,
  //   //       customerPhone,
  //   //       productQuantity,
  //   //       productMeasurements
  //   //     }
  //   //   });
  //   // }
  // }

  componentWillUnmount(): void {
    document.removeEventListener('keyup', this.listenForKeyPress);
  }

  getFormFields = (): Record<any, FormFields> => {
    return {
      customerName: {
        label: 'Customer Name',
        placeholder: 'Qasim Bajwa',
        suggestions: [],
        value: ''
      },
      customerPhone: {
        label: 'Customer Phone',
        placeholder: '0321 3221515',
        suggestions: [],
        value: ''
      },
      productName: {
        label: 'Product Name',
        placeholder: 'Master Tiles',
        suggestions: [],
        value: ''
      },
      productQuantity: {
        label: 'Product Quantity',
        placeholder: '20',
        suggestions: [],
        value: ''
      },
      productPrice: {
        label: 'Product Price',
        placeholder: '1000',
        suggestions: [],
        value: ''
      },
      productMeasurements: {
        label: 'Product Measurements',
        placeholder: '20x20',
        suggestions: [],
        value: ''
      },
    };
  }

  getPaymentFields = (): Record<any, FormFields> => {
    return {
      paymentType: {
        label: 'Payment Type',
        options: ['Cash', 'Credit', 'Debt'],
        placeholder: 'Cash, Credit or Debt'
      },
      amount: {
        label: 'Amount',
        placeholder: '1000',
      }
    };
  }


  onSearch = (searchText: string) => {
    this.setState({
      options: !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    });
  };

  onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  focusNextElement = (event: any, index: any) => {
    let loopItr = 1;
    let nextRef = this.inputRefs[index + loopItr];
    while (nextRef && !nextRef.current && this.inputRefs.length > (index + loopItr)){
      nextRef = this.inputRefs[index + loopItr];
      loopItr++;
    }

    if (event.key === 'Enter' && !event.ctrlKey && nextRef && nextRef.current) {
      nextRef.current.focus();    
      return true;
    }

    return false;
  }


  submitTheForm = (values: any) => {
    const { addInvoice, navigationProps } = this.props;
    const { navigate } = navigationProps;
    this.setState({ isProcessing: true });

    addInvoice({
      data: {...values},
      onSuccess: () => {
        toast.success('The invoice has been added');
        navigate('/list-invoices');
      }, 
      onError: (message: string) => {
        toast.error(message || 'Something went wrong while adding...');
      },
      onComplete: () => this.setState({ isProcessing: false })
    })
  }

  convertProductsToArray = () => {
    const array: any[] = [];
    const { initialValues } = this.state;
    const mapAble = (initialValues.products || {});
    Object.keys(mapAble).forEach((key) => {
      array.splice(parseFloat(key), mapAble[key]);
    })
    return array;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render(): ReactNode {
    const { formInputs, initialValues, isProcessing } = this.state;
    const { payments: paymentDynamicArray }: any = formInputs;
    const formKey = Math.random() + "";
    const formFields = this.getFormFields();
    const paymentFields = this.getPaymentFields();

    const { suggestions, formProps } = this.props;


    return (
      <Layout style={{ height: '100% !important', overflowY: 'auto' }}>
        <Title level={2}>Create an Invoice</Title>
        <Form onFinish={(values) => {
          console.log('finsish', values);
          this.submitTheForm(values)
        }} ref={this.formRef} initialValues={{ products: [undefined] }} {...formItemLayout} style={{ margin: '0 20px'}} onFinishFailed={() => toast.error('Please fix errors from the fields')}>
          
          <Form.Item required={true} labelAlign={'left'} colon={false} name={['customer', 'phone']} label="Customer Phone" rules={[{ required: true, pattern: new RegExp('^((\\+92)|(0))(3)([0-9]{9})$', 'gm'), message: 'Customer Phone is not valid' }]}>
            <AutoComplete
              options={(((suggestions as any) || {})['customers'] || []).map((customer: any) => ({ value: `${customer.phone}`, customer }))}
              filterOption={(inputValue: string, option: any) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={(value: any, option: any) => {
                const { customer } = option;
                this.formRef.current?.setFieldValue(['customer', 'name'], customer.name)
              }}
            >
                          
              <Input placeholder="03167943024"  />
            </AutoComplete>
          </Form.Item>

          <Form.Item key={formKey} labelAlign={'left'} colon={false} name={['customer', 'name']} label="Customer Name" rules={[{ required: true, message: 'Customer Name is required' }]}>
            <AutoComplete
              options={(((suggestions as any) || {})['customers'] || []).map((customer: any) => ({ value: `${customer.name}`, customer: customer }))}
              filterOption={(inputValue: string, option: any) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            >
                          
              <Input placeholder="Abdul Rehman" />
            </AutoComplete>
          </Form.Item>

          <Form.List name="products" rules={[
            {
              validator: async (rules, value) => {
                const products = value;
                
                  if (!products || !products.length) {
                    return Promise.reject('Please add at least 1 product.');
                  }
                  const projectIds = products.map((product: any) => (product || {}).id).filter((id: string) => !!id);
                  if (!projectIds.length) return Promise.reject('Please add product(s) information.');
                  const uniqueProjectIds = [...new Set(projectIds)];
                  if (projectIds.length !== uniqueProjectIds.length) {
                    return Promise.reject('Duplicate Found! Please ensure that no product is added twice.');
                  }
                
                return Promise.resolve();
              },
            },
          ]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, ...field }, index) => (
                  <Fragment key={'formProducts'+index}>
                    <p style={{ textAlign: 'center' }}>
                      <b style={{ marginLeft: '150px' }}>Product #{(index + 1)}</b>
                    </p> 
                    <Form.Item
                      {...field}
                      // dependencies={}
                      label="Choose Product"
                      name={[field.name, 'title']}
                      colon={false}
                      labelAlign="left"
                      rules={[{ required: true, message: 'Select Product' }]}
                    >
                      <Select
                        placeholder="Choose a Product"
                        showSearch
                        options={(((suggestions as any) || {})['products'] || []).map((product: any) => ({ value: `${product.title}`, product: product }))}
                        filterOption={(inputValue: string, option: any) =>
                          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onSelect={(value: any, options: any) => {
                          const { product } = options;
                          const {price: purchasePrice, height, width, quality, id} = product;
                          let unitMeasurements = undefined;
                          const choosenQuantity = this.formRef.current?.getFieldValue(['products', index, 'quantity']);
                          const choosenPrice = this.formRef.current?.getFieldValue(['products', index, 'price']);
                          this.formRef.current?.setFieldValue(['products', index, 'purchasePrice'], purchasePrice);
                          this.formRef.current?.setFieldValue(['products', index, 'id'], id);
                          this.formRef.current?.setFieldValue(['products', index, 'width'], width);
                          this.formRef.current?.setFieldValue(['products', index, 'height'], height);
                          this.formRef.current?.setFieldValue(['products', index, 'quality'], quality);
                          if (height && width) {
                            unitMeasurements = (parseFloat(height) * parseFloat(width)) / 1600;
                            this.formRef.current?.setFieldValue(['products', index, 'unitMeasurements'], unitMeasurements);
                          }
                          if (quality && (!height || !width)) {
                            this.formRef.current?.setFieldValue(['products', index, 'unitMeasurements'], null);
                            this.formRef.current?.setFieldValue(['products', index, 'netMeasurements'], null);
                          }
                          
                          if (choosenQuantity && unitMeasurements) {
                            const netMeasurements = unitMeasurements * parseFloat(choosenQuantity);
                            this.formRef.current?.setFieldValue(['products', index, 'netMeasurements'], netMeasurements);
                          }
                          if (choosenPrice && choosenQuantity) {
                            const totalPrice = parseFloat(choosenPrice) * parseFloat(choosenQuantity);
                            this.formRef.current?.setFieldValue(['products', index, 'totalPrice'], totalPrice);
                          }
                          if (!quality) {
                            this.formRef.current?.setFieldValue(['products', index, 'quality'], null);
                          }

                          if (choosenPrice && purchasePrice) {
                            this.formRef.current?.resetFields([['products', index, 'price']]);
                            this.formRef.current?.setFieldValue(['products', index, 'price'], choosenPrice);
                            this.formRef.current?.validateFields([['products', index, 'price']]);
                          }
                          // this.setState({ initialValues: {
                          //   [index]: Math.random() + ''
                          // } }) // no use, just to perfrom re-render
                        }}
                      >
                      </Select>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prevValues, curValues) => {                      
                      return JSON.stringify(prevValues) !== JSON.stringify(curValues)
                    }}>
                      {() => (
                        <>
                          {this.formRef.current?.getFieldValue(['products', index, 'purchasePrice']) ? (
                            <Form.Item
                              {...field}
                              label="Purchase Price"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'purchasePrice']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled addonAfter="PKR" />
                            </Form.Item>
                          ) : null}
                          {this.formRef.current?.getFieldValue(['products', index, 'width']) ? (
                            <Form.Item
                              {...field}
                              label="Width"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'width']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled />
                            </Form.Item>
                          ) : null}
                          {this.formRef.current?.getFieldValue(['products', index, 'height']) ? (
                            <Form.Item
                              {...field}
                              label="Height"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'height']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled />
                            </Form.Item>
                          ) : null}
                          {this.formRef.current?.getFieldValue(['products', index, 'quality']) ? (
                            <Form.Item
                              {...field}
                              label="Quality"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'quality']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled />
                            </Form.Item>
                          ) : null}
                          {this.formRef.current?.getFieldValue(['products', index, 'unitMeasurements']) ? (
                            <Form.Item
                              {...field}
                              label="Unit Measurements"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'unitMeasurements']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled addonAfter='meters' />
                            </Form.Item>
                          ) : null}
                          <Form.Item
                            {...field}
                            label=" "
                            colon={false}
                            labelAlign="left"
                            name={[field.name, 'id']}
                            hidden
                          >
                            <Input disabled />
                          </Form.Item>
                        </>
                      )}
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prevValues, curValues) => {                
                      return JSON.stringify(prevValues) !== JSON.stringify(curValues);
                    }}>                           
                      {() => { 
                        const minValue = this.formRef.current?.getFieldValue(['products', index, 'purchasePrice']) || 1;
                        return (
                          <Form.Item
                            dependencies={[ ['products', index, 'purchasePrice'] ]}
                            {...field}
                            label="Selling Price"
                            colon={false}
                            labelAlign="left"
                            name={[field.name, 'price']}
                            style={{ width: 'auto' }}
                            rules={[{ validator: async (rule, value) => {
                              
                              if (!value) return Promise.reject('Price is required.');
                              if (value < minValue) return Promise.reject(`Price cannot be less than ${minValue}.`);
                              
                              return Promise.resolve()
                            }}]}
                          >
                            <AutoComplete
                              options={(((suggestions as any) || {})['products'] || []).map((product: any) => ({ value: `${product.price}`, product: product }))}
                              filterOption={(inputValue: string, option: any) =>
                                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                              } 
                              onSelect={(value: string) => {
                                const choosenPrice = value;
                                const choosenQuantity = this.formRef.current?.getFieldValue(['products', index, 'quantity']);
                                if (choosenPrice && choosenQuantity) {
                                  const totalPrice = parseFloat(choosenPrice) * parseFloat(choosenQuantity);
                                  if (totalPrice < 0) return;
                                  this.formRef.current?.setFieldValue(['products', index, 'totalPrice'], totalPrice);
                                  // this.setState({ initialValues: {
                                  //   [index]: Math.random() + ''
                                  // } })
                                }
                              }}
                            >  
                              <Input type="number" 
                                placeholder="2599"
                                addonAfter={'PKR'}
                                onChange={(event) => {
                                  const choosenPrice = event.target.value;
                                  const choosenQuantity = this.formRef.current?.getFieldValue(['products', index, 'quantity']);
                                  if (choosenPrice && choosenQuantity) {
                                    const totalPrice = parseFloat(choosenPrice) * parseFloat(choosenQuantity);
                                    if (totalPrice < 0) return;
                                    this.formRef.current?.setFieldValue(['products', index, 'totalPrice'], totalPrice);
                                    this.setState({ initialValues: {
                                      [index]: Math.random() + ''
                                    } })
                                  }
                                }}
                              />
                            </AutoComplete>
                          </Form.Item>
                        )
                      }}
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Selling Quantity"
                      colon={false}
                      labelAlign="left"
                      name={[field.name, 'quantity']}
                      style={{ width: 'auto' }}
                      rules={[{ validator: async(rule, value) => {
                        
                          if (!value) return Promise.reject('Quantity is required.');
                          if (value < 1) return Promise.reject ('Quantity cannot be less than 1.');
                        
                        return Promise.resolve()
                      }}]}
                    >
                      <AutoComplete
                        options={(((suggestions as any) || {})['products'] || []).map((product: any) => ({ value: `${product.quantity}`, product: product }))}
                        filterOption={(inputValue: string, option: any) =>
                          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onSelect={(value: any) => {
                          const choosenPrice = this.formRef.current?.getFieldValue(['products', index, 'price']);
                          const unitMeasurements = this.formRef.current?.getFieldValue(['products', index, 'unitMeasurements']);
                          const choosenQuantity = value;
                          if (choosenPrice && choosenQuantity) {
                            const totalPrice = parseFloat(choosenPrice) * parseFloat(choosenQuantity);
                            if (totalPrice < 0) return;
                            this.formRef.current?.setFieldValue(['products', index, 'totalPrice'], totalPrice);
                          }

                          if (unitMeasurements && choosenQuantity) {
                            const netMeasurements = parseFloat(unitMeasurements) * parseFloat(choosenQuantity);
                            if (netMeasurements < 0) return;
                            this.formRef.current?.setFieldValue(['products', index, 'netMeasurements'], netMeasurements);
                          }

                        }}
                      >
                                    
                        <Input 
                          type="number"
                          placeholder="10"
                          onChange={(event) => {
                            const choosenPrice = this.formRef.current?.getFieldValue(['products', index, 'price']);
                            const choosenQuantity = event.target.value;
                            const unitMeasurements = this.formRef.current?.getFieldValue(['products', index, 'unitMeasurements']);
                            if (choosenPrice && choosenQuantity) {
                              const totalPrice = parseFloat(choosenPrice) * parseFloat(choosenQuantity);
                              if (totalPrice < 0)  return;
                              this.formRef.current?.setFieldValue(['products', index, 'totalPrice'], totalPrice);
                              
                            }
                            if (unitMeasurements && choosenQuantity) {
                              const netMeasurements = parseFloat(unitMeasurements) * parseFloat(choosenQuantity);
                              if (netMeasurements < 0) return;
                              this.formRef.current?.setFieldValue(['products', index, 'netMeasurements'], netMeasurements);
                            }
                          }}
                        />
                      </AutoComplete>
                    </Form.Item>
                    
                    <Form.Item noStyle shouldUpdate={(prevValues, curValues) => JSON.stringify(prevValues) !== JSON.stringify(curValues)}>
                      {() => (
                        <>
                          
                          {this.formRef.current?.getFieldValue(['products', index, 'totalPrice']) ? (
                            <Form.Item
                              {...field}
                              label="Total Price"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'totalPrice']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled addonAfter={'PKR'} />
                            </Form.Item>
                          ) : null}
                          {this.formRef.current?.getFieldValue(['products', index, 'netMeasurements']) ? (
                            <Form.Item
                              {...field}
                              label="Total Measurements"
                              colon={false}
                              labelAlign="left"
                              name={[field.name, 'netMeasurements']}
                              style={{ width: 'auto' }}
                            >
                              <Input disabled addonAfter={'meters'} />
                            </Form.Item>
                          ) : null}
                        </>
                      )}
                    </Form.Item>
                    
                    
                    <Form.Item label=" " colon={false} labelAlign="left">
                      <Popconfirm
                        title={`Are you sure to remove Product #${index+1}`}
                        onConfirm={() => {
                          remove(field.name)
                          toast.info(`Product #${index+1} is removed.`)
                        }}
                        onCancel={() => toast.info(`Operation Canceled.`)}
                        okText="Yes - Remove it"
                        cancelText="Cancel - Don't remove"
                      >
                        <Button type="dashed" danger block icon={<MinusOutlined/>}>
                          Remove Product #{(index + 1)}
                        </Button>
                      </Popconfirm>
                    </Form.Item>
                    {/* <Form.Item label=" " colon={false} labelAlign="left">
                      <Button type="dashed" danger onClick={() => remove(field.name)} block icon={<MinusOutlined/>}>
                        Remove Product #{(index + 1)}
                      </Button>
                    </Form.Item> */}
                  </Fragment >
                ))}


                <Form.Item label="Add Product(s)" colon={false} labelAlign="left">
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Product(s)
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          
          <Form.Item noStyle shouldUpdate={(prevValue, curValue) => JSON.stringify(prevValue) !== JSON.stringify(curValue)}>
            {() => (
              <>
                {(this.formRef.current?.getFieldValue('products') || []).length ? (
                  <Form.List
                    name="payments"
                    rules={[
                      {
                        validator: async (rules, value) => {
                          const payments = value;
                          
                            const products = this.formRef.current?.getFieldValue('products');

                            const totalPriceFromProductsArray = products.map((product: any) => product.totalPrice).filter((price: any) => !!price).map((price: any) => parseFloat(price));
                            if (products.length !== totalPriceFromProductsArray.length) {
                              return Promise.reject('Please fill in the product data before adding payment information');
                            }

                            if (!payments || !payments.length) {
                              return Promise.reject('Please add at least 1 payment.');
                            }
                            const paymentTypes = payments.map((payment: any) => (payment || {}).paymentType).filter((paymentType: string) => !!paymentType);
                            if (!paymentTypes.length) return Promise.reject('Please add payment(s) information.');                        

                            const uniquePaymentTypes = [...new Set(paymentTypes)];
                            if (paymentTypes.length !== uniquePaymentTypes.length) {
                              return Promise.reject('Duplicate Found! Please ensure that no payment type is added twice.');
                            }

                            const totalAmountFromPaymentsArray = payments.filter((payment:any) => !!payment && !!(payment || {}).amount).map((payment: any) => payment.amount).filter((amount: any) => !!amount).map((amount: any) => parseFloat(amount));
                            const totalAmount = (totalAmountFromPaymentsArray || []).reduce((prev: number, current: number) => prev + current, 0);
                            const totalPrice = (totalPriceFromProductsArray || []).reduce((prev: number, current: number) => prev + current, 0);
                            if (totalAmount > totalPrice) {
                              return Promise.reject('The total amount recieved is greater than payable amount.');
                            }
                            if (totalAmount < totalPrice) {
                              return Promise.reject('The total amount recieved is less than payable amount.');
                            }
                          return Promise.resolve() 
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((field, index) => (
                          <Fragment key={'formPayment'+index}>
                            <p style={{ textAlign: 'center' }}>
                              <b style={{ marginLeft: '150px' }}>Payment #{(index + 1)}</b>
                            </p> 
                            
                            <Form.Item
                              
                              required={true}
                              name={[field.name, 'paymentType']}
                              label="Payment Type"
                              colon={false}
                              labelAlign="left"
                            >
                              <Select
                                placeholder="Choose any of the -> Debt | Credit | Cash"
                                showSearch
                                options={(['Debt', 'Credit', 'Cash']).map((paymentType: any) => ({ value: `${paymentType}` }))}
                                filterOption={(inputValue: string, option: any) =>
                                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                              >
                              </Select>
                            </Form.Item>

                            <Form.Item
                              
                              name={[field.name, 'amount']}
                              label="Amount"
                              colon={false}
                              labelAlign="left"
                              rules={[
                                { validator: async (rule, value) => {
                                  
                                  if (!value) return Promise.reject('Amount is required.');
                                  if (value < 1) return Promise.reject('Amount cannot be less than 1.');
                                  return Promise.resolve()
                                }, },
                              ]}
                            >
                              <Input type="number" min={1} addonAfter="PKR" placeholder="2599" />
                            </Form.Item>
                            
                            <Form.Item label=" " colon={false} labelAlign="left">
                              <Popconfirm
                                title={`Are you sure to remove Payment #${index+1}`}
                                onConfirm={() => {
                                  remove(field.name)
                                  toast.info(`Payment #${index+1} is removed.`)
                                }}
                                onCancel={() => toast.info(`Operation Canceled.`)}
                                okText="Yes - Remove it"
                                cancelText="Cancel - Don't remove"
                              >
                                <Button type="dashed" danger block icon={<MinusOutlined/>}>
                                  Remove Payment #{(index + 1)}
                                </Button>
                              </Popconfirm>
                              

                            </Form.Item>
                            
                          </Fragment>
                        ))}
                        <Form.Item label="Add Payment(s)" labelAlign="left" colon={false}>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{ width: '100%' }}
                            icon={<PlusOutlined />}
                          >
                            Add Payment(s)
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                ): null}
              </>
            )}
          </Form.Item>

          

          <Item label={' '} colon={false}>
            <Button disabled={isProcessing} htmlType="submit" type="primary" block icon={isProcessing ? <Spin /> : <SaveOutlined />}>
              {isProcessing ? '' : 'Save'}
            </Button>
          </Item>
        </Form>
      </Layout>
    )
  }

}