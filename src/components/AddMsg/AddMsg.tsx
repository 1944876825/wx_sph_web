import { Form, FormProps, Input, message, Modal, Switch } from "antd";
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
                    useAI: data.useAI || false,
                    systemPrompt: data.systemPrompt || '',
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
        useAI?: boolean;
        systemPrompt?: string;
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
                    <Form.Item label="AI 智能回复" name="useAI" valuePropName="checked">
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.useAI !== cur.useAI}>
                        {({ getFieldValue }) =>
                            getFieldValue("useAI") ? (
                                <Form.Item
                                    label="系统提示词"
                                    name="systemPrompt"
                                    tooltip="自定义 AI 回复的角色和风格，留空则使用全局默认提示词"
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="例如：你是一个专业的美妆顾问，用亲切的语气回复..."
                                    />
                                </Form.Item>
                            ) : null
                        }
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