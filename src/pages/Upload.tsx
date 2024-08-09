import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload, Image, Spin } from 'antd';
import axiosInstance from '../request/base';

const token = localStorage.getItem("token");
const aid = localStorage.getItem("aid");

const UploadComponent = (props: { mid: number }) => {
  const {mid} = props
  const [loadingState, setLoadingState] = useState(false)
  const [imgMsg, setImgMsg] = useState("")

  const uploadProps: UploadProps = {
    name: 'file',
    action: './upload?aid='+aid+'&mid='+mid,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        getImg()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };
  const getImg = async () => {
    setLoadingState(true)
    try {
        const response = await axiosInstance.post("/img?aid={aid}&mid="+mid);
        if (response.data.status == 0) {
            setImgMsg(response.data.data.img)
        } else {
            console.log(response.data)
            message.error(response.data.msg ?? "图片获取失败，" + JSON.stringify(response.data))
        }
    } catch (error: any) {
        console.log("error", error)
        message.error(error['message'])
    }
    setLoadingState(false)
  }
  useEffect(()=>{
    if (mid != -1) {
      getImg()
    }
  }, [mid])
  return (
    <>
      <Spin spinning={loadingState}>
        {
          imgMsg ? (
            <>
              <Image
                width={200}
                src={imgMsg} />
              <Button style={{ marginLeft: "10px" }} onClick={() => setImgMsg("")} danger>删除</Button>
            </>
          ) : (
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          )
        }
      </Spin>
    </>
  )
};

export default UploadComponent;