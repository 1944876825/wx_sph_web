import { Form, FormProps, Input, message, Modal } from "antd";
import UploadComponent from "../../pages/Upload";
import { useEffect, useState } from "react";
import axiosInstance from "../../request/base";

const AddMsg = (props: { mid: number; open: boolean; Ok: VoidFunction; Cancel: VoidFunction }) => {
    const {mid, open, Ok, Cancel } = props
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const init = async () => {
        try {
            const response = await axiosInstance.post("/msgInfo?aid={aid}&mid="+mid);
            if (response.data.status == 0) {
                const data = response.data.data.msg;
                form.setFieldsValue({
                    title: data.title,
                    text: data.text,
                });
            } else {
                console.log(response.data)
                message.error(response.data.msg ?? "资料获取失败，" + JSON.stringify(response.data))
            }
        } catch (error: any) {
            console.log("error", error)
            message.error(error['message'])
        }
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const response = await axiosInstance.post("/saveMsg?aid={aid}&mid="+mid, values);
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
        Ok()
    }
    useEffect(()=>{
        if (mid != -1) {
            init()
        }
        setIsModalOpen(open)
    }, [mid, open])
    type FieldType = {
        title?: string;
        text?: string;
    }
    
    const handleOk = () => {
        form.submit()
    };

    const handleCancel = () => {
        Cancel()
    };

    return (
        <>
            <Modal title="编辑消息" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item<FieldType> name="title" label="标题" className="form-item">
                        <Input placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item<FieldType> name="text" label="文字消息" className="form-item">
                        <Input.TextArea rows={2} placeholder="请输入自动回复的文字内容" />
                    </Form.Item>
                    <Form.Item label="图片消息">
                        <UploadComponent mid={mid} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default AddMsg;