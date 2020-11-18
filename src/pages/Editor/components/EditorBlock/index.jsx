import React, { useState, useEffect } from 'react';
import { Input, Box, Switch } from '@alifd/next';
import styles from './index.module.scss';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

import { useHistory, request } from 'ice';

const EditorBlock = (props) => {
  const [title, setTitle] = useState('');
  const [summary, setContent] = useState('');
  const [formatContent, setHtmlContent] = useState('');
  const history = useHistory();
  useEffect(() => {
    // if (location.href.indexOf('#reloaded') == -1) {
    //   location.href = location.href + '#reloaded';
    //   location.reload();
    // }
  }, []);

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
  }
  return (
    <div>
      <Input
        addonTextBefore="文章标题"
        size="large"
        value={title}
        maxLength={100}
        onChange={onChangeTitle}
        hasLimitHint
        style={{ width: '49%', paddingLeft: '1%' }}
        aria-label="style width 400"
      />
      <Switch
        checkedChildren="置顶"
        className={styles.largeWidth}
        onChange={onChangetopPriority}
        unCheckedChildren="不置顶"
      />
      <Switch
        checkedChildren="原创"
        className={styles.largeWidth}
        onChange={onChangetopPriority}
        unCheckedChildren="非原创"
      />
      <br />
      <br />
      <Box direction="row" justify="center" padding={10}>
        <Input.TextArea
          onChange={onChangeContent}
          aria-label="auto height"
          autoHeight={{ minRows: 25, maxRows: 999999 }}
          style={{ width: '50%', marginRight: '2%' }}
        />
        <div dangerouslySetInnerHTML={{ __html: formatContent }} className={styles.htmlContent}></div>
      </Box>
    </div>
  );
};

export default EditorBlock;
