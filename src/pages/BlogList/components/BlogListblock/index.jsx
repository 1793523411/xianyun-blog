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
} from '@alifd/next';
import styles from './index.module.scss';
import { useHistory, request } from 'ice';

const { Group: TagGroup, Selectable: SelectableTag } = Tag;
const DEFAULT_DATA = {
  tagsA: ['类目一', '类目二', '类目三', '类目四', '类目五', '类目六', '类目七', '类目八', '类目九', '类目十'],
  tagA: '类目一',
  tagsB: ['不到一年', '一年以上三年以下', '三年以上五年以下', '五年以上'],
  tagB: '一年以上三年以下',
  cards: new Array(5).fill({
    title: '构建一套产品化设计系统',
    content:
      '随着互联网行业的聚变式发展，在电商业务从“信息透出” 到 “在线交易” 的过程中，网站 UI 构建也经历了“体验一致性”、“设计效率”、“UI系统构建/应用效率”、“多端适配” …',
    subContent: '谢瑶 3 小时前更新',
  }),
};

const BlogListblock = (props) => {
  const history = useHistory();
  const { dataSource = DEFAULT_DATA, onSearch = () => {} } = props;
  const [tagAValue, setTagAValue] = useState(dataSource.tagA);
  const [tagBValue, setTagBValue] = useState(dataSource.tagB);
  const [card, SetCard] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [visibledel, setVisibledel] = useState(false);
  const [currentId, SetCurrentId] = useState(0);
  const [currentHtml, SetCurrentHtml] = useState(0);

  const [blogName, setBlogName] = useState('');
  const [title, setTitle] = useState('');
  const [topPriority, setTopPriority] = useState(0);
  const [isCreative, setIsCreative] = useState(0);

  const [searchValue, setSearchValue] = useState('');

  const [select, setSelect] = useState({
    filter: [
      // {
      //   label: '博客标题',
      //   value: '博客标题',
      // },
      {
        label: '博客名称',
        value: '博客名称',
      },
    ],
    value: '',
  });
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

  const onTagAValueChange = (v) => {
    setLoading(true);
    setTagAValue(v);
  };

  const onTagBValueChange = (v) => {
    setLoading(true);
    setTagBValue(v);
  };

  const onSearchClick = () => {
    setLoading(true);
    onSearch();
  };

  const onPaginationChange = () => {
    setLoading(true);
  };

  const renderTagListA = () => {
    return dataSource.tagsA.map((name) => (
      <SelectableTag key={name} checked={tagAValue === name} onChange={() => onTagAValueChange(name)} {...props}>
        {name}
      </SelectableTag>
    ));
  };

  const renderTagListB = () => {
    return dataSource.tagsB.map((name) => (
      <SelectableTag key={name} checked={tagBValue === name} onChange={() => onTagBValueChange(name)} {...props}>
        {name}
      </SelectableTag>
    ));
  };

  const onClose = (reason) => {
    console.log(reason);

    setVisible(false);
    setVisibledel(false);
  };

  function onChangetopPriority(checked) {
    // console.log(`switch to ${checked}`);
    // setTopPriority(checked ? 1 : 0);
    // if (!topPriority) {
    setSearchValue('');
    setIsCreative(0);
    setLoading(true);
    request
      .get('/article/getList/all')
      .then((res) => {
        if (res.data.success === false) {
          history.push('/user/login');
        }
        console.log(res);
        SetCard(res.data);
        setLoading(false);
      })
      .catch((e) => {
        history.push('/user/login');
      });
    // }
  }

  function onChangeisCreative(checked) {
    setSearchValue('');
    console.log(`switch to ${checked}`);
    // setTimeout(() => {
    setIsCreative(checked ? 1 : 0);
    // }, 0);
    console.log(isCreative);
    setLoading(true);
    request
      .post('/article/filter', {
        isCreative: checked ? 1 : 0,
      })
      .then((res) => {
        if (res.data.success === false) {
          history.push('/user/login');
        }
        SetCard(res.data);
        setLoading(false);
      })
      .catch((e) => {
        history.push('/user/login');
      });
  }

  const onSearch2 = (value, filterValue) => {
    setLoading(true);
    console.log(value, filterValue, isCreative);
    if (filterValue === '博客标题') {
      // setBlogName('');
      // setTitle(value);
      request
        .post('/article/filter', {
          title: value,
          isCreative,
        })
        .then((res) => {
          if (res.data.success === false) {
            history.push('/user/login');
          }
          SetCard(res.data);
          setLoading(false);
        })
        .catch((e) => {
          history.push('/user/login');
        });
    } else {
      // setBlogName(value);
      // setTitle('');
      request
        .post('/article/filter', {
          blogName: value,
          isCreative,
        })
        .then((res) => {
          if (res.data.success === false) {
            history.push('/user/login');
          }
          SetCard(res.data);
          setLoading(false);
        })
        .catch((e) => {
          history.push('/user/login');
        });
    }
    // getFilterData();
  };

  const onChange = (value) => {
    setSelect({
      filter: [
        // {
        //   label: '博客标题',
        //   value: '博客标题',
        // },
        {
          label: '博客名称',
          value: '博客名称',
        },
      ],
      value,
    });
  };

  // value is filter value，obj is the search value
  const onFilterChange = (value) => {
    console.log(value);
  };

  const getFilterData = () => {
    setLoading(true);
    if (blogName === '') {
      request
        .post('/article/filter', {
          title,
          isCreative,
        })
        .then((res) => {
          if (res.data.success === false) {
            history.push('/user/login');
          }
          SetCard(res.data);
          setLoading(false);
        })
        .catch((e) => {
          history.push('/user/login');
        });
    } else if (title === '') {
      request
        .post('/article/filter', {
          blogName,
          isCreative,
        })
        .then((res) => {
          if (res.data.success === false) {
            history.push('/user/login');
          }
          SetCard(res.data);
          setLoading(false);
        })
        .catch((e) => {
          history.push('/user/login');
        });
    } else {
      request
        .post('/article/filter', {
          isCreative,
        })
        .then((res) => {
          if (res.data.success === false) {
            history.push('/user/login');
          }
          SetCard(res.data);
          setLoading(false);
        })
        .catch((e) => {
          history.push('/user/login');
        });
    }
  };

  const add = () => {
    history.push('/editor/0/0');
  };

  const onChange2 = (value) => {
    console.log(value);
    setSearchValue(value);
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
              <div className={styles.title}>{c.blogName}</div>
              <div className={styles.content}>
                {c.summary
                  .replace(/[\\\`\*\_\[\]\#\+\-\!\>]/g, '')
                  .replace(/(\\)/gi, '')
                  .slice(0, 80)}
                ···
              </div>
              {/* <div className={styles.subContent}>博客名称：{c.blogName}</div> */}
              <br />
              <div className={styles.subContent}>
                时间：{c.updateTime ? c.updateTime.slice(0, -8) : c.createTime.slice(0, -8)} &nbsp;&nbsp; &nbsp;&nbsp;
                {c.isCreative ? (
                  <Tag key={'p_n_blue'} type="normal" color="blue" size="small">
                    原创
                  </Tag>
                ) : (
                  ''
                )}
                &nbsp;&nbsp;
                {c.topPriority ? (
                  <Tag key={'p_n_orange'} type="normal" color="orange" size="small">
                    置顶
                  </Tag>
                ) : (
                  ''
                )}
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
                console.log(c.formatContent);
                setVisible(true);
                SetCurrentHtml(c.formatContent);
              }}
            >
              预览
            </Button>
            <Button
              type="primary"
              text
              onClick={() => {
                setVisibledel(true);
                SetCurrentId(c.id);
              }}
            >
              删除
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
        {/* <Box align="center" direction="row" spacing={20} justify="center">
          <Search type="primary" hasIcon={false} onSearch={onSearchClick} />
          <Switch
            checkedChildren="置顶"
            className={styles.largeWidth}
            onChange={onChangetopPriority}
            unCheckedChildren="不置顶"
            checked={topPriority ? 1 : 0}
          />
        </Box>
        <br /> */}
        <Box align="center" direction="row" spacing={20} justify="center">
          <Button type="primary" onClick={onChangetopPriority}>
            <Icon type="eye" />
            显示所有
          </Button>{' '}
          &nbsp;&nbsp;
          <Search
            // onChange={this.onChange.bind(this)}
            hasArrow={false}
            onSearch={onSearch2}
            filterProps={{ autoWidth: false }}
            defaultFilterValue="博客名称"
            // filter={select.filter}
            onFilterChange={onFilterChange}
            value={searchValue}
            onChange={onChange2}
          />
          {/* <Switch
            checkedChildren="显示所有"
            className={styles.largeWidth}
            onChange={onChangetopPriority}
            unCheckedChildren="显示所有"
            checked={topPriority ? 1 : 0}
          /> */}
          <Switch
            checkedChildren="只看非原创"
            className={styles.largeWidth}
            onChange={onChangeisCreative}
            unCheckedChildren="只看原创"
            checked={isCreative ? 1 : 0}
          />
        </Box>
        <Divider
          dashed
          style={{
            margin: '24px 0',
          }}
        />
        {/* <Box className={styles.TagBox}>
          <div className={styles.TagBoxItem}>
            <Typography.Text className={styles.TagTitleName}>内容分类</Typography.Text>
            <TagGroup>{renderTagListA()}</TagGroup>
          </div>
          <div className={styles.TagBoxItem}>
            <Typography.Text className={styles.TagTitleName}>时间</Typography.Text>
            <TagGroup>{renderTagListB()}</TagGroup>
          </div>
        </Box> */}

        <Loading visible={loading} className={styles.MainList}>
          <Box className={styles.MainContent} spacing={10}>
            <div className={styles.ListItem}>
              <div className={styles.add} onClick={add}>
                <Icon type="add" className={styles.icon} size="xs" />
                <div className={styles.addText}>添加文章</div>
              </div>
            </div>
            {renderCards()}
            {/* <Box margin={[15, 0, 0, 0]} direction="row" align="center" justify="space-between">
              <div className={styles.total}>
                共<span>200</span>条需求
              </div>
              <Pagination onChange={onPaginationChange} />
            </Box> */}
          </Box>
        </Loading>
      </Card>
    </>
  );
};

export default BlogListblock;
