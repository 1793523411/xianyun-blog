import React, { useState } from 'react';
import { Button, Form, Input, Message } from '@alifd/next';

import styles from './index.module.scss';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { fixedSpan: 3 },
  wrapperCol: { span: 30 },
};

export default function ChangePsd(props) {
  const [isSend, setIsSend] = useState(false);
  // const [oldpsd, setOldPsd] = useState('');
  // const [psd, setPsd] = useState('');
  const [second, setSecond] = useState(59);
  const handleSubmit = (values, errors) => {
    if (errors) {
      return;
    }
    //todo 校验+绑定邮箱，然后与父组件通信
    props.finish(values.email);
    console.log('Get form value:', values);
    Message.success('请前往邮箱确认');
  };

  const sendCode = (values, errors) => {
    setIsSend(true);
    if (errors) {
      return;
    }
    //todo 发送验证码
    setInterval(() => {
      setSecond(second - 1);
    }, 1000);
  };

  return (
    <>
      <Form style={{ width: 400 }} {...formItemLayout} labelTextAlign="left" size="medium" labelAlign="inset">
        <FormItem label="邮箱" format="email" required asterisk={false}>
          <Input
            name="email"
            trim
            innerAfter={
              <Form.Submit
                text
                type="primary"
                disabled={!!isSend}
                validate={['email']}
                onClick={sendCode}
                style={{ marginRight: 10 }}
              >
                {isSend ? `${second}秒后再试` : '获取验证码'}
              </Form.Submit>
            }
          />
        </FormItem>

        <FormItem label="验证码" required asterisk={false}>
          <Input name="code" trim defaultValue="" />
        </FormItem>
        <FormItem label="旧密码" required asterisk={false}>
          <Input name="oldpsd" trim defaultValue="" />
        </FormItem>
        <FormItem label="新密码" required asterisk={false}>
          <Input name="psd" trim defaultValue="" />
        </FormItem>

        <FormItem label=" ">
          <Form.Submit style={{ width: '100%' }} type="primary" validate onClick={handleSubmit}>
            绑定
          </Form.Submit>
        </FormItem>
      </Form>
    </>
  );
}
