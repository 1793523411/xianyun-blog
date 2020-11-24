import React, { useState, useEffect } from 'react';
import { Input, Message, Form, Divider, Checkbox, Icon } from '@alifd/next';
import { useInterval } from './utils';
import styles from './index.module.scss';
import { useHistory, Link, request } from 'ice';

const { Item } = Form;
const DEFAULT_DATA = {
  name: '',
  // eslint-disable-next-line @iceworks/best-practices/no-secret-info
  password: '',
  autoLogin: true,
  phone: '',
  code: '',
};

const LoginBlock = (
  props = {
    dataSource: DEFAULT_DATA,
  },
) => {
  const { dataSource = DEFAULT_DATA } = props;
  const [postData, setValue] = useState(dataSource);
  const [isRunning, checkRunning] = useState(false);
  const [isPhone, checkPhone] = useState(false);
  const [second, setSecond] = useState(59);

  useEffect(() => {
    // // location.reload();
    // if (location.href.indexOf('#reloaded') == -1) {
    //   location.href = location.href + '#reloaded';
    //   location.reload();
    // }
  }, [1]);

  const history = useHistory();
  useInterval(
    () => {
      setSecond(second - 1);

      if (second <= 0) {
        checkRunning(false);
        setSecond(59);
      }
    },
    isRunning ? 1000 : null,
  );

  const formChange = (values) => {
    setValue(values);
  };

  const sendCode = (values, errors) => {
    console.log(values);
    if (errors) {
      return;
    } // get values.phone
    const data = {
      mobile: values.phone,
      model: '登录',
      type: 1,
    };
    request.post('/register/sms', data).then((res) => {
      console.log(res);
    });
    checkRunning(true);
  };

  const handleSubmit = async (values, errors) => {
    console.log('values:', values);
    if (errors) {
      console.log('errors', errors);
      return;
    }

    if (values.phone) {
      const data = {
        mobile: values.phone,
        code: values.code,
        type: 2,
      };

      await request.post('/login', data).then((res) => {
        console.log(res);
        if (res.data.success === true) {
          Message.success(`登陆成功,token为${res.data.token}`);
          window.sessionStorage.setItem('token', res.data.token);
          history.push('/');
          return;
        } else {
          Message.success('验证码错误');
          return;
        }
      });
      return;
    }

    const phone = /^[1][3,4,5,7,8][0-9]{9}$/;

    // eslint-disable-next-line no-useless-escape
    const email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

    if (phone.test(values.name)) {
      Message.success('手机号登录');
      const data = {
        mobile: values.name,
        // eslint-disable-next-line @iceworks/best-practices/no-secret-info
        password: values.password,
        loginType: 1,
      };
      await request.post('/login', data).then((res) => {
        console.log(res);
        if (res.data.success === true) {
          Message.success(`登陆成功,token为${res.data.token}`);
          window.sessionStorage.setItem('token', res.data.token);
          history.push('/');
        } else {
          Message.success('用户名或密码错误');
        }
      });
    } else if (email.test(values.name)) {
      // Message.success('邮箱登录');
      const data = {
        email: values.name,
        // eslint-disable-next-line @iceworks/best-practices/no-secret-info
        password: values.password,
        loginType: 3,
      };
      await request.post('/login', data).then((res) => {
        console.log(res);
        if (res.data.success === true) {
          Message.success(`登陆成功,token为${res.data.token}`);
          window.sessionStorage.setItem('token', res.data.token);
          history.push('/');
        } else {
          Message.success(`${res.msg}`);
        }
      });
    } else {
      Message.success('用户名登录');

      const data = {
        userName: values.name,
        // eslint-disable-next-line @iceworks/best-practices/no-secret-info
        password: values.password,
        loginType: 0,
      };
      await request.post('/login', data).then((res) => {
        console.log(res);
        if (res.data.success === true) {
          Message.success(`登陆成功,token为${res.data.token}`);
          window.sessionStorage.setItem('token', res.data.token);
          history.push('/');
        } else {
          Message.success(`${res.msg}`);
        }
      });
    }

    // Message.success('登录成功');
  };

  const phoneForm = (
    <>
      <Item format="tel" required requiredMessage="必填" asterisk={false}>
        <Input
          name="phone"
          innerBefore={
            <span className={styles.innerBeforeInput}>
              +86
              <span className={styles.line} />
            </span>
          }
          maxLength={20}
          placeholder="手机号"
        />
      </Item>
      <Item
        required
        requiredMessage="必填"
        style={{
          marginBottom: 0,
        }}
      >
        <Input
          name="code"
          innerAfter={
            <span className={styles.innerAfterInput}>
              <span className={styles.line} />
              <Form.Submit
                text
                type="primary"
                style={{
                  width: 64,
                }}
                disabled={!!isRunning}
                validate={['phone']}
                onClick={sendCode}
                className={styles.sendCode}
              >
                {isRunning ? `${second}秒后再试` : '获取验证码'}
              </Form.Submit>
            </span>
          }
          maxLength={20}
          placeholder="验证码"
        />
      </Item>
    </>
  );
  const accountForm = (
    <>
      <Item required requiredMessage="必填">
        <Input name="name" maxLength={50} placeholder="用户名/手机号/邮箱" />
      </Item>
      <Item
        required
        requiredMessage="必填"
        style={{
          marginBottom: 0,
        }}
      >
        <Input.Password name="password" htmlType="password" placeholder="密码" />
      </Item>
    </>
  );

  const byAccount = () => {
    checkPhone(false);
  };

  const byForm = () => {
    checkPhone(true);
  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <div className={styles.desc}>
          <span onClick={byAccount} className={isPhone ? undefined : styles.active}>
            账户密码登录
          </span>
          <Divider direction="ver" />
          <span onClick={byForm} className={isPhone ? styles.active : undefined}>
            手机号登录
          </span>
        </div>

        <Form value={postData} onChange={formChange} size="large">
          {isPhone ? phoneForm : accountForm}

          <br />

          <Item
            style={{
              marginBottom: 10,
            }}
          >
            <Form.Submit type="primary" onClick={handleSubmit} className={styles.submitBtn} validate>
              登录
            </Form.Submit>
          </Item>
          <div className={styles.infoLine}>
            <Link
              to={{
                pathname: '/user/register',
                state: { fromDashboard: true },
              }}
            >
              <p className={styles.link}>注册账号</p>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginBlock;
