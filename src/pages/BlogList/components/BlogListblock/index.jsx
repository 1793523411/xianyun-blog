/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Search,
  Card,
  Tag,
  Divider,
  Typography,
  Icon,
  Loading,
  Button,
  Pagination,
  Dialog,
  Message,
  Switch,
  DatePicker,
  Select,
  Input,
} from '@alifd/next';
import styles from './index.module.scss';
import { useHistory, request } from 'ice';

import moment from 'moment';
const { RangePicker, MonthPicker, YearPicker } = DatePicker;
const startValue = moment('2017-11-20', 'YYYY-MM-DD', true);
const endValue = moment('2017-12-15', 'YYYY-MM-DD', true);
const onChangedata = (val) => console.log(val);

const Option = Select.Option;
const onChangetype = function (value) {
  console.log(value);
};
const onBlurtype = function (e) {
  console.log(/onblur/, e);
};

const BlogListblock = (props) => {
  const history = useHistory();

  const [card, SetCard] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [visibledel, setVisibledel] = useState(false);
  const [currentId, SetCurrentId] = useState(0);
  const [currentHtml, SetCurrentHtml] = useState(0);

  useEffect(() => {
    getList();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getList = () => {
    setLoading(true);
    request
      .get('/article/getList/all')
      .then((res) => {
        // if (res.data.success === false) {
        //   history.push('/user/login');
        // }
        console.log(res);
        // SetCard(res.data);
        SetCard(res.rows);
        setLoading(false);
      })
      .catch((e) => {
        // history.push('/user/login');
      });
  };

  const onPaginationChange = () => {
    setLoading(true);
    setLoading(false);
  };

  const onClose = (reason) => {
    console.log(reason);

    setVisible(false);
    setVisibledel(false);
  };

  const add = () => {
    history.push('/editor/0/0');
  };

  function onChangesearch(v) {
    console.log(v);
  }

  const renderCards = () => {
    return card.map((c, i) => (
      <div className={styles.ListItem} key={i}>
        <div className={styles.main}>
          <div className={styles.left}>
            {/* <img
              src="https://shadow.elemecdn.com/app/element/list.62a82841-1bcb-11ea-a71c-17428dec1b82.png"
              alt="img"
            /> */}
            <div>
              <div className={styles.title}>{c.blogName}</div>
              {/* 这是文章内容的一部分不显示了 */}
              {/* <div className={styles.content}>
                {c.summary
                  .replace(/[\\\`\*\_\[\]\#\+\-\!\>]/g, '')
                  .replace(/(\\)/gi, '')
                  .slice(0, 80)}
                ···
              </div> */}
              {/* <div className={styles.subContent}>博客名称：{c.blogName}</div> */}
              <br />

              <div className={styles.subContent}>
                <Box align="center" direction="row" spacing={20} justify="center">
                  <div>原创</div>
                  <div>2020年3月223日 22:20:07</div>
                  {/* <div>
                    <Icon type="eye" />
                    50
                  </div> */}
                  <div>
                    <Icon type="atm" size="small" />
                    <span>10</span>
                  </div>
                  <div style={{ margin: 'auto' }}>
                    <Icon type="favorites-filling" size="small" />
                    <span style={{ marginTop: 5 }}>15</span>
                  </div>
                </Box>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <Button
              type="primary"
              text
              onClick={() => {
                history.push('/editor/' + c.url + '/' + c.uniqueId);
              }}
            >
              编辑
            </Button>
            <Button
              type="primary"
              text
              onClick={() => {
                setVisibledel(true);
                SetCurrentId(c.id);
              }}
              style={{ color: 'red' }}
            >
              删除
            </Button>
            <Button
              type="primary"
              text
              onClick={() => {
                console.log(c.formatContent);
                setVisible(true);
                SetCurrentHtml(c.formatContent);
              }}
            >
              预览
            </Button>

            <Dialog
              // title="Welcome to Alibaba.com"
              visible={visibledel}
              onOk={() => {
                console.log(currentId);
                request.post('/article/del', { id: currentId }).then((res) => {
                  console.log(res);
                  Message.success('删除成功');
                  getList();
                  onClose();
                });
                onClose();
              }}
              onCancel={onClose}
              onClose={onClose}
            >
              确定删除，操作不可逆？
            </Dialog>
            <Dialog
              title="预览文章"
              visible={visible}
              onOk={onClose}
              onCancel={onClose}
              onClose={onClose}
              footer={false}
              height="85vh"
            >
              <div style={{ width: '150vh' }}>
                <div dangerouslySetInnerHTML={{ __html: currentHtml }} className={styles.htmlContent}></div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Card free className={styles.BasicList}>
        <Box align="center" direction="row" spacing={30} justify="center">
          筛选：
          <RangePicker defaultValue={[startValue, endValue]} onChange={onChangedata} />
          <Select
            id="basic-demo"
            style={{width: 250}}
            onChange={onChangetype}
            onBlur={onBlurtype}
            defaultValue="分类专栏"
            aria-label="name is"
            showSearch
            hasClear
          >
            <Option value="jack">Jack</Option>
            <Option value="frank">Frank</Option>
            <Option value="hugo">Hugo</Option>
          </Select>
          <div style={{ width: '10vh' }}></div>
          <Input size="medium" placeholder="输入关键词" onChange={onChangesearch} aria-label="Medium" />
          <Button type="primary">搜索</Button>
        </Box>
        <Divider
          dashed
          style={{
            margin: '24px 0',
          }}
        />
        <Loading visible={loading} className={styles.MainList}>
          <Box className={styles.MainContent} spacing={10}>
            <div className={styles.ListItem}>
              <div className={styles.add} onClick={add}>
                <Icon type="add" className={styles.icon} size="xs" />
                <div className={styles.addText}>添加文章</div>
              </div>
            </div>
            {renderCards()}
            <Box margin={[15, 0, 0, 0]} direction="row" align="center" justify="space-between">
              <div className={styles.total}>
                共<span>200</span>条需求
              </div>
              <Pagination onChange={onPaginationChange} />
            </Box>
          </Box>
        </Loading>
      </Card>
    </>
  );
};

export default BlogListblock;
