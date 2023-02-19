import { FormInstance, useForm } from 'rc-field-form';
import React from 'react';

export type FormProps = FormInstance<any>;
export default function withForm(Component: React.ComponentType<any>) {
  const displayName = Component.displayName || Component.name || 'Component';

  const ComponentWithForm = (props: any) => {
    const [form] = useForm();
    return <Component {...props} formProps={form} />;
  };

  ComponentWithForm.displayName = `withForm(${displayName})`;
  return ComponentWithForm;
}