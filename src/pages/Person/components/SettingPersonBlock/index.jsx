import React, { useState, useEffect } from 'react';
import { Box, ResponsiveGrid, Divider, Card, Avatar, Upload, Button, Form, Input, Message } from '@alifd/next';
import styles from './index.module.scss';

import { useHistory, request } from 'ice';

const { Cell } = ResponsiveGrid;
const FormItem = Form.Item;

const DEFAULT_DATA = {
  name: '阿里-Amy',
  phone: '15670880671',
  email: '2293832948@qq.com',
};

const SettingPersonBlock = (props) => {
  const history = useHistory();
  const DEFAULT_ON_SUBMIT = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }

    await request
      .post('/user/info/update', postData)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        history.push('/feedback/403');
      });

    console.log('values:', values);
    Message.success('更新成功');
  };

  const { dataSource = DEFAULT_DATA, onSubmit = DEFAULT_ON_SUBMIT } = props;
  const [postData, setValue] = useState(dataSource);
  const [buttonText, setButtonText] = useState('发送验证码');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(async () => {
    await request
      .get('/user/info')
      .then((res) => {
        console.log(res.data);
        setValue({
          userNickName: res.data.userNickName,
          phone: res.data.phone,
          email: res.data.email,
          userId: res.data.userId,
          userTrueName: res.data.userTrueName,
          area: res.data.area,
          lottery: res.data.lottery,
          position: res.data.position,
        });
      })
      .catch((e) => {
        console.log(e);
        history.push('/feedback/403');
      });
  }, []);

  const formChange = (values) => {
    setValue(values);
  };

  let coutDownTimer;
  let countDown = 60; // 获取验证码按钮点击示例

  const onValideCodeButtonClicked = () => {
    setButtonDisabled(true);
    countDown = 60;
    setButtonText(`${countDown}s`);
    coutDownTimer = setInterval(() => {
      if (--countDown <= 0) {
        if (coutDownTimer) clearInterval(coutDownTimer);
        setButtonText('获取验证码');
        setButtonDisabled(false);
        return;
      }

      setButtonText(`${countDown}s`);
    }, 1000);
  };

  return (
    <Card free>
      <Card.Content className={styles.SettingPersonBlock}>
        <Form value={postData} labelAlign="top" onChange={formChange} responsive>
          <FormItem label="" colSpan={12}>
            <ResponsiveGrid gap={10}>
              <Cell colSpan={2}>
                <Avatar shape="circle" size={64} icon="account" />
              </Cell>
              <Cell colSpan={10} className={styles.changeLogo}>
                <Box spacing={12}>
                  <FormItem>
                    <Upload
                      name="pic"
                      // eslint-disable-next-line @iceworks/best-practices/no-http-url
                      action="http://127.0.0.1:3000/users/upload"
                    >
                      <Button className={styles.uploadButton} type="normal">
                        更新头像
                      </Button>
                    </Upload>
                  </FormItem>
                  <Box>
                    <p>* 头像尽量上传超过 80px*80px, 但不要太大了。</p>
                    <p>* 请上传两倍图保证清晰度</p>
                  </Box>
                </Box>
              </Cell>
            </ResponsiveGrid>
          </FormItem>
          <FormItem colSpan={12}>
            <Divider />
          </FormItem>

          {/* <FormItem label="用户id" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="" name="userId" disabled />
          </FormItem> */}
          <FormItem label="昵称" required requiredMessage="必填" colSpan={12}>
            <Input placeholder="请输入昵称" name="userNickName" />
          </FormItem>

          <FormItem label="手机：" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入手机" disabled name="phone" />
          </FormItem>
          <FormItem label="邮件" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入邮件" disabled name="email" />
          </FormItem>
          <FormItem label="真实姓名" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入真实姓名" name="userTrueName" />
          </FormItem>
          <FormItem label="地区" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入地区" name="area" />
          </FormItem>
          <FormItem label="lottery" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入lottery" name="lottery" />
          </FormItem>
          <FormItem label="岗位" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="position" />
          </FormItem>

          <FormItem colSpan={12}>
            <Box spacing={8} direction="row">
              <Form.Submit type="primary" onClick={onSubmit} validate>
                更新信息
              </Form.Submit>
            </Box>
          </FormItem>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default SettingPersonBlock;
