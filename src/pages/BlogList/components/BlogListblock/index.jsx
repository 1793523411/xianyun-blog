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
  useEffect(() => {
    getList();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getList = () => {
    request.get('/article/getList/all').then((res) => {
      console.log(res);
      SetCard(res.data);
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
              <div className={styles.title}>{c.title}</div>
              <div className={styles.content}>
                {c.summary
                  .replace(/[\\\`\*\_\[\]\#\+\-\!\>]/g, '')
                  .replace(/(\\)/gi, '')
                  .slice(0, 80)}
                ···
              </div>
              {/* <div className={styles.subContent}>{c.subContent}</div> */}
              <div className={styles.subContent}>博客名称：{c.blogName}</div>
            </div>
          </div>
          <div className={styles.right}>
            <Button
              type="primary"
              text
              onClick={() => {
                history.push('/editor/' + c.id);
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
                <div dangerouslySetInnerHTML={{ __html: c.formatContent }} className={styles.htmlContent}></div>
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
        <Box align="center">
          <Search type="primary" hasIcon={false} searchText="搜索" onSearch={onSearchClick} />
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
            {/* <div className={styles.ListItem}>
              <div className={styles.add}>
                <Icon type="add" className={styles.icon} size="xs" />
                <div className={styles.addText}>添加内容</div>
              </div>
            </div> */}
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
