import { Route, Routes } from 'react-router-dom';
import { Component, lazy, ReactNode, Suspense } from 'react';
import {
  DesktopOutlined,
  UnorderedListOutlined,
  PlusSquareOutlined
} from '@ant-design/icons';

const InvoiceList = lazy(() => import('./pages/InvoiceManagement/Components/Invoice'));
const InvoiceForm = lazy(() => import('./pages/InvoiceManagement/Components/InvoiceForm'));

export const menu: Record<any, any> = {
  InvoiceManagement: {
    label: 'Invoice Management',
    icon: <DesktopOutlined />,
    children: [
      {
        key: 'list-invoices',
        path: '/invoices',
        label: 'Invoices',
        icon: <UnorderedListOutlined />,
        component: InvoiceList,
      },
      {
        key: 'create-update-invoice',
        path: '/',
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