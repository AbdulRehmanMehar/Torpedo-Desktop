import { Route, Routes } from 'react-router-dom';
import { Component, lazy, ReactNode, Suspense } from 'react';
import {
  DesktopOutlined,
  UnorderedListOutlined,
  PlusSquareOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons';

const InvoiceList = lazy(() => import('./pages/InvoiceManagement/Components/Invoice'));
const InvoiceForm = lazy(() => import('./pages/InvoiceManagement/Components/InvoiceForm'));

const ProductList = lazy(() => import('./pages/ProductManagement/Components/Products'));
const ProductForm = lazy(() => import('./pages/ProductManagement/Components/ProductForm'));

export const menu: Record<any, any> = {
  ProductManagement: {
    label: 'Product Management',
    icon: <DeploymentUnitOutlined />,
    children: [
      {
        key: 'list-products',
        path: '/list-products',
        label: 'Products',
        icon: <UnorderedListOutlined />,
        component: ProductList,
      },
      {
        key: 'create-update-product',
        path: '/create-update-product/:productId',
        // defaultPath: '/create-update-product',
        label: 'Create Product',
        icon: <PlusSquareOutlined />,
        component: ProductForm,
      },
    ]
  },
  InvoiceManagement: {
    label: 'Invoice Management',
    icon: <DesktopOutlined />,
    children: [
      {
        key: 'list-invoices',
        path: '/',
        label: 'Invoices',
        icon: <UnorderedListOutlined />,
        component: InvoiceList,
      },
      {
        key: 'create-update-invoice',
        path: '/create-invoices',
        label: 'Create Invoice',
        icon: <PlusSquareOutlined />,
        component: InvoiceForm,
      },
    ]
  }
};

export default class ApplicationRouter extends Component<any, any> {

  render(): ReactNode {

    return (
      <Suspense fallback={<>Loading...</>}>
        <Routes>
          {Object.keys(menu).map((key: string) => {
            const { children: routes } = menu[key];
            
            return routes.map((route: any) => {
              if (route.component)
                return (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={<route.component />}
                  />
                );
            });
          })}

        </Routes>
      </Suspense>
    );
  }
}