/* eslint-disable @iceworks/best-practices/no-secret-info */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Message, Form, Divider } from '@alifd/next';
import { useInterval } from './utils';
import styles from './index.module.scss';

import { useHistory,Link, request } from 'ice';

const { Item } = Form;
export default function RegisterBlock() {
  const [postData, setValue] = useState({
    // email: '',
    password: '',
    rePassword: '',
    phone: '',
    code: '',
  });
  const [isRunning, checkRunning] = useState(false);
  const [second, setSecond] = useState(59);

  const [isPhone, setIsPhone] = useState(false);
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

  const formChange = (value) => {
    setValue(value);
  };

  const sendCode = (values, errors) => {
    Message.success('验证码已发送');
    if (errors) {
      return;
    } // get values.phone

    if (values.mobile) {
      Message.success('电话注册');
      const data = {
        mobile: values.mobile,
        model: '注册',
        type: 1,
      };
      request.post('/register/sms', data).then((res) => {
        console.log(res);
      });
    } else {
      const data = {
        email: values.email,
        model: '注册',
        type: 1,
      };

      request.post('/register/smtp', data).then((res) => {
        console.log(res);
      });
    }

    console.log(values);
    checkRunning(true);
  };

  const checkPass = (rule, values, callback) => {
    if (values && values !== postData.password) {
      return callback('密码不一致');
    } else {
      return callback();
    }
  };

  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log(values);
    if (values.phone) {
      Message.success('电话注册');
      const data = {
        mobile: values.mobile,
        model: '注册',
        code: values.code,
        type: 1,
      };

      await request.post('/register/sms/check', data).then((res) => {
        console.log(res);
        if (res.data === 100) {
          const data2 = {
            mobile: values.mobile,
            password: values.password,
          };
          request.post('/register', data2).then((res2) => {
            console.log(res2);
            Message.success('注册成功，请登录');
            history.push('/user');
          });
        } else {
          Message.success(`${res.defaultMessage}`);
        }
      });
    } else {
      const data = {
        email: values.email,
        model: '注册',
        code: values.code,
        type: 1,
      };

      await request.post('/register/smtp/check', data).then((res) => {
        console.log(res);
        if (res.data === 100) {
          const data2 = {
            email: values.email,
            password: values.password,
          };
          request.post('/register', data2).then((res2) => {
            console.log(res2);
            Message.success('注册成功，请登录');
            history.push('/user');
          });
        } else {
          Message.success(`${res.defaultMessage}`);
        }
      });
    }

    console.log('values:', values);
    // Message.success('注册成功');
  };

  const email = (
    <>
      <Item format="email" required requiredMessage="必填">
        <Input name="email" size="large" maxLength={50} placeholder="邮箱" />
      </Item>
      <Item required requiredMessage="必填">
        <Input
          name="code"
          size="large"
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

  const phone = (
    <>
      <Item format="tel" required requiredMessage="必填" asterisk={false}>
        <Input
          name="mobile"
          size="large"
          // innerBefore={
          //   // <span className={styles.innerBeforeInput}>
          //   //   +86
          //   //   <span className={styles.line} />
          //   // </span>
          // }
          // maxLength={20}
          placeholder="手机号"
        />
      </Item>
      <Item required requiredMessage="必填">
        <Input
          name="code"
          size="large"
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
                validate={['mobile']}
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

  const byAccount = () => {
    setIsPhone(false);
  };

  const byForm = () => {
    setIsPhone(true);
  };

  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        {/* <p className={styles.desc}>注册账号</p> */}
        <div className={styles.desc}>
          <span onClick={byAccount} className={isPhone ? undefined : styles.active}>
            邮箱注册
          </span>
          <Divider direction="ver" />
          <span onClick={byForm} className={isPhone ? styles.active : undefined}>
            手机号注册
          </span>
        </div>
        <Form value={postData} onChange={formChange} size="large">
          {isPhone ? phone : email}
          <Item required requiredMessage="必填">
            <Input.Password name="password" size="large" htmlType="password" placeholder="至少六位密码，区分大小写" />
          </Item>
          <Item required requiredTrigger="onFocus" requiredMessage="必填" validator={checkPass}>
            <Input.Password name="rePassword" size="large" htmlType="password" placeholder="确认密码" />
          </Item>

          <Item>
            <Form.Submit type="primary" onClick={handleSubmit} className={styles.submitBtn} validate>
              注册账号
            </Form.Submit>
          </Item>
          <Item
            style={{
              textAlign: 'center',
            }}
          >
            {/* <div className={styles.link} onClick={() => setIsPhone(!isPhone)}>
              {isPhone ? <p>使用邮箱注册</p> : <p>使用手机号注册</p>}
            </div> */}
            <Link
              to={{
                pathname: '/user',
                state: { fromDashboard: true },
              }}
            >
              <p className={styles.link}>使用已有账号登录</p>
            </Link>
          </Item>
        </Form>
      </div>
    </div>
  );
}
RegisterBlock.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.object,
};
RegisterBlock.defaultProps = {
  value: {},
};
