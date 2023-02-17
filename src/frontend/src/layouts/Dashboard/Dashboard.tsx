import { menu } from '../../AppRoutes';
import React, { Component } from 'react';
import messages from '../../config/messages';
import { Breadcrumb, Layout, Menu, Spin, Typography } from 'antd';
import { NavigationProps } from '../../hoc/Navigation';
import { EditOutlined, HomeOutlined } from '@ant-design/icons';
import { REACT_APP_NAME } from '../../config/constants';
import 'react-toastify/dist/ReactToastify.css';
import { AuthenticationStore } from '../../pages/Authentication/Store/Reducers';
import { toast } from 'react-toastify';
import { validate as uuidValidate } from 'uuid';
import {parse, stringify as JsonStringify, toJSON, fromJSON} from 'flatted';



const { Content, Footer, Sider } = Layout;

interface DashboardProps {
  navigationProps: NavigationProps;
  authentication: AuthenticationStore;
  logout: Function;
  getSuggestions: Function;
  children: JSX.Element|JSX.Element[];
}

interface DashboardState {
  isLoading: boolean;
  isSidebarCollapsed: boolean;
}

export default class Dashboard extends Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      isLoading: false,
      isSidebarCollapsed: false,
    }
  }

  componentDidMount(): void {
    const { getSuggestions } = this.props;
    this.setState({ isLoading: true });
    getSuggestions({
      onComplete: () => this.setState({ isLoading: false })
    });
  }

  render(): React.ReactNode {
    const { isSidebarCollapsed, isLoading } = this.state;
    const { children, navigationProps, authentication, logout } = this.props;
    const routerMenu = Object.keys(menu).map(key => menu[key]);
    const flattenRoutes = routerMenu.map(menuItem => menuItem.children).flat(Infinity);
    const { navigate, location } = navigationProps;

    const currentPath = flattenRoutes.find((route: any) => {
      let comparable1 = route.path;
      let comparable2 = location.pathname;
      let lastUrlChunk = undefined;
      if (route.path.includes(':')) {
        const array1 = comparable1.split('/');
        const array2 = comparable2.split('/');
        array1.pop();
        lastUrlChunk = array2.pop();
        comparable1 = array1.join('');
        comparable2 = array2.join('');
      }
      
      if (comparable1 === comparable2) {
        route.isupdate = false;
        if (uuidValidate(lastUrlChunk || '')) {
          route.isupdate = true;
          console.log('for update');
          
        } 
        return true;
      }
      return false;
    });
    const parentSection = routerMenu.find(menuItem => {
      const childs = JsonStringify(menuItem.children);
      let compareable = location.pathname;
      const arrayOfPathChunks = location.pathname.split('/');
      const lastElement = (arrayOfPathChunks.pop() || '');
      
      if (uuidValidate(lastElement)) {
        compareable = arrayOfPathChunks.join('');
      }

      return childs.includes(compareable)
    });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={250}
        collapsible 
        collapsed={isSidebarCollapsed} 
        onCollapse={isSidebarCollapsed => this.setState({ isSidebarCollapsed })}>

          {!isSidebarCollapsed && 
          <div style={{ margin: '25px' }}>
              
              <Typography.Title 
                type='warning' 
                level={2} style={{margin: '0px', padding: '0px', marginBottom: '20px', position: 'relative'}}>
                { REACT_APP_NAME }
                <Typography.Text 
                  style={{color: '#ccc', fontWeight: 'lighter', fontSize: '12px', position: 'absolute', left: '100px', }}>
                    <b>{ authentication.tenant?.name } </b>
                </Typography.Text>
              </Typography.Title>
              <Typography.Text style={{ color: '#ccc', fontSize: '12px' }}>
                { authentication.user?.name } -&nbsp;
                <a href='#' onClick={(event) => {
                  event.preventDefault();
                  logout();
                  toast.info('Logged out successfully!');
                  navigate('/');
                }}>Logout</a>
              </Typography.Text><br />
              <Typography.Text style={{ color: '#ccc', fontSize: '12px' }}>
                { authentication.user?.email }
              </Typography.Text>
              
            </div>
          }

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
        {isLoading ? (
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spin size='large' />
          </div>
        ) : (
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>
                <HomeOutlined /> { REACT_APP_NAME }
              </Breadcrumb.Item>
              {parentSection &&  (
                <Breadcrumb.Item>
                  { parentSection.icon } { parentSection.label }
                </Breadcrumb.Item>
              )}
              {currentPath && (
                <Breadcrumb.Item>
                  { currentPath.isupdate ? (
                    <>
                      <EditOutlined />&nbsp;
                      {currentPath.label.replace('Create', 'Update')} 
                    </>
                  ) :  (
                    <>
                      { currentPath.icon } { currentPath.label }
                    </>
                  )}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
            { children }
          </Content>
        )}
        <Footer style={{ textAlign: 'center' }}>
          <span>{messages.FOOTER}&nbsp;</span>
          <span>Developed with&nbsp;</span> 
          <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
            <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
          </svg>
          <span>&nbsp;by <b><a href='https://abdurehman.me'>Abdul Rehman</a></b></span>
        </Footer>
      </Layout>
    </Layout>
  );
  }
}
