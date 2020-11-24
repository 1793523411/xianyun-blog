import React, { useState, useEffect } from 'react';
import { Input, Box, Switch, Button, Message } from '@alifd/next';
import styles from './index.module.scss';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

import { useHistory, request, useParams } from 'ice';

const EditorBlock = (props) => {
  const [blogName, setBlogName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setContent] = useState('');
  const [formatContent, setHtmlContent] = useState('');
  const [topPriority, setTopPriority] = useState(0);
  const [isCreative, setIsCreative] = useState(0);
  const history = useHistory();

  const { id } = useParams();
  useEffect(() => {
    // if (location.href.indexOf('#reloaded') == -1) {
    //   location.href = location.href + '#reloaded';
    //   location.reload();
    // }
    console.log(id);
    if (id > 0) {
      request.post('/article/getById', { id }).then((res) => {
        console.log(res);
      });
    }
  }, []);

  //   {
  //     "title":"测试", 标题
  //     "formatContent":"aaaaaaaaa", 网页格式
  //     "summary":"aaaaaaaa", 原始格式
  //     "topPriority":0, 是否顶置
  //     "isCreative":0 是否原创
  // }

  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    },
  });

  function onChangeBlogName(v) {
    console.log(v);
    setBlogName(v);
  }
  function onChangeTitle(v) {
    console.log(v);
    setTitle(v);
  }

  function onChangeContent(v) {
    console.log(v);
    setContent(v);

    setHtmlContent(marked(summary));
  }

  function onChangetopPriority(checked) {
    console.log(`switch to ${checked}`);
    setTopPriority(checked ? 1 : 0);
  }

  function onChangeisCreative(checked) {
    console.log(`switch to ${checked}`);
    setIsCreative(checked ? 1 : 0);
  }
  const submit = () => {
    if (!blogName || !title || !summary) {
      Message.warning('请将信息填写完整');
      return;
    }
    console.log({
      blogName,
      title,
      summary,
      formatContent,
      topPriority,
      isCreative,
    });
    request
      .post('/article/add', {
        blogName,
        title,
        summary,
        formatContent,
        topPriority,
        isCreative,
        Token: window.sessionStorage.getItem('token'),
      })
      .then((res) => {
        Message.success('添加成功');
        console.log(res);
        setBlogName('');
        setTitle('');
        setContent('');
        setHtmlContent('');
        setTopPriority(0);
        setIsCreative(0);
      });
  };
  return (
    <div>
      <Input
        addonTextBefore="博客名称"
        size="medium"
        value={blogName}
        maxLength={100}
        onChange={onChangeBlogName}
        hasLimitHint
        style={{ width: '49%', paddingLeft: '1%' }}
        aria-label="style width 400"
      />
      <br />
      <br />
      <Input
        addonTextBefore="博客标题"
        size="medium"
        value={title}
        maxLength={100}
        onChange={onChangeTitle}
        hasLimitHint
        style={{ width: '49%', paddingLeft: '1%' }}
        aria-label="style width 400"
      />
      <br />
      <br />
      <Box direction="row" justify="center" padding={10}>
        <Input.TextArea
          onChange={onChangeContent}
          aria-label="auto height"
          autoHeight={{ minRows: 25, maxRows: 999999 }}
          style={{ width: '50%', marginRight: '2%' }}
          value={summary}
        />
        <div dangerouslySetInnerHTML={{ __html: formatContent }} className={styles.htmlContent}></div>
      </Box>
      <br />
      <div style={{ marginLeft: '-1%' }}>
        <Switch
          checkedChildren="置顶"
          className={styles.largeWidth}
          onChange={onChangetopPriority}
          unCheckedChildren="不置顶"
        />
        <Switch
          checkedChildren="原创"
          className={styles.largeWidth}
          onChange={onChangeisCreative}
          unCheckedChildren="非原创"
        />
      </div>
      <br />
      <Button type="primary" style={{ marginLeft: '1%' }} onClick={submit}>
        提交
      </Button>
    </div>
  );
};

export default EditorBlock;
