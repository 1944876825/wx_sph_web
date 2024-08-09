import { Form, Button, Input, Switch, QRCode, message, Space } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from 'antd';
import axiosInstance from "../request/base";
import {LeftOutlined} from '@ant-design/icons';
const Login = () => {
    const [isLogin, setIsLogin] = useState(true)

    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [isChecked, setChecked] = useState(false);
    const [loadingState, setLoadingState] = useState({
        "login": false,
    });
    const [qrCodeStatus, setQrCodeStatus] = useState<"loading" | "active" | "expired" | "scanned" | undefined>('loading')
    const setLoading = (key: string, value: boolean) => {
        setLoadingState((prev) => ({
        ...prev,
        [key]: value,
        }));
    };
    const [loginUrl, setLoginUrl] = useState("")
    const onChange =  (checked: boolean) => {
      console.log(`switch to`, checked);
      if (!checked) {
        clearTimeout(timer)
      }
      setChecked(checked);
    };
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading('login', true);
        try {
            const response = await axiosInstance.post("/login", values);
            if (response.data.status == 0) {
                if (response.data.data.type == 'login') {
                    localStorage.setItem("token", response.data.data.token);
                    localStorage.setItem("aid", response.data.data.aid);
                    message.success("登录成功");
                } else {
                    localStorage.setItem("aid", response.data.data.aid);
                    message.success("添加成功");
                }
                setTimeout(()=>{
                    window.location.href = "./#/user"
                }, 500)
            } else {
                message.error(response.data.msg ?? "登录失败");
            }
        } catch (error:any) {
            console.log(error)
            message.error("发生错误，" + error.message)
        }
        setLoading('login', false);
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    type FieldType = {
        cookie?: string;
    };
    const getLoginCode = async () => {
        setQrCodeStatus('loading')
        try {
            const response = await axiosInstance.post("/getLoginUrl");
            if (response.data.status == 0) {
                setLoginUrl(response.data.data.url)
                checkLoginStatusWhile(response.data.data.token)
                setQrCodeStatus('active')
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "二维码获取失败，" + JSON.stringify(response.data))
            }
        } catch (error:any) {
            console.log("error", error)
            message.error(error['message'])
        }
    }
    const checkLoginStatusWhile = (code:string) => {
        setTimer(setTimeout(async () => {
            await checkLoginStatus(code)
        }, 1000));
    }
    const checkLoginStatus = async (code:string) => {
        try {
            const response = await axiosInstance.get("/loginStatus?token="+code);
            if (response.data && response.data.status == 0) {
                if (response.data.data && response.data.data['type']) {
                    if (response.data.data.type == 'login') {
                        localStorage.setItem("token", response.data.data.token);
                        localStorage.setItem("aid", response.data.data.aid)
                        message.success("登录成功");
                    } else {
                        localStorage.setItem("aid", response.data.data.aid);
                        message.success("添加成功");
                    }
                    setTimeout(()=>{
                        window.location.href = "./#/user"
                    }, 500)
                    return
                }
                if (response.data.data.status == 4) {
                    clearTimeout(timer)
                    message.error("二维码过期，请刷新")
                    setQrCodeStatus("expired")
                }
                if (response.data.data.status == 5) {
                    setQrCodeStatus("scanned")
                }
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "检测登录状态失败，" + JSON.stringify(response.data))
            }
        } catch (error:any) {
            console.log("error", error)
            message.error(error['message'])
        }
        checkLoginStatusWhile(code)
    }
    const onRefresh = () => {
        getLoginCode()
    }
    useEffect(() => {
        if (isChecked) {
            getLoginCode()
        }
        const token = window.localStorage.getItem("token")
        if (token) {
            setIsLogin(false)
        }
    }, [isChecked]);
    return (
        <div className="flex-row justify-center">
            <div className="mainWind">
                <div className='flex-row justify-between'>
                    <Space>
                        {
                            isLogin ? <h1 className="pageTitle">登录视频号</h1> : <h1 className="pageTitle">添加视频号</h1>
                        }
                    </Space>
                    <Space>
                        {
                            !isLogin ? (
                                <Button onClick={()=>window.location.href = "./#/user"} size='large' icon={<LeftOutlined />}>返回用户中心</Button>
                            ) : <p />
                        }
                    </Space>
                </div>
                <Form style={{marginTop: "45px"}} size="large" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <div className="flex-row items-center" style={{marginBottom:"10px"}}>
                        <span className="form-title">扫码</span>
                        <Switch style={{marginLeft:"10px"}} onChange={onChange} />
                    </div>
                    {
                        isChecked ? (
                            <>
                                <span className="form-title">二维码</span>
                                <Form.Item className="form-item">
                                    <QRCode value={loginUrl || '-'} status={qrCodeStatus} onRefresh={onRefresh} />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <span className="form-title">Cookie</span>
                                <Form.Item<FieldType> name="cookie" className="form-item">
                                    <Input.TextArea rows={4} placeholder="请输入Cookie" />
                                </Form.Item>
                                <Form.Item className="flex-row justify-center">
                                    <Button type="primary" htmlType="submit" style={{ width: "80px" }} loading={loadingState.login}>
                                        登录
                                    </Button>
                                </Form.Item>
                            </>
                        ) 
                    }
                </Form>
            </div>
        </div>
    )
};

export default Login;