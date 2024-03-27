import React, {useState} from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    SearchOutlined,
    SettingOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Flex, Avatar, Badge } from 'antd';
import logo from '../assets/logo-white.png'
import logosm from '../assets/logo-light-sm.png'
import { Link, useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';

const InstructorLayout = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const items = []

    const navigate = useNavigate()
    return (
        <Layout hasSider>
            <Sider
                width={250}
                trigger={null} collapsible collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    padding: 12
                }}
            >
                <div className="demo-logo-vertical mb-8">
                    <Link to={"/"} className="block m-auto">
                        {
                            collapsed ?
                                <img src={logosm} alt="logo" className='block m-auto w-[36px] h-[36px] object-contain'/>
                                :
                                <img src={logo} alt="logo" className='block m-auto w-[135px] h-[36px] object-contain'/>
                        }
                    </Link>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}
                      items={items}
                      onClick={(e) => navigate(e.key)}
                />
            </Sider>
            <Layout
                style={{
                    marginLeft: (collapsed ? 80 : 250),
                }}
            >
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Flex align='center' justify='space-between' className='pr-4'>
                        <Flex align='center' gap={12}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '24px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <Search placeholder="input search text" style={{width: 300}}/>
                        </Flex>
                        <Flex>
                            <Avatar shape='circle' size={36}
                                    src='https://codescandy.com/geeks-bootstrap-5/assets/images/avatar/avatar-1.jpg'/>
                        </Flex>
                    </Flex>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            // textAlign: 'center',
                            // background: colorBgContainer,
                            // borderRadius: borderRadiusLG,
                        }}
                        className='min-h-screen'
                    >
                        {children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    )
}

export default InstructorLayout