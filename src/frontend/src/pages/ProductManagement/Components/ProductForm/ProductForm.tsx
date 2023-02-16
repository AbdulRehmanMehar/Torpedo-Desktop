import { AutoComplete, Button, Form, FormInstance, Input, InputRef, Layout, Select, Typography } from "antd";
import { Component, createRef, forwardRef, Fragment, SyntheticEvent, ReactNode, Ref, RefObject } from "react";
import { NavigationProps } from "../../../../hoc/Navigation";
import { toast } from 'react-toastify';

import {
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import ReactDOM from "react-dom";


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

interface ProductFormProps {
  navigationProps: NavigationProps;
  invoices: any[];
  getAllProducts: Function;
  addInvoice: Function;
}

interface ProductFormState {
  options: any[];
  formInputs: Record<any, any>;
  suggestions: Record<any, any[]>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

export default class ProductForm extends Component<ProductFormProps, ProductFormState> {

  private inputRefs: RefObject<any>[];
  private numberOfFormFields: number;
  private submitButtonRef: RefObject<HTMLButtonElement>;
  private defaultTypeForProduct = 'Tiles';
  private formRef: Ref<FormInstance<any>>;

  constructor(props: ProductFormProps) {
    super(props);

    this.state = {
      options: [],
      formInputs: {
        type: this.defaultTypeForProduct,
      },
      suggestions: {},
    };

    this.numberOfFormFields = Object.keys(this.getFormFields()).length;

    const numberOfRefs = this.numberOfFormFields + 1/** for add payment information button */;
    this.inputRefs = [...Array(numberOfRefs)].map(() => createRef());

    this.formRef = createRef();
    this.submitButtonRef = createRef();
  }

  componentDidMount(): void {
    const { getAllProducts } = this.props;
    getAllProducts();

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

  componentDidUpdate(prevProps: Readonly<ProductFormProps>, prevState: Readonly<ProductFormState>): void { 
    const { payments } = this.state.formInputs;
    const { payments: paymentsOld } = prevState.formInputs;

    if (payments && payments.length && (!paymentsOld || paymentsOld.length !== payments.length)) {
      const index = this.inputRefs.length - 4;
      const currentRefEl = this.inputRefs[index];
      let loopItr = 1;
      let nextRef = this.inputRefs[index + loopItr];
      while (nextRef && !nextRef.current && this.inputRefs.length > (index + loopItr)){
        nextRef = this.inputRefs[index + loopItr];
        loopItr++;
      }
      
      currentRefEl.current && currentRefEl.current.focus(); // focus on recently added fields
    }

    const { invoices } = this.props;
    const { invoices: oldInvoices } = prevProps;

    if (JSON.stringify(invoices) !== JSON.stringify(oldInvoices)) {
      const productName = Array.from(new Set(invoices.map(invoice => `${invoice.productName}`))).map(value => ({ value }));
      const productPrice = Array.from(new Set(invoices.map(invoice => `${invoice.productPrice}`))).map(value => ({ value }));
      const customerName = Array.from(new Set(invoices.map(invoice => `${invoice.customerName}`))).map(value => ({ value }));
      const customerPhone = Array.from(new Set(invoices.map(invoice => `${invoice.customerPhone}`))).map(value => ({value }));
      const productQuantity = Array.from(new Set(invoices.map(invoice => `${invoice.productQuantity}`))).map(value => ({ value }));
      const productMeasurements = Array.from(new Set(invoices.map(invoice => `${invoice.productMeasurements}`))).map(value => ({ value }));

      this.setState({ 
        suggestions: {
          productName,
          productPrice,
          customerName,
          customerPhone,
          productQuantity,
          productMeasurements
        }
      });
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('keyup', this.listenForKeyPress);
  }

  getFormFields = (): Record<any, FormFields & { readOnly?: boolean, type?: 'select' | 'number' | 'text', optional?: boolean, rules?: any[] }> => {
    const { formInputs } = this.state;
    return {
      brand: {
        label: 'Brand Name',
        placeholder: 'Masters',
        suggestions: [],
        value: formInputs['brand'] || '',
      },
      name: {
        label: 'Product Name',
        placeholder: 'Masters Tiles',
        suggestions: [],
        value: formInputs['name'] || '',
      },
      price: {
        label: 'Product Price',
        placeholder: '1000',
        suggestions: [],
        type: 'number',
        value: formInputs['price'] || '',
      },
      quantity: {
        label: 'Product Quantity',
        placeholder: '25',
        suggestions: [],
        type: 'number',
        value: formInputs['quantity'] || '',
      },
      type: {
        label: 'Product Type',
        placeholder: 'Tile',
        suggestions: [],
        type: 'select',
        options: ['Tiles', 'Others'],
        value: formInputs['type'] || this.defaultTypeForProduct,
      },
      ...(this.state.formInputs.type === 'Tiles' ? {
        height: {
          label: 'Product Height',
          placeholder: '7',
          suggestions: [],
          type: 'number',
          value: formInputs['height'] || '',
        },
        width: {
          label: 'Product Width',
          placeholder: '10',
          suggestions: [],
          type: 'number',
          value: formInputs['width'] || '',
        },
        ...(!!this.state.formInputs.height && !!this.state.formInputs.width ? {
          measurements: {
            label: 'Measurements',
            suggestions: [],
            type: 'number',
            value: `${(parseInt(this.state.formInputs.height) * parseInt(this.state.formInputs.width)) / 1600}`,
            optional: true,
            rules: [],
            readOnly: true,
          }
        } : {}),
        ...(!!this.state.formInputs.height && !!this.state.formInputs.width && !!this.state.formInputs.quantity ? {
          totalMeasurements: {
            label: 'Total Measurements',
            suggestions: [],
            type: 'number',
            value: `${(parseInt(this.state.formInputs.height) * parseInt(this.state.formInputs.width) * parseInt(this.state.formInputs.quantity)) / 1600}`,
            optional: true,
            rules: [],
            readOnly: true,
          }
        } : {})
      } : {}),
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


  submitTheForm = () => {
    const { formInputs } = this.state;
    const { addInvoice, navigationProps } = this.props;
    const { navigate } = navigationProps;

    console.log({formInputs});
    

    if (Object.keys(formInputs).length < 7) return toast('Please add payment information'); 

    const netPayable = (formInputs.productQuantity || 0) * (formInputs.productPrice || 0);
    const { payments } = formInputs;
    const paymentAmounts = payments.map((payment: any) => payment.amount);
    const netPaid = paymentAmounts.reduce((last: number, current:number) => last + parseInt('' + current), 0);

    if (netPaid !== netPayable) return toast(`Net Payable amount is ${netPayable} but Total Paid is ${netPaid}. Please fix it.`);


    addInvoice({
      data: {...formInputs},
      onSuccess: () => {
        toast('The invoice has been added');
        navigate('/');
      }, 
      onError: () => {
        toast('Something went wrong while adding...');
        navigate('/');
      }
    })
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render(): ReactNode {
    const { formInputs, suggestions } = this.state;
    const formFields = this.getFormFields();
    const isSubmitDisabled = Object.keys(formFields).filter(key => !formFields[key].optional).map(key => !!this.state.formInputs[key]).includes(false);    
    
    

    return (
      <Layout style={{ height: '100% !important', overflowY: 'auto' }}>
        <Title level={2}>Create a Product</Title>
        <Form {...formItemLayout} initialValues={{
          height: formInputs['height'],
          width: formInputs['width'],
          type: this.defaultTypeForProduct
        }} style={{ margin: '0 20px'}} onFinish={(values: any) => console.log({ values })} onFinishFailed={(errorInfo: any) => console.log({ errorInfo })}>
          {Object.keys(formFields).map((key, index) => {
            const { 
              label, 
              placeholder,
              type,
              options,
              value: defaultValue,
              optional,
              rules,
              readOnly
            } = formFields[key];

            const value = formInputs[key] || '';
            const currentRef = this.inputRefs[index];
            const currentSuggestion = suggestions[key] || [];

            return (
              <Item key={`product[${key}]`} required={!optional} label={label} name={key} labelAlign={'left'} colon={false} rules={rules || [ { required: true, message: `${label} is required.` } ]}>
                {type === 'select' ? (
                  <Select 
                    ref={currentRef}
                    value={value} 
                    onSelect={(selectedItem: any) => {
                      this.setState((prevState) => {
                        return {
                          ...prevState,
                          formInputs: {
                            ...prevState.formInputs,
                            [key]: selectedItem
                          }
                        }
                      });
                    }}
                    
                    onKeyUp={(event) => {
                      this.focusNextElement(event, index)
                    }}
                  >
                    {options?.map((option: string, index3: number) => (
                      <Option 
                        key={`${option}-${index3}`} 
                        value={option}
                      >{option}</Option>
                    ))}
                  </Select>
                ) : (  
                  
                    readOnly ? (
                      <>
                        <Input 
                          ref={currentRef}
                          autoFocus={index === 0}
                          value={`${defaultValue} meters`}
                          type={'text'}
                          readOnly={true}
                          onKeyUp={(event: any) => {
                            if (this.focusNextElement(event, index)) return;
                          }} />
                      </>
                    ) : (
                      <AutoComplete
                        // defaultValue={value}
                        options={currentSuggestion}
                        onSelect={(value: any) => {
                          this.setState((prevState) => {
                              return {
                                ...prevState,
                                formInputs: {
                                  ...prevState.formInputs,
                                  [key]: value
                                }
                              }
                            });
                        }}
                        onSearch={this.onSearch}>
                        
                        <Input 
                          ref={currentRef}
                          autoFocus={index === 0}
                          value={value}
                          type={type || 'text'}
                          placeholder={placeholder}
                          onKeyUp={(event: any) => {
                            if (this.focusNextElement(event, index)) return;

                            this.setState((prevState) => {
                              return {
                                ...prevState,
                                formInputs: {
                                  ...prevState.formInputs,
                                  [key]: event.target.value
                                }
                              }
                            });
                          }} />
                      </AutoComplete>
                    )
                  
                )}
              </Item>
            );
          })}

          <Item label={' '} colon={false}>
            <Button title={Object.keys(formInputs).length < 8 ? 'Fill in all the fields and add payment info as well' : ''} disabled={isSubmitDisabled} ref={this.submitButtonRef} htmlType="submit" type="primary" block icon={<SaveOutlined />}>
                Save
            </Button>
          </Item>
        </Form>
      </Layout>
    )
  }

}