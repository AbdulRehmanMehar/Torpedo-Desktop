import { Component, lazy, LazyExoticComponent, ReactNode, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const CreateInvoice = lazy(() => import('./pages/InvoiceManagement/CreateInvoice'));

interface AppRoute {
  key: string;
  path: string;
  component: LazyExoticComponent<typeof Component>;
}

export const routes: AppRoute[] = [
  {
    key: 'create-invoice',
    path: '/',
    component: CreateInvoice,
  },
]

export default class ApplicationRouter extends Component<any, any> {

  render(): ReactNode {
    return (
      <BrowserRouter>
        <Suspense fallback={<>Loading...</>}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                element={<route.component />}
              />
              ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }
}