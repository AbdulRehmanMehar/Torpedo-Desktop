import { AutoComplete, Button, Form, Input, InputRef, Layout, Select, Typography } from "antd";
import { Component, createRef, forwardRef, Fragment, SyntheticEvent, ReactNode, Ref, RefObject } from "react";
import { NavigationProps } from "../../../../hoc/Navigation";
import { toast } from 'react-toastify';

import {
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import ReactDOM from "react-dom";
import { Invoice } from "../../Helpers/types";
import { addInvoice } from "../../Store/Actions";


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
  invoices: Invoice[];
  getInvoices: Function;
  addInvoice: Function;
}

interface InvoiceFormState {
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

export default class InvoiceForm extends Component<InvoiceFormProps, InvoiceFormState> {

  private inputRefs: RefObject<any>[];
  private numberOfFormFields: number;
  private submitButtonRef: RefObject<HTMLButtonElement>;

  constructor(props: InvoiceFormProps) {
    super(props);

    this.state = {
      options: [],
      formInputs: {},
      suggestions: {},
    };

    this.numberOfFormFields = Object.keys(this.getFormFields()).length;

    const numberOfRefs = this.numberOfFormFields + 1/** for add payment information button */;
    this.inputRefs = [...Array(numberOfRefs)].map(() => createRef());

    this.submitButtonRef = createRef();
  }

  componentDidMount(): void {
    const { getInvoices } = this.props;
    getInvoices();

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

  componentDidUpdate(prevProps: Readonly<InvoiceFormProps>, prevState: Readonly<InvoiceFormState>): void { 
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


  submitTheForm = () => {
    const { formInputs } = this.state;
    const { addInvoice, navigationProps } = this.props;
    const { navigate } = navigationProps;

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
    const { payments: paymentDynamicArray }: any = formInputs;
    
    const formFields = this.getFormFields();
    const paymentFields = this.getPaymentFields();

    return (
      <Layout style={{ height: '100% !important', overflowY: 'auto' }}>
        <Title level={2}>Create an Invoice</Title>
        <Form {...formItemLayout} style={{ margin: '0 20px'}} onFinish={this.submitTheForm}>
          {Object.keys(formFields).map((key, index) => {
            const { 
              label, 
              placeholder,
            } = formFields[key];

            const value = formInputs[key] || '';
            const currentRef = this.inputRefs[index];
            const currentSuggestion = suggestions[key] || [];

            return (
              <Item key={`invoice[${key}]`} label={label} name={key} labelAlign={'left'} colon={false} rules={[ { required: true, message: `${label} is required.` } ]}>
                <AutoComplete
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
                    type={(key === 'productQuantity' || key === 'productPrice') ? 'number' : 'text'}
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
              </Item>
            );
          })}

          {paymentDynamicArray && paymentDynamicArray.length && paymentDynamicArray.map((fields: any, index: number) => {
            
            const paymentsRefArray = this.inputRefs.slice(
              (this.inputRefs.length - 1) - (paymentDynamicArray.length * 2), 
              (this.inputRefs.length - 1)
            );

            const startIdx = index * 2;
            const currentRefrray = paymentsRefArray.slice(startIdx, paymentsRefArray.length).slice(0, 2);

            return (
              <Fragment key={`payment-${index}`}>
                {Object.keys(fields).map((key: any, index2: number) => {
                  const { label, options, placeholder } = paymentFields[key];
                  const value = (paymentDynamicArray[index] || {})[key] || '';
                  
                  
                  if (key === 'paymentType') {
                    if (!options) return null;
                    return (
                      <Item key={`paymentType-${index2}`} label={label} colon={false} labelAlign={'left'}>
                        <Select 
                          ref={currentRefrray[0]} 
                          defaultValue={value || options[0]} 
                          placeholder={placeholder}  
                          onSelect={(selectedItem: any) => {
                            this.setState((prevState) => {
                              const { payments }: any = prevState.formInputs;
                              payments[index]['paymentType'] = selectedItem;                            
                              return {
                                ...prevState,
                                formInputs: {
                                  ...prevState.formInputs,
                                  payments
                                }
                              }
                            });
                          }}
                          
                          onKeyUp={(event) => {
                            this.focusNextElement(event, this.numberOfFormFields + startIdx)
                          }}
                        >
                            {options.map((option: string, index3: number) => (
                              <Option 
                                key={`${option}-${index3}`} 
                                value={option}
                              >{option}</Option>
                            ))}
                        </Select>
                      </Item>
                    )
                  }

                  return (
                    <Item key={`amount-${index2}`} label={label} colon={false} labelAlign={'left'}>
                      <Input 
                        ref={currentRefrray[1]}
                        value={value} 
                        placeholder={placeholder}
                        type={'number'}
                        onKeyUp={(event) => {
                          this.focusNextElement(event, this.numberOfFormFields + startIdx + 1);
                        }}
                        onInput={(event: any) => {
                          this.setState((prevState) => {
                            const { payments }: any = prevState.formInputs;
                            payments[index]['amount'] = event.target.value;                            
                            return {
                              ...prevState,
                              formInputs: {
                                ...prevState.formInputs,
                                payments
                              }
                            }
                          });
                        }} />
                    </Item>
                  );
                })}
              </Fragment>
            );
          })}

          <Item label={' '} colon={false}>
            <Button ref={this.inputRefs[this.inputRefs.length - 1]} type="dashed" block icon={<PlusOutlined />} onClick={() => {
              this.inputRefs.splice(this.inputRefs.length - 2, 0, createRef(), createRef());

              this.setState(prevState => {
                let { payments }: any = formInputs;
                if (!payments) payments = [];

                payments = JSON.parse(JSON.stringify(payments));

                const formObjectFromPayments = Object.keys(paymentFields)
                  .reduce((prevValue, currentValue) => ({
                    ...prevValue, 
                    [currentValue]: (paymentFields[currentValue].options || [])[0] || ''
                  }), {});

                payments.push(formObjectFromPayments);

                return {
                  ...prevState,
                  formInputs: {
                    ...formInputs,
                    payments
                  }
                }
              });
              
            }}>
              Add Payment Information
            </Button>
          </Item>

          <Item label={' '} colon={false}>
            <Button title={Object.keys(formInputs).length < 8 ? 'Fill in all the fields and add payment info as well' : ''} disabled={Object.keys(formInputs).length < 7} ref={this.submitButtonRef} htmlType="submit" type="primary" block icon={<SaveOutlined />}>
                Save
            </Button>
          </Item>
        </Form>
      </Layout>
    )
  }

}