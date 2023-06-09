import { AutoComplete, Button, Form, FormInstance, Input, InputRef, Layout, Select, Spin, Typography } from "antd";
import { Component, createRef, forwardRef, Fragment, SyntheticEvent, ReactNode, Ref, RefObject } from "react";
import { NavigationProps } from "../../../../hoc/Navigation";
import { toast } from 'react-toastify';
import { Skeleton } from 'antd';
import {
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import ReactDOM from "react-dom";
import { ProductResponse, ProductSuggestions, SuggestionsResponse } from "../../../../config/types";
import { formatCurrency } from "../../../../config/utils";
import { validate as uuidValidate } from 'uuid';
import { SuggestionsStore } from "../../../../store/Reducers";

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
  products: ProductResponse[];
  addProduct: Function;
  product: ProductResponse;
  getSingleProduct: Function,
  updateProduct: Function;
  suggestions: ProductSuggestions;
  getSuggestions: Function;
}

interface ProductFormState {
  options: any[];
  formInputs: Record<any, any>;
  formType: 'Add' | 'Update';
  isLoading: boolean;
  isProcessing: boolean;
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
  private defaultTypeForProduct = 'Tile';
  private defaultQualityForProduct = 'A - High Quality';
  private formRef: RefObject<FormInstance<any>>;
  private initialState = {
    options: [],
    formInputs: {
      type: this.defaultTypeForProduct,
      quality: this.defaultQualityForProduct,
    },
    formType: 'Add',
    isLoading: false,
    isProcessing: false,
  };


  constructor(props: ProductFormProps) {
    super(props);

    this.state = this.initialState as ProductFormState;

    this.numberOfFormFields = Object.keys(this.getFormFields()).length;

    const numberOfRefs = this.numberOfFormFields + 1/** for add payment information button */;
    this.inputRefs = [...Array(numberOfRefs)].map(() => createRef());

    this.formRef = createRef<FormInstance>();
    this.submitButtonRef = createRef();
  }

  componentDidMount(): void {
    const { navigationProps } = this.props;
    const { pathParams } = navigationProps;
    const { productId } = pathParams;
    if (this.formRef && this.formRef.current) {
      this.formRef.current.resetFields();
      console.log('reset fields mounted');
    }
    if (productId && uuidValidate(productId || '')) {
      this.setState({ ...this.initialState, formType: 'Update' });
      this.getProduct(productId);
    }

    document.addEventListener('keyup', this.listenForKeyPress);
  }


  getProduct = (productId: string) => {
    const { getSingleProduct } = this.props;
    this.setState({ isLoading: true });
    getSingleProduct({
      data: { productId },
      onError: (message: string) => toast.error(message),
      onComplete: () => this.setState({ isLoading: false })
    })
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
    const { navigationProps, product } = this.props;
    const { pathParams } = navigationProps;
    const { productId } = pathParams;
    const { formType } = this.state;
    if (uuidValidate(productId || '') && formType !== 'Update') {
      this.setState({ formType: 'Update' });
    }
    if (!uuidValidate(productId || '') && formType !== 'Add') {
      if (this.formRef && this.formRef.current) {
        this.formRef.current.resetFields();
        console.log('reset fields');
      }
      this.setState({ formInputs: {
        type: this.defaultTypeForProduct,
        quality: this.defaultQualityForProduct,
      }, formType: 'Add' });
    }

    if (formType === 'Update' && !!product && prevProps.product !== product) {
      this.setState(prevState => ({
        ...prevState,
        formInputs: {
          ...product,
          type: product['type'] ||this.defaultTypeForProduct,
          quality: product['quality'] ||this.defaultQualityForProduct,
        }
      }));
    }
    
  }

  componentWillUnmount(): void {
    document.removeEventListener('keyup', this.listenForKeyPress);
  }

  getFormFields = (): Record<any, FormFields & { readOnly?: boolean, type?: 'select' | 'number' | 'text', optional?: boolean, rules?: any[], addonAfter?: string }> => {
    const { formInputs } = this.state;
    return {
      brand: {
        label: 'Brand Name',
        placeholder: 'Masters',
        suggestions: [],
        value: formInputs['brand'] || '',
      },
      name: {
        label: 'Name',
        placeholder: 'Masters Tiles',
        suggestions: [],
        value: formInputs['name'] || '',
      },
      price: {
        label: 'Unit Price',
        placeholder: '1000',
        suggestions: [],
        type: 'number',
        value: formInputs['price'] || '',
        addonAfter: 'PKR',
      },
      quantity: {
        label: 'Quantity',
        placeholder: '25',
        suggestions: [],
        type: 'number',
        value: formInputs['quantity'] || '',
      },
      ...(!!this.state.formInputs.price && !!this.state.formInputs.quantity ? {
        totalPrice: {
          label: 'Total Price',
          suggestions: [],
          type: 'number',
          value: `${formatCurrency((parseInt(this.state.formInputs.price) * parseInt(this.state.formInputs.quantity)))} PKR`,
          optional: true,
          rules: [],
          readOnly: true,
          addonAfter: 'PKR'
        }
      } : {}),
      type: {
        label: 'Type',
        placeholder: 'Tile',
        suggestions: [],
        type: 'select',
        options: ['Tile', 'Others'],
        value: formInputs['type'] || this.defaultTypeForProduct,
      },
      ...(this.state.formInputs.type === 'Tile' ? {
        height: {
          label: 'Height',
          placeholder: '7',
          suggestions: [],
          type: 'number',
          value: formInputs['height'] || '',
        },
        width: {
          label: 'Width',
          placeholder: '10',
          suggestions: [],
          type: 'number',
          value: formInputs['width'] || '',
        },
        ...(!!this.state.formInputs.height && !!this.state.formInputs.width ? {
          measurements: {
            label: 'Unit Measurements',
            suggestions: [],
            type: 'number',
            value: `${(parseInt(this.state.formInputs.height) * parseInt(this.state.formInputs.width)) / 1600} meteres`,
            optional: true,
            rules: [],
            readOnly: true,
            addonAfter: 'meters'
          }
        } : {}),
        ...(!!this.state.formInputs.height && !!this.state.formInputs.width && !!this.state.formInputs.quantity ? {
          totalMeasurements: {
            label: 'Total Measurements',
            suggestions: [],
            type: 'number',
            value: `${(parseInt(this.state.formInputs.height) * parseInt(this.state.formInputs.width) * parseInt(this.state.formInputs.quantity)) / 1600} meters`,
            optional: true,
            rules: [],
            readOnly: true,
            addonAfter: 'meters'
          }
        } : {})
      } : {
        quality: {
          label: 'Quality',
          placeholder: 'A',
          suggestions: [],
          type: 'select',
          options: ['A - Hight Quality', 'B - Medium Quality', 'C - Low Quality'],
          value: formInputs['quality'] || this.defaultQualityForProduct,
        }
      }),
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
    const { formInputs, formType } = this.state;
    const { addProduct, updateProduct, navigationProps, getSuggestions } = this.props;
    const { navigate } = navigationProps;
    const action = formType === 'Update' ? updateProduct : addProduct;

    this.setState({ isProcessing: true });
    action({
      data: {...formInputs},
      onSuccess: () => {
        toast.success(`The product has been ${formType === 'Add' ? 'added' : 'updated'}.`);
        navigate('/');
      }, 
      onError: () => {
        toast.error(`Something went wrong while ${formType === 'Add' ? 'adding' : 'updating'} the product.`);
      },
      onComplete: () => {
        this.setState({ isProcessing: false });
        getSuggestions();
      }
    })
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render(): ReactNode {
    const { suggestions } = this.props;
    const { formInputs, formType, isLoading, isProcessing } = this.state;
    const formFields = this.getFormFields();
    const isSubmitDisabled = Object.keys(formFields).filter(key => !formFields[key].optional).map(key => !!this.state.formInputs[key]).includes(false);    
    
    

    if (isLoading) return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
      }}>
        <div style={{ width: '80%' }}>
          <Skeleton active /><br />
        </div>
      </div>
    );

    return (
      <Layout key={formType} style={{ height: '100% !important', overflowY: 'auto' }}>
        <Title level={2} style={{ margin: '25px' }}>{formType} Product</Title>
        <Form ref={this.formRef} {...formItemLayout} initialValues={formType === 'Update' ? {
            ...formInputs,
            type: formInputs['type'] || this.defaultTypeForProduct,
            quality: formInputs['quality'] || this.defaultQualityForProduct,
          } as any : {
            height: formInputs['height'],
            width: formInputs['width'],
            type: formInputs['type'] || this.defaultTypeForProduct,
            quality: formInputs['quality'] || this.defaultQualityForProduct
        }} style={{ margin: '0 20px'}} onFinish={this.submitTheForm} onFinishFailed={() => toast.error('Please fix errors from the fields')}>
          {Object.keys(formFields).map((key, index) => {
            const { 
              label, 
              placeholder,
              type,
              options,
              value: defaultValue,
              optional,
              rules,
              readOnly,
              addonAfter,
            } = formFields[key];

            const value = formInputs[key] || '';
            const currentRef = this.inputRefs[index];
            const currentSuggestion = (((suggestions as any) || {})[key] || []).map((value: any) => ({ value: `${value}` }));

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
                    
                    // onKeyUp={(event) => {
                    //   this.focusNextElement(event, index)
                    // }}
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
                          value={`${defaultValue}`}
                          type={'text'}
                          disabled={true}
                          onKeyUp={(event: any) => {
                            // if (this.focusNextElement(event, index)) return;
                          }} addonAfter={addonAfter} />
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
                        filterOption={(inputValue: string, option: any) =>
                          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }>
                        
                        <Input 
                          ref={currentRef}
                          autoFocus={index === 0}
                          value={value}
                          type={type || 'text'}
                          placeholder={placeholder}
                          addonAfter={addonAfter}
                          onKeyUp={(event: any) => {
                            // if (this.focusNextElement(event, index)) return;

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
            <Button title={Object.keys(formInputs).length < 8 ? 'Fill in all the fields and add payment info as well' : ''} disabled={isSubmitDisabled || isProcessing} ref={this.submitButtonRef} htmlType="submit" type="primary" block icon={isProcessing ? <Spin /> : <SaveOutlined />}>
                {isProcessing ? null : 'Save'}
            </Button>
          </Item>
        </Form>
      </Layout>
    )
  }

}