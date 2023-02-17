import { AutoComplete, Button, Form, FormInstance, Input, InputRef, Layout, Select, Typography } from "antd";
import { Component, createRef, forwardRef, Fragment, SyntheticEvent, ReactNode, Ref, RefObject } from "react";
import { NavigationProps } from "../../../../hoc/Navigation";
import { toast } from 'react-toastify';
import { Skeleton } from 'antd';
import {
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import ReactDOM from "react-dom";
import { ProductResponse } from "../../../../config/types";
import { formatCurrency } from "../../../../config/utils";
import { validate as uuidValidate } from 'uuid';

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
  getAllProducts: Function;
  addProduct: Function;
  product: ProductResponse;
  getSingleProduct: Function,
  updateProduct: Function;
}

interface ProductFormState {
  options: any[];
  formInputs: Record<any, any>;
  suggestions: Record<any, any[]>;
  formType: 'Add' | 'Update';
  isLoading: boolean;
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
  private formRef: Ref<FormInstance<any>>;
  private initialState = {
    options: [],
    formInputs: {
      type: this.defaultTypeForProduct,
      quality: this.defaultQualityForProduct,
    },
    suggestions: {},
    formType: 'Add',
    isLoading: false,
  };


  constructor(props: ProductFormProps) {
    super(props);

    this.state = this.initialState as ProductFormState;

    this.numberOfFormFields = Object.keys(this.getFormFields()).length;

    const numberOfRefs = this.numberOfFormFields + 1/** for add payment information button */;
    this.inputRefs = [...Array(numberOfRefs)].map(() => createRef());

    this.formRef = createRef();
    this.submitButtonRef = createRef();
  }

  componentDidMount(): void {
    const { getAllProducts, navigationProps } = this.props;
    const { pathParams } = navigationProps;
    const { productId } = pathParams;
    if (productId && uuidValidate(productId || '')) {
      this.setState({ ...this.initialState, formType: 'Update' });
      this.getProduct(productId);
    }
    
    getAllProducts();

    document.addEventListener('keyup', this.listenForKeyPress);
  }


  getProduct = (productId: string) => {
    const { getSingleProduct } = this.props;
    this.setState({ isLoading: true });
    getSingleProduct({
      data: { productId },
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
    const { products } = this.props;
    const { products: oldProducts } = prevProps;

    if (JSON.stringify(products) !== JSON.stringify(oldProducts)) {
      const brand = Array.from(new Set(products.map(product => `${product.brand}`))).map(value => ({ value }));
      const price = Array.from(new Set(products.map(product => `${product.price}`))).map(value => ({ value }));
      const name = Array.from(new Set(products.map(product => `${product.name}`))).map(value => ({ value }));
      const quantity = Array.from(new Set(products.map(product => `${product.quantity}`))).map(value => ({value }));
      const quality = Array.from(new Set(products.map(product => `${product.quality}`))).map(value => ({ value }));
      const height = Array.from(new Set(products.map(product => `${product.height}`))).map(value => ({ value }));
      const width = Array.from(new Set(products.map(product => `${product.width}`))).map(value => ({ value }));

      this.setState({ 
        suggestions: {
          brand,
          price,
          name,
          quantity,
          quality,
          height,
          width,
        }
      });
    }

    const { getAllProducts, navigationProps, product } = this.props;
    const { pathParams } = navigationProps;
    const { productId } = pathParams;
    const { formType } = this.state;
    if (uuidValidate(productId || '') && formType !== 'Update') {
      this.setState({ formType: 'Update' });
    }
    if (!uuidValidate(productId || '') && formType !== 'Add') {
      this.setState({ formType: 'Add' });
    }

    if (formType === 'Update' && !!product && prevProps.product !== product) {
      this.setState(prevState => ({
        ...prevState,
        formInputs: {
          ...product,
          ...prevState.formInputs
        }
      }));
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
    const { addProduct, updateProduct, navigationProps } = this.props;
    const { navigate } = navigationProps;
    const action = formType === 'Update' ? updateProduct : addProduct;

    action({
      data: {...formInputs},
      onSuccess: () => {
        toast(`The product has been ${formType === 'Add' ? 'added' : 'updated'}.`);
        navigate('/list-products');
      }, 
      onError: () => {
        toast(`Something went wrong while ${formType === 'Add' ? 'adding' : 'updating'} the product.`);
      }
    })
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render(): ReactNode {
    const { formInputs, suggestions, formType, isLoading } = this.state;
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
      <Layout style={{ height: '100% !important', overflowY: 'auto' }}>
        <Title level={2} style={{ margin: '25px' }}>{formType} Product</Title>
        <Form {...formItemLayout} initialValues={formType === 'Update' ? {
            ...formInputs,
            type: formInputs['type'] || this.defaultTypeForProduct,
            quality: formInputs['quality'] || this.defaultQualityForProduct,
          } as any : {
            height: formInputs['height'],
            width: formInputs['width'],
            type: formInputs['type'] || this.defaultTypeForProduct,
            quality: formInputs['quality'] || this.defaultQualityForProduct
        }} style={{ margin: '0 20px'}} onFinish={this.submitTheForm} onFinishFailed={(errorInfo: any) => console.log({ errorInfo })}>
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
                          value={`${defaultValue}`}
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