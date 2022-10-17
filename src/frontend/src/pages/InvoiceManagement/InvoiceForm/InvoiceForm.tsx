import { AutoComplete, Input, Layout } from "antd";
import { Component, ReactNode } from "react";
import { NavigationProps } from "../../../hoc/Navigation";

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

interface InvoiceFormProps {
  navigationProps: NavigationProps;
}

interface InvoiceFormState {
  options: any[];

}

export default class InvoiceForm extends Component<InvoiceFormProps, InvoiceFormState> {

  constructor(props: InvoiceFormProps) {
    super(props);

    this.state = {
      options: []
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

  render(): ReactNode {
    const { options } = this.state;

    return (
      <Layout>
        <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{ width: 300 }}
          options={options}
          onSelect={this.onSelect}
          onSearch={this.onSearch}>
            
          <Input size="large" placeholder="input here" />
        </AutoComplete>
      </Layout>
    )
  }

}