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
      <Card free style={{ padding: 15 }}>
        <Box spacing={5}>
          <Box direction="row" justify="flex-start" align="center" padding={10} spacing={10}>
            <h1>{info.blogName}</h1>
            {info.isCreator && (
              <Tag key={'c_#f50'} color="#f50" size="small">
                原创
              </Tag>
            )}
            {info.isCreative && (
              <Tag key={'c_#2db7f5'} color="#2db7f5" size="small">
                置顶
              </Tag>
            )}
          </Box>

          <div>
            <Box direction="row" justify="flex-start" align="center" padding={10} spacing={10}>
              <div>时间 : 2020-09-23 20:14:21</div>
              <Box direction="row" align="center">
                <div>
                  <Icon type="favorites-filling" style={{ color: '#999' }} />
                </div>
                <div>&nbsp;&nbsp;&nbsp;{info.likes}</div>
              </Box>
              <Box direction="row" align="center">
                <div>
                  <Icon type="eye" style={{ color: '#999' }} />
                </div>
                <div>&nbsp;&nbsp;&nbsp;{info.visits}</div>
              </Box>

              <div>
                <Box direction="row" justify="flex-start" align="center">
                  分类专栏：
                  {info.columns &&
                    info.columns.map((item) => {
                      return (
                        <div
                          style={{ backgroundColor: '#eee', borderRadius: '20%', padding: '3px', marginRight: '3px' }}
                        >
                          {item.className}
                        </div>
                      );
                    })}
                </Box>
              </div>
              <div>
                <Box direction="row" justify="flex-start" align="center">
                  所属标签：
                  {info.tags &&
                    info.tags.map((item) => {
                      return (
                        <div style={{ backgroundColor: '#eee', borderRadius: '20%', padding: '3px' }}>
                          {item.tagName}
                        </div>
                      );
                    })}
                </Box>
              </div>
            </Box>
          </div>

          <div dangerouslySetInnerHTML={{ __html: info.formatContent }} className={styles.htmlContent}></div>
        </Box>
      </Card>
    </>
  );
};

/*
<Card.Header title="博客信息" />
        <Card.Divider />
        <Card.Content>
          <div className={styles.Content}>
            <Form labelAlign="top" responsive>


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
        </Card.Content> */

export default ArticleBlock;
