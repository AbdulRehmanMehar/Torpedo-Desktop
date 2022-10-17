import { menu } from '../../AppRoutes';
import React, { Component } from 'react';
import messages from '../../config/messages';
import { Breadcrumb, Layout, Menu } from 'antd';
import { NavigationProps } from '../../hoc/Navigation';

const { Content, Footer, Sider } = Layout;

interface DashboardProps {
  navigationProps: NavigationProps;
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
    const { navigate, location } = navigationProps;

    const currentPath = location.pathname;
    const labelOfCurrentPath = flattenRoutes.find((route: any) => route.path === currentPath).label;
    const labelOfParentSection = routerMenu.find(menuItem => JSON.stringify(menuItem.children).includes(currentPath)).label;

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
            <Breadcrumb.Item>{labelOfParentSection}</Breadcrumb.Item>
            <Breadcrumb.Item>{labelOfCurrentPath}</Breadcrumb.Item>
          </Breadcrumb>
          { children }
        </Content>
        <Footer style={{ textAlign: 'center' }}>{messages.FOOTER}</Footer>
      </Layout>
    </Layout>
  );
  }
}
