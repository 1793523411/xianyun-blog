import React, { useState, useEffect } from 'react';
import { Box, Search, Card, Tag, Divider, Typography, Icon, Loading, Button, Pagination, Form } from '@alifd/next';
import styles from './index.module.scss';

import { useHistory, request, useParams } from 'ice';

const ArticleBlock = (props) => {
  const history = useHistory();
  const { url, uniqueId } = useParams();

  const [info, setInfo] = useState({});

  useEffect(() => {
    request.post('/article/getById', { url, uniqueId }).then((res) => {
      console.log(res);
      setInfo(res.data);
    });
  }, []);

  const formatDate = (date) => {
    return new String(date).slice(0, 10) + ' ' + new String(date).slice(11, 16);
  };
  return (
    <>
      <Card free>
        <Card.Header title="博客信息" />
        <Card.Divider />
        <Card.Content>
          <div className={styles.Content}>
            <Form labelAlign="top" responsive>
              <Form.Item colSpan={4} label="博客名称">
                <span>{info.blogName}</span>
              </Form.Item>
              <Form.Item colSpan={4} label="创建时间">
                <span>{formatDate(info.createTime)}</span>
              </Form.Item>
              <Form.Item colSpan={4} label="是否原创">
                <span>{info.isCreative}</span>
              </Form.Item>
              <Form.Item colSpan={4} label="访问量">
                <span>{info.visits}</span>
              </Form.Item>
              <Form.Item colSpan={4} label="喜欢人数">
                <span>{info.likes}</span>
              </Form.Item>
              <Form.Item colSpan={4} label="专栏">
                <span>专栏一</span>
              </Form.Item>
              <Form.Item colSpan={4} label="标签">
                <span>
                  <Tag key={'p_p_blue'} type="normal" color="blue" size="small">
                    标签一
                  </Tag>
                </span>
              </Form.Item>
              <Form.Item colSpan={12} label="博客内容">
                <div dangerouslySetInnerHTML={{ __html: info.formatContent }} className={styles.htmlContent}></div>
              </Form.Item>
            </Form>
          </div>
        </Card.Content>
      </Card>
    </>
  );
};

export default ArticleBlock;
