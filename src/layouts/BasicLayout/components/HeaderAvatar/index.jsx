import React, { useState, useEffect } from 'react';
import { Avatar, Overlay, Menu, Icon, Message } from '@alifd/next';
import styles from './index.module.scss';
import { useHistory, Link, request } from 'ice';

const { Item } = Menu;
const { Popup } = Overlay;

const UserProfile = ({ name, avatar, lottery }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>
        <Avatar src={avatar} alt="用户头像" />
      </div>
      <div className={styles.content}>
        <h4>{name}</h4>
        <span>{lottery}</span>
      </div>
    </div>
  );
};

const HeaderAvatar = (props) => {
  const history = useHistory();
  const [postData, setValue] = useState({
    name: 'MyName',
    lottery: 'name@gmail.com',
    avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
  });

  useEffect(async () => {
    await request
      .get('/user/info')
      .then((res) => {
        console.log(res.data);
        setValue({
          name: res.data.userNickName,
          lottery: res.data.lottery,
          avatar: res.data.avatar,
        });
      })
      .catch((e) => {
        console.log(e);
        history.push('/feedback/403');
      });
  }, []);

  const exit = () => {
    console.log('exit');
    window.sessionStorage.setItem('token', '');
    history.push('/user/login');
    Message.success('已退出，请重新登录');
  };

  const { name, avatar } = postData;
  return (
    <Popup
      trigger={
        <div className={styles.headerAvatar}>
          <Avatar size="small" src={avatar} alt="用户头像" />
          <span
            style={{
              marginLeft: 10,
            }}
          >
            {name}
          </span>
        </div>
      }
      triggerType="click"
    >
      <div className={styles.avatarPopup}>
        <UserProfile {...postData} />
        <Menu className={styles.menu}>
          <Item>
            <Link
              to={{
                pathname: '/person',
                state: { fromDashboard: true },
              }}
            >
              <Icon size="small" type="account" />
              个人设置
            </Link>
          </Item>
          {/* <Item>
            <Icon size="small" type="set" />
            系统设置
          </Item> */}
          <Item onClick={exit}>
            <Icon size="small" type="exit" />
            退出
          </Item>
        </Menu>
      </div>
    </Popup>
  );
};

export default HeaderAvatar;
