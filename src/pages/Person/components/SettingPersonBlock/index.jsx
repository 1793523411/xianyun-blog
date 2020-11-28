import React, { useState, useEffect } from 'react';
import {
  Box,
  ResponsiveGrid,
  Divider,
  Card,
  Avatar,
  Upload,
  Button,
  Form,
  Input,
  Message,
  DatePicker,
  Select,
  Dialog,
} from '@alifd/next';
import styles from './index.module.scss';

import store from '@/store';

import { useHistory, request } from 'ice';
import EmailCode from './EmailCode';
import ChangePsd from './ChangePsd';

const { Cell } = ResponsiveGrid;
const FormItem = Form.Item;

const DEFAULT_DATA = {
  name: '阿里-Amy',
  phone: '15670880671',
  email: '2293832948@qq.com',
};

const SettingPersonBlock = (props) => {
  const history = useHistory();
  const [userState, userDispatchers] = store.useModel('user');

  const DEFAULT_ON_SUBMIT = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }

    await request
      .post('/user/info/update', postData)
      .then((res) => {
        console.log(res);
        // location.reload();
      })
      .catch((e) => {
        console.log(e);
        history.push('/user/login');
      });

    console.log('values:', values);
    userDispatchers.fetchUserProfile();
    Message.success('更新成功');
  };

  const { dataSource = DEFAULT_DATA, onSubmit = DEFAULT_ON_SUBMIT } = props;
  const [postData, setValue] = useState(dataSource);
  const [buttonText, setButtonText] = useState('发送验证码');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [selectValueindustry, setSelectValueindustry] = useState('');

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);


  useEffect(() => {
    request
      .get('/user/info')
      .then((res) => {
        console.log(res.data);
        setValue({
          userNickName: res.data.userNickName,
          userName: res.data.userName,
          phone: res.data.phone,
          email: res.data.email,
          userId: res.data.userId,
          userTrueName: res.data.userTrueName,
          area: res.data.area,
          lottery: res.data.lottery,
          position: res.data.position,
          avatar: res.data.avatar,
          education: res.data.education,
          company: res.data.company,
          startWorkTime: res.data.startWorkTime,
          industry: res.data.industry,
          password: res.data.password,
          birthday: res.data.birthday,
          // password: res.data.password,
        });
        setSelectValue(res.data.education);
        setSelectValueindustry(res.data.industry);
      })
      .catch((e) => {
        console.log(e);
        history.push('/user/login');
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

  const onSuccess = async (info) => {
    await request
      .post('/user/info/update', { avatar: info.response.url })
      .then((res) => {
        setValue({
          avatar: info.response.url,
        });
        // location.reload();
        userDispatchers.fetchUserProfile();
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        history.push('/user/login');
      });
    console.log(info);
  };

  const Option = Select.Option;

  const onChange = function (value) {
    console.log(value);
    setValue({ education: value });
  };
  const onBlur = function (e) {
    console.log(/onblur/, e);
  };

  const onToggleHighlightItem = function (item, type) {
    console.log(item, type);
    setSelectValue(postData.education);
  };
  const onChangeindustry = function (value) {
    console.log(value);
    setValue({ industry: value });
  };
  const onBlurindustry = function (e) {
    console.log(/onblur/, e);
  };

  const onToggleHighlightItemindustry = function (item, type) {
    console.log(item, type);
    setSelectValueindustry(postData.industry);
  };

  const onOpen = () => {
    console.log(visible);
    setVisible(true);
  };

  const onClose = (reason) => {
    console.log(reason);

    setVisible(false);
    setVisible2(false);
  };

  const finish = (email) => {
    setValue({
      email,
    });
  };

  const changepsd = () => {
    setVisible2(true);
  };

  return (
    <Card free>
      <Card.Content className={styles.SettingPersonBlock}>
        <Form value={postData} labelAlign="top" onChange={formChange} responsive>
          <FormItem label="" colSpan={12}>
            <ResponsiveGrid gap={10}>
              <Cell colSpan={2}>
                <Avatar shape="circle" size={64} src={postData.avatar} icon="account" />
              </Cell>
              <Cell colSpan={10} className={styles.changeLogo}>
                <Box spacing={12}>
                  <FormItem>
                    <Upload
                      name="pic"
                      // eslint-disable-next-line @iceworks/best-practices/no-http-url
                      // action="http://127.0.0.1:5005/users/upload"
                      action="http://ice-blog-server.ygjie.icu/users/upload"
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                      onSuccess={onSuccess}
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
          <FormItem label="昵称" colSpan={12}>
            <Input placeholder="请输入昵称" name="userNickName" />
          </FormItem>
          <FormItem label="用户名(用于登录)" colSpan={12}>
            <Input placeholder="请输入用户名" name="userName" />
          </FormItem>

          <FormItem label="手机：" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入手机" disabled name="phone" />
          </FormItem>
          <FormItem label="邮件" colSpan={12}>
            {/* {postData.email ? (
              <Input className={styles.validateCodeInput} placeholder="请输入邮件" disabled name="email" />
            ) : (
              <Button type="normal" onClick={onOpen}>
                绑定邮箱
              </Button>
            )} */}
            <Box spacing={5} direction="row">
              <Input
                className={styles.validateCodeInput}
                placeholder="请输入邮件"
                disabled
                name="email"
                value={postData.email}
              />{' '}
              {postData.email ? (
                <Button type="normal" onClick={onOpen}>
                  修改邮箱
                </Button>
              ) : (
                <Button type="normal" onClick={onOpen}>
                  绑定邮箱
                </Button>
              )}
            </Box>

            <Dialog
              title="绑定邮箱"
              visible={visible}
              footer={false}
              onOk={onClose}
              onCancel={onClose}
              onClose={onClose}
            >
              <EmailCode finish={finish} />
            </Dialog>
          </FormItem>
          <FormItem label="真实姓名" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入真实姓名" name="userTrueName" />
          </FormItem>
          <FormItem label="位置" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入地区" name="area" />
          </FormItem>
          <FormItem label="个签" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入lottery" name="lottery" />
          </FormItem>
          <FormItem label="职位" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="position" />
          </FormItem>
          <FormItem label="生日" colSpan={12}>
            {/* <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="birthday" /> */}
            <FormItem style={{ marginRight: 10, marginBottom: 0 }}>
              <DatePicker name="birthday" className={styles.dataWidth} />
            </FormItem>
          </FormItem>
          {/* <FormItem label="密码" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="password" />
          </FormItem> */}
          <FormItem label="行业" colSpan={12}>
            {/* <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="industry" /> */}
            {!selectValueindustry && (
              <Select
                id="basic-demo"
                onChange={onChangeindustry}
                onBlur={onBlurindustry}
                onToggleHighlightItem={onToggleHighlightItemindustry}
                defaultValue={selectValueindustry}
                aria-label="行业是"
                showSearch
                hasClear
                className={styles.validateCodeInput}
              >
                <Option value="IT">IT</Option>
                <Option value="金融">金融</Option>
                <Option value="商业">商业</Option>
                <Option value="专科生">文化</Option>
                <Option value="文化">艺术</Option>
                <Option value="法律">法律</Option>
                <Option value="教育">教育</Option>
                <Option value="学生">学生</Option>
                <Option value="其他">其他</Option>
              </Select>
            )}
            {selectValueindustry && (
              <Select
                id="basic-demo"
                onChange={onChangeindustry}
                onBlur={onBlurindustry}
                onToggleHighlightItem={onToggleHighlightItemindustry}
                defaultValue={selectValueindustry}
                aria-label="行业是"
                showSearch
                hasClear
                className={styles.validateCodeInput}
              >
                <Option value="IT">IT</Option>
                <Option value="金融">金融</Option>
                <Option value="商业">商业</Option>
                <Option value="专科生">文化</Option>
                <Option value="文化">艺术</Option>
                <Option value="法律">法律</Option>
                <Option value="教育">教育</Option>
                <Option value="学生">学生</Option>
                <Option value="其他">其他</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="开始工作时间" colSpan={12}>
            {/* <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="startWorkTime" /> */}
            <FormItem style={{ marginRight: 10, marginBottom: 0 }}>
              <DatePicker name="startWorkTime" className={styles.dataWidth} />
            </FormItem>
          </FormItem>
          <FormItem label="公司" colSpan={12}>
            <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="company" />
          </FormItem>
          <FormItem label="学历" colSpan={12}>
            {/* <Input className={styles.validateCodeInput} placeholder="请输入岗位" name="education" /> */}
            {selectValue && (
              <Select
                id="basic-demo"
                onChange={onChange}
                onBlur={onBlur}
                onToggleHighlightItem={onToggleHighlightItem}
                defaultValue={selectValue}
                aria-label="学历是"
                showSearch
                hasClear
                className={styles.validateCodeInput}
              >
                <Option value="博士生">博士生</Option>
                <Option value="研究生">研究生</Option>
                <Option value="本科生">本科生</Option>
                <Option value="专科生">专科生</Option>
                <Option value="其他">其他</Option>
                <Option value="其他">其他</Option>
              </Select>
            )}
            {!selectValue && (
              <Select
                id="basic-demo"
                onChange={onChange}
                onBlur={onBlur}
                onToggleHighlightItem={onToggleHighlightItem}
                defaultValue={selectValue}
                aria-label="学历是"
                showSearch
                hasClear
                className={styles.validateCodeInput}
              >
                <Option value="博士生">博士生</Option>
                <Option value="研究生">研究生</Option>
                <Option value="本科生">本科生</Option>
                <Option value="专科生">专科生</Option>
                <Option value="其他">其他</Option>
                <Option value="其他">其他</Option>
              </Select>
            )}
          </FormItem>

          <FormItem colSpan={12}>
            <Box spacing={8} direction="row">
              <Form.Submit type="primary" onClick={onSubmit} validate>
                更新信息
              </Form.Submit>
              <Form.Submit type="primary" warning onClick={changepsd} validate>
                修改密码
              </Form.Submit>
              <Dialog
                title="修改密码"
                visible={visible2}
                footer={false}
                onOk={onClose}
                onCancel={onClose}
                onClose={onClose}
              >
                <ChangePsd finish={finish} />
              </Dialog>
            </Box>
          </FormItem>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default SettingPersonBlock;
