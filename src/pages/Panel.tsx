import {Button, Input, message, Space, Table, Tag} from 'antd'
import { useEffect, useState } from 'react';
import axiosInstance from '../request/base';
import type { GetProps } from 'antd';
import {LeftOutlined} from '@ant-design/icons';

interface TagProps {
    close: boolean;
}


const Panel = () => {
    const [loadingState, setLoadingState] = useState({
        "page": true,
    });
    const setLoading = (key: string, value: boolean) => {
        setLoadingState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [pageTotal, setPageTotal] = useState(0);
    const [searchSph, setSearchSph] = useState("");
    const [dataSource, setDataSource] = useState([])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: "状态",
            dataIndex: 'close',
            key: 'close',
            render: (_:any, { close }:TagProps) => (
                <>
                    <Tag color={!close ? 'green' : 'red'}>
                        {!close ? "已登录" : "已离线"}
                    </Tag>
                </>
            ),
        },
        {
            title: "回复条数",
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: "备注",
            dataIndex: 'error',
            key: 'error',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                     <a onClick={()=>{
                        window.localStorage.setItem("aid", record.id); 
                        message.success("正在跳转")
                        setTimeout(()=>{
                            window.location.href = "./#/user"
                        }, 500)
                     }}>进入</a>
                     <a style={{color:"red"}} onClick={()=>delAccount(record.id)}>删除</a>
                </Space>
            ),
        },
    ];
    const getRunList = async () => {
        setDataSource([])
        setLoading("page", true);
        const startTime = Date.now();
        try {
            const response = await axiosInstance.post("/account/list", {
                page: current,
                perPage: pageSize,
                sph: searchSph,
            });
            if (response.data.status == 0) {
                setDataSource(response.data.data.rows)
                if (response.data.data.total) {
                    setPageTotal(response.data.data.total)
                }
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "获取失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log(error)
            message.error("发生错误，" + error.message)
        }
        const endTime = Date.now(); // 记录请求结束时间
        const elapsedTime = endTime - startTime; // 计算请求所花费的时间
        const delay = Math.max(0, 1000 - elapsedTime); // 如果请求时间小于1秒，则延迟剩余时间
        setTimeout(() => {
            setLoading("page", false);
        }, delay);
    }
    const delAccount = async (aid: number) => {
        setLoading("page", true);
        try {
            const response = await axiosInstance.post("/delAccount?aid="+aid);
            if (response.data.status == 0) {
                message.success("删除成功")
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "删除失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log(error)
            message.error("发生错误，" + error.message)
        }
        getRunList()
    }
    useEffect(()=>{
        getRunList()
    }, [current, pageSize, searchSph])

    type SearchProps = GetProps<typeof Input.Search>;
    const onSearch: SearchProps['onSearch'] = (value) => {
        setSearchSph(value)
    };
    const reset = () => {
        setSearchSph("")
        setCurrent(1)
        setPageSize(20)
    }
    return (
        <div className='flex-row justify-center'>
            <div style={{ width: "80%", maxWidth: "700px", marginTop: "60px" }}>
                <div className="flex-row justify-between">
                    <Space>
                        <h1 className="pageTitle">账号列表</h1>
                    </Space>
                    <Space>
                        <Button onClick={()=>history.back()} size='large' icon={<LeftOutlined />}>返回</Button>
                    </Space>
                </div>
                <div className='flex-row justify-between' style={{ marginBottom: "10px", marginTop: "45px" }}>
                    <Space>
                        <Input.Search placeholder="视频号" onSearch={onSearch} size='large' />
                        <Button onClick={reset} size='large'>重置</Button>
                    </Space>
                </div>
                <Table dataSource={dataSource} columns={columns} loading={loadingState.page} size='large' pagination={{
                    current,
                    pageSize,
                    total: pageTotal,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (page, pageSize) => {
                        setCurrent(page);
                        setPageSize(pageSize);
                    },
                }} />
            </div>
        </div>

    )
}

export default Panel;