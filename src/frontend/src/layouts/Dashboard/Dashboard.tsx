import React, { Component, Suspense } from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { menu } from '../../AppRoutes';
import messages from '../../config/messages';

const { Content, Footer, Sider } = Layout;

interface DashboardProps {
  navigationProps: any;
  children: JSX.Element|JSX.Element[];
}

interface DashboardState {
  isSidebarCollapsed: boolean;
}

export default class Dashboard extends Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      isSidebarCollapsed: false,
    }
  }

  render(): React.ReactNode {
    const { children, navigationProps } = this.props;
    const { isSidebarCollapsed } = this.state;
    const routerMenu = Object.keys(menu).map(key => menu[key]);
    const flattenRoutes = routerMenu.map(menuItem => menuItem.children).flat(Infinity);
    const { navigate } = navigationProps;


    return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={250}
        collapsible 
        collapsed={isSidebarCollapsed} 
        onCollapse={isSidebarCollapsed => this.setState({ isSidebarCollapsed })}>

          <div className="logo" />
          <Menu 
            theme="dark" 
            mode="inline" 
            defaultSelectedKeys={['1']} 
            items={routerMenu}
            onSelect={(info) => {
              const currentRoute = flattenRoutes
                .find(route => route.key === info.key);
              
              navigate(currentRoute.path);
            }} />

      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          { children }
        </Content>
        <Footer style={{ textAlign: 'center' }}>{messages.FOOTER}</Footer>
      </Layout>
    </Layout>
  );
  }
}
