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
const { RangePicker, MonthPicker, YearPicker, WeekPicker } = DatePicker;
const startValue = moment('2017-11-20', 'YYYY-MM-DD', true);
const endValue = moment('2017-12-15', 'YYYY-MM-DD', true);

const Option = Select.Option;

const BlogListblock = (props) => {
  const history = useHistory();

  const [card, SetCard] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [visibledel, setVisibledel] = useState(false);
  const [currentId, SetCurrentId] = useState(0);
  const [currentHtml, SetCurrentHtml] = useState(0);

  const [searchValue, setSearchValue] = useState('');

  const [total, setTotal] = useState(0);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const [className, setClassName] = useState('');
  const [tag, setTag] = useState('');

  const [lanTag, setLan] = useState('');

  useEffect(() => {
    getList();
    request.get('/article/getallTag').then((res) => {
      console.log('专栏和标签', res);
      setLan(res.data);
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getList = () => {
    setLoading(true);
    // request
    //   .get('/article/getList/all')
    //   .then((res) => {
    //     // if (res.data.success === false) {
    //     //   history.push('/user/login');
    //     // }
    //     console.log(res);
    //     // SetCard(res.data);
    //     SetCard(res.rows);
    //     setLoading(false);
    //     setTotal(res.total);
    //   })
    //   .catch((e) => {
    //     // history.push('/user/login');
    //   });

    request
      .post('/article/page', {
        pageNum: 1,
        pageSize: 5,
        params: {
          beginTime: start,
          endTime: end,
        },
        blogName: searchValue,
        className,
        tagName: tag,
      })
      .then((res) => {
        console.log(res);
        SetCard(res.rows);
        setLoading(false);
        setTotal(res.total);
      });
  };

  const onPaginationChange = (v) => {
    // console.log(st)
    console.log(v);
    setLoading(true);
    request
      .post('/article/page', {
        pageNum: v,
        pageSize: 5,
        params: {
          beginTime: start,
          endTime: end,
        },
        blogName: searchValue,
        className,
        tagName: tag,
      })
      .then((res) => {
        console.log(res);
        SetCard(res.rows);
        setLoading(false);
        setTotal(res.total);
      });
  };

  const onClose = (reason) => {
    console.log(reason);

    setVisible(false);
    setVisibledel(false);
  };

  const add = () => {
    history.push('/editor/0/0');
  };

  const onChangedata = (val) => {
    console.log(val);
  };

  const formatDate = (date) => {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = date.getDate();
    d = d < 10 ? `0${d}` : d;
    return `${y}-${m}-${d}`;
  };
  const onChangestartValue = (val) => {
    if (!val._d) {
      getList();
      return;
    }

    console.log(formatDate(val._d));
    setStart(formatDate(val._d));
    //todo 根据时间查询
    request
      .post('/article/page', {
        params: {
          beginTime: formatDate(val._d),
          endTime: formatDate(val._d),
        },
        pageNum: 1,
        pageSize: 5,
        blogName: searchValue,
        className,
        tagName: tag,
      })
      .then((res) => {
        console.log(res.rows);
        SetCard(res.rows);
        setTotal(res.rows.length);
      });
  };
  const onChangeEndValue = (val) => {
    if (!val._d) {
      getList();
      return;
    }
    //todo 根据时间查询
    console.log(formatDate(val._d));
    setEnd(formatDate(val._d));
    request
      .post('/article/page', {
        params: {
          beginTime: start,
          endTime: formatDate(val._d),
        },
        pageNum: 1,
        pageSize: 5,
        blogName: searchValue,
        className,
        tagName: tag,
      })
      .then((res) => {
        console.log(res.rows);
        SetCard(res.rows);
        setTotal(res.rows.length);
      });
  };

  const onChangelan = function (value) {
    if (!value) {
      getList();
      return;
    }
    setClassName(value);
    setLoading(true);
    console.log(value);
    request
      .post('/article/page', {
        className: value,
        pageNum: 1,
        pageSize: 5,
        params: {
          beginTime: start,
          endTime: end,
        },
        blogName: searchValue,
        tagName: tag,
      })
      .then((res) => {
        console.log(res.rows);
        SetCard(res.rows);
        setLoading(false);
        setTotal(res.rows.length);
      });
  };
  const onChangetag = function (value) {
    if (!value) {
      getList();
      return;
    }
    setTag(value);
    setLoading(true);
    console.log(value);
    request
      .post('/article/page', {
        tagName: value,
        pageNum: 1,
        pageSize: 5,
        params: {
          beginTime: start,
          endTime: end,
        },
        blogName: searchValue,
        className,
      })
      .then((res) => {
        console.log(res.rows);
        SetCard(res.rows);
        setLoading(false);
        setTotal(res.rows.length);
      });
  };
  const search = () => {
    setLoading(true);
    console.log(searchValue);
    request
      .post('/article/page', {
        blogName: searchValue,
        pageNum: 1,
        pageSize: 5,
        params: {
          beginTime: start,
          endTime: end,
        },
        className,
        tagName: tag,
      })
      .then((res) => {
        console.log(res.rows);
        SetCard(res.rows);
        setTotal(res.rows.length);
        setLoading(false);
      });
  };

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
              <div
                className={styles.title}
                onClick={() => {
                  console.log(c.id);
                  history.push(`/article/${c.url}/${c.uniqueId}`);
                }}
              >
                {c.blogName}
              </div>
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
                  <div>{c.isCreative === 1 ? '原创' : <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>}</div>
                  <div>{c.updateTime ? c.updateTime : c.createTime}</div>
                  <div>
                    <Icon type="eye" />
                    &nbsp;
                    {c.visits}
                  </div>
                  <div>
                    <Icon type="atm" size="small" />
                    &nbsp;
                    <span>10</span>
                  </div>
                  <div>
                    <Icon type="favorites-filling" size="small" />
                    &nbsp;
                    <span style={{ marginTop: 5 }}>{c.likes}</span>
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
                history.push(`/editor/${c.url}/${c.uniqueId}`);
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
        <Box align="center" direction="row" spacing={10} justify="center">
          筛选：
          {/* <RangePicker style={{ width: 250 }} defaultValue={[startValue, endValue]} onOk={onChangedata} /> */}
          <DatePicker onChange={onChangestartValue} />
          <DatePicker onChange={onChangeEndValue} />
          <Select
            id="basic-demo"
            style={{ width: 160 }}
            onChange={onChangelan}
            defaultValue="专栏"
            aria-label="name is"
            showSearch
            hasClear
          >
            {lanTag &&
              lanTag.columns.map((item, index) => {
                return <Option value={item.className}>{item.className}</Option>;
              })}
          </Select>
          <Select
            id="basic-demo"
            style={{ width: 160 }}
            onChange={onChangetag}
            defaultValue="标签"
            aria-label="name is"
            showSearch
            hasClear
          >
            {lanTag &&
              lanTag.tags.map((item, index) => {
                return <Option value={item.tagName}>{item.tagName}</Option>;
              })}
          </Select>
          <div style={{ width: '3vh' }}></div>
          <Input
            size="medium"
            placeholder="输入关键词"
            onChange={(v) => setSearchValue(v)}
            aria-label="Medium"
            value={searchValue}
          />
          <Button type="primary" onClick={() => search()}>
            搜索
          </Button>
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
                共<span>{total}</span>篇文章
              </div>
              <Pagination onChange={onPaginationChange} pageSize="5" total={total} />
            </Box>
          </Box>
        </Loading>
      </Card>
    </>
  );
};

export default BlogListblock;
