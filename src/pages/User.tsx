import { Button, Switch, message, InputNumber, Spin, Dropdown, Space, Table } from "antd";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import type { MenuProps } from 'antd';
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './User.css'; // 导入 CSS 文件
import axiosInstance from "../request/base";
import { DownOutlined, LogoutOutlined, CompassFilled, PlusOutlined } from '@ant-design/icons';
import AddMsg from "../components/AddMsg/AddMsg";


const items: MenuProps['items'] = [
    {
        label: '添加账号',
        key: 'addAccount',
        icon: <PlusOutlined />,
    },
    {
        label: '账号列表',
        key: 'toPanel',
        icon: <CompassFilled />,
    },
    {
        label: '退出登录',
        key: 'outlogin',
        icon: <LogoutOutlined />,
    }
];

const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    if (e.key == "outlogin") {
        localStorage.clear()
        message.success("退出成功")
        setTimeout(()=>{
            window.location.href = "./#/login"
        }, 500)
    } else if (e.key == 'toPanel') {
        message.success("正在跳转")
        setTimeout(()=>{
            window.location.href = "./#/panel"
        }, 500)
    } else if (e.key == "addAccount") {
        message.success("正在跳转")
        setTimeout(()=>{
            window.location.href = "./#/login"
        }, 500)
    }
};
const User = () => {
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const [loadingState, setLoadingState] = useState({
        "page": true,
        "save": false,
        "setServer": false,
        "addMsg": false,
    });
    const setLoading = (key: string, value: boolean) => {
        setLoadingState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const [userInfo, setUserInfo] = useState<FieldType>({
        nickName: "",
        switch: false,
        timeSleep: 5,
    });
    const [dataSource, setDataSource] = useState([])
    const [midState, setMidState] = useState(-1)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '文字消息',
            dataIndex: 'text',
            key: 'text',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                     <a onClick={()=>{
                        setMidState(record.id)
                        setIsModalOpen(true)
                     }}>编辑</a>
                     <a style={{color:"red"}} onClick={()=>delMsg(record.id)}>删除</a>
                </Space>
            ),
        },
    ];
    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    }
    const editSleep = async () => {
        setLoading("save", true);
        const startTime = Date.now();
        try {
            const response = await axiosInstance.post("/save?aid={aid}", userInfo);
            if (response.data.status == 0) {
                message.success("保存成功");
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "保存失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log(error)
            message.error("发生错误，" + error.message)
        }
        const endTime = Date.now(); // 记录请求结束时间
        const elapsedTime = endTime - startTime; // 计算请求所花费的时间
        const delay = Math.max(0, 1000 - elapsedTime); // 如果请求时间小于1秒，则延迟剩余时间
        setTimeout(() => {
            setLoading("save", false);
        }, delay);
    }
    type FieldType = {
        nickName?: string;
        switch?: boolean;
        timeSleep?: number;
    }
    const initInfo = async () => {
        try {
            const response = await axiosInstance.post("/info?aid={aid}");
            if (response.data.status == 0) {
                const data = response.data.data;
                setUserInfo({
                    nickName: data.info.nickname,
                    switch: data.info.switch,
                    timeSleep: data.info.timeSleep,
                })
                setDataSource(data.msgs)
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "资料获取失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log("error", error)
            message.error(error['message'])
        }
    }
    const checkCookie = async () => {
        try {
            const response = await axiosInstance.post("/checkCookie?aid={aid}");
            if (response.data.status == 0) {

            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "资料Cookie状态失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log("error", error)
            message.error(error['message'])
        }
    }
    const initWithLoading = async () => {
        setLoading("page", true);
        const startTime = Date.now();
        await initInfo()
        const endTime = Date.now(); // 记录请求结束时间
        const elapsedTime = endTime - startTime; // 计算请求所花费的时间
        const delay = Math.max(0, 1000 - elapsedTime); // 如果请求时间小于1秒，则延迟剩余时间
        setTimeout(() => {
            setLoading("page", false);
        }, delay);
    }
    const addMsg = async () => {
        setLoading("addMsg", true);
        const startTime = Date.now();
        try {
            const response = await axiosInstance.post("/addMsg?aid={aid}");
            if (response.data.status == 0) {
                message.success("添加成功")
                initInfo()
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "资料获取失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log("error", error)
            message.error(error['message'])
        }
        const endTime = Date.now(); // 记录请求结束时间
        const elapsedTime = endTime - startTime; // 计算请求所花费的时间
        const delay = Math.max(0, 1000 - elapsedTime); // 如果请求时间小于1秒，则延迟剩余时间
        setTimeout(() => {
            setLoading("addMsg", false);
        }, delay);
    }
    const setServer = async (status: boolean) => {
        setLoading("setServer", true);
        try {
            const response = await axiosInstance.post("/setServer?aid={aid}", {
                status,
            });
            if (response.data.status == 0) {
                message.success(response.data.msg)
                setUserInfo({
                    ...userInfo,
                    switch: status
                })
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "设置失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log(error)
            message.error("发生错误，" + error.message)
        }
        setLoading("setServer", false);
    }
    const delMsg = async (mid:number) => {
        try {
            const response = await axiosInstance.post("/delMsg?aid={aid}&mid="+mid);
            if (response.data.status == 0) {
                message.success("删除成功")
                initInfo()
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "删除失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log(error)
            message.error("发生错误，" + error.message)
        }
    }
    const toggleService = (checked: boolean) => {
        setServer(checked)
    };
    
    useEffect(() => {
        initWithLoading()
        checkCookie()
    }, [])
    useEffect(()=>{
        if (userInfo.nickName) {
            message.success("欢迎回来，"+userInfo.nickName)
        }
    }, [userInfo.nickName])
    const handleOk = () => {
        setIsModalOpen(false)
        initInfo()
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }
    return (
        <div className="flex-row justify-center">
            {
                isAuthenticated() ? <></> : <Navigate to="/login" />
            }
            <AddMsg mid={midState} open={isModalOpen} Ok={handleOk} Cancel={handleCancel} />
            <div className="mainWind">
                <Spin spinning={loadingState.page}>
                    <TransitionGroup>
                        {!loadingState.page && (
                            <CSSTransition
                                key="form"
                                classNames="fade"
                                timeout={300}
                            >
                                <div style={{color:"white"}}>
                                <div className="flex-row justify-between">
                                    <Space>
                                        <h1 className="pageTitle">个人中心</h1>
                                    </Space>
                                    <Dropdown menu={menuProps}>
                                        <Button style={{ fontWeight: "bold" }} size="large">
                                            <Space>
                                                {userInfo.nickName}
                                                <DownOutlined />
                                            </Space>
                                        </Button>
                                    </Dropdown>
                                </div>
                                
                                <div style={{marginTop: "45px"}} >
                                    <span className="form-title">打开/关闭服务</span>
                                    <div className="form-item">
                                        <Switch value={userInfo.switch} onChange={toggleService} loading={loadingState.setServer} />
                                    </div>

                                    <div style={{marginTop:"20px"}}>
                                        <span className="form-title">心跳间隔（单位：秒，建议5秒）</span>
                                        <div className="form-item">
                                            <Space.Compact>
                                                <InputNumber value={userInfo.timeSleep} onChange={(val)=>{
                                                    if (val != null) {
                                                        setUserInfo({
                                                            ...userInfo,
                                                            timeSleep: val,
                                                        })
                                                    }
                                                }} />
                                                <Button onClick={editSleep}>确认</Button>
                                            </Space.Compact>
                                        </div>
                                    </div>
                                    
                                    <div style={{marginTop:"20px"}}>
                                        <span className="form-title">自定义回复消息列表</span>
                                        <Button style={{marginLeft:"10px"}} icon={<PlusOutlined />} onClick={addMsg} loading={loadingState.addMsg}>新增消息</Button>
                                        <div className="form-item">
                                            <Table dataSource={dataSource} columns={columns} loading={loadingState.page} pagination={false} size='large' />
                                        </div>
                                    </div>
                                    
                                </div>
                                </div>
                            </CSSTransition>
                        )}
                    </TransitionGroup>
                </Spin>
            </div>
        </div>
    )
};

export default User;