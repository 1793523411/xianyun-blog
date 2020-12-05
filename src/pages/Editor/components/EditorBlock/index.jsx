import React, { useState, useEffect } from 'react';
import { Input, Box, Switch, Button, Message, Select } from '@alifd/next';
import styles from './index.module.scss';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

import { useHistory, request, useParams } from 'ice';
import { func } from 'prop-types';

const EditorBlock = (props) => {
  const [blogName, setBlogName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setContent] = useState('');
  const [formatContent, setHtmlContent] = useState('');
  const [topPriority, setTopPriority] = useState(0);
  const [isCreative, setIsCreative] = useState(1);
  const [id, setId] = useState(0);
  const history = useHistory();

  const [className, setClassName] = useState([]);
  const [tagName, setTagName] = useState([]);

  const [defaultTag, setTag] = useState([]);
  const [defaultTagV, setTagV] = useState([]);

  const [allLan, setAllLan] = useState([]);
  const [allLanV, setAllLanV] = useState([]);

  const [allTag, setAllTag] = useState([]);

  const [defLan, setDefLan] = useState([]);

  const { url, uniqueId } = useParams();

  useEffect(() => {
    // if (location.href.indexOf('#reloaded') == -1) {
    //   location.href = location.href + '#reloaded';
    //   location.reload();
    // }
    request.get('/article/getallTag').then((res) => {
      // console.log('所有专栏和标签', res);
      let tmp = [];
      let tmp2 = [];
      res.data.columns.forEach((item, index) => {
        tmp.push({
          value: item.className,
          label: item.className,
        });
        tmp2.push(item.className);
      });
      let tmp3 = [];
      res.data.tags.forEach((item, index) => {
        tmp3.push({
          value: item.tagName,
          label: item.tagName,
        });
        // tmp2.push(item.tagName);
      });
      setAllLan(tmp);
      setAllLanV(tmp2);
      setAllTag(tmp3);
    });
    console.log(url);
    console.log(uniqueId);
    if (uniqueId > 0 && url !== 0) {
      console.log('111');
      request.post('/article/getById', { url, uniqueId }).then((res) => {
        console.log(res);
        let tmp = [];
        let tmp2 = [];
        let tmpDT = [];
        res.data.tags.forEach((item, index) => {
          tmp.push({
            value: item.tagName,
            label: item.tagName,
          });
          tmpDT.push({
            className: item.tagName,
            articleCount: 0,
          });
          tmp2.push(item.tagName);
        });
        setTagName(tmpDT);
        let tmp3 = [];
        let tmpDL = [];
        res.data.columns.forEach((item, index) => {
          tmp3.push(item.className);
          tmpDL.push({
            className: item.className,
            articleCount: 0,
          });
        });
        setClassName(tmpDL);
        setDefLan(tmp3);
        console.log(tmp);
        console.log(tmp2);
        setTag(tmp);
        setTagV(tmp2);
        // console.log(defaultTagV);
        console.log(res.data.tags);
        setBlogName(res.data.blogName);
        setTitle(res.data.title);
        setContent(res.data.summary);
        setHtmlContent(res.data.formatContent);
        setTopPriority(res.data.topPriority);
        setIsCreative(res.data.isCreative);
        setId(res.data.id);
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
  const submit = async () => {
    if (!blogName || !summary) {
      Message.warning('请将信息填写完整');
      return;
    }
    if (uniqueId > 0 && url !== 0) {
      const res = await request.post('/article/update', {
        id,
        blogName,
        // title,
        summary,
        formatContent,
        topPriority,
        isCreative,
        columns: className,
        tags: tagName,
        Token: window.sessionStorage.getItem('token'),
      });
      // .then((res) => {
      Message.success('修改成功');
      console.log(res);
      setBlogName('');
      setTitle('');
      setContent('');
      setHtmlContent('');
      setTopPriority(0);
      setIsCreative(0);
      history.go(-1);
      return;
      // });
    }
    console.log({
      blogName,
      // title,
      summary,
      formatContent,
      topPriority,
      isCreative,
    });
    request
      .post('/article/add', {
        blogName,
        // title,
        summary,
        formatContent,
        columns: className,
        tags: tagName,
        topPriority,
        isCreative,
        // Token: window.sessionStorage.getItem('token'),
      })
      .then((res) => {
        if (res.data.success) {
          Message.success('添加成功');
          console.log(res);
          setBlogName('');
          setTitle('');
          setContent('');
          setHtmlContent('');
          setTopPriority(0);
          setIsCreative(0);
          history.go(-1);
        } else {
          Message.warning(res.data.msg);
        }
      });
  };

  const dataSource1 = [];
  const dataSource2 = [];

  function handleChangezhuanlan(value) {
    console.log(value);
    const tmp = className;
    tmp.push({
      className: value[value.length - 1],
      articleCount: 0,
    });
    setClassName(tmp);
    console.log(tmp);
  }

  function handleChangetag(value) {
    console.log('value', value);
    const tmp = [];
    value.forEach((item) => {
      tmp.push({
        tagName: item,
        articleCount: 0,
      });
    });
    // const tmp = tagName;
    // tmp.push({
    //   tagName: value[value.length - 1],
    //   articleCount: 0,
    // });
    setTagName(tmp);
    console.log('tmp', tmp);
  }
  return (
    <div>
      <Box direction="row" align="center" padding={10} className="box">
        <Input
          addonTextBefore="博客名称"
          size="medium"
          value={blogName}
          maxLength={100}
          onChange={onChangeBlogName}
          hasLimitHint
          style={{ width: '49%', paddingLeft: '-2%' }}
          aria-label="style width 400"
        />
        {/* <div className={styles.switch}> */}
        <Switch
          checkedChildren="置顶"
          className={styles.largeWidth}
          onChange={onChangetopPriority}
          unCheckedChildren="不置顶"
          checked={topPriority ? 1 : 0}
        />
        <Switch
          checkedChildren="原创"
          className={styles.largeWidth}
          onChange={onChangeisCreative}
          unCheckedChildren="非原创"
          checked={isCreative ? 1 : 0}
        />
        {/* </div> */}
      </Box>

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
      {/* <div style={{ marginLeft: '-1%' }}></div> */}
      <Box direction="row" justify="flex-start" padding={10}>
        <div style={{ lineHeight: '30px' }}>
          专栏：
          {defLan.length !== 0 && (
            <Select
              aria-label="tag mode"
              mode="tag"
              defaultValue={defLan}
              onChange={handleChangezhuanlan}
              dataSource={allLan}
              style={{ width: 300 }}
            />
          )}
          {defLan.length === 0 && (
            <Select
              aria-label="tag mode"
              mode="tag"
              defaultValue={[]}
              onChange={handleChangezhuanlan}
              dataSource={allLan}
              style={{ width: 300 }}
            />
          )}
        </div>
        <div style={{ width: '37vh' }}></div>
        <div style={{ lineHeight: '30px' }}>
          标签：
          {defaultTagV.length !== 0 && (
            <Select
              aria-label="tag mode"
              mode="tag"
              defaultValue={defaultTagV}
              onChange={handleChangetag}
              dataSource={allTag}
              style={{ width: 300 }}
            />
          )}
          {defaultTagV.length === 0 && (
            <Select
              aria-label="tag mode"
              mode="tag"
              defaultValue={[]}
              onChange={handleChangetag}
              dataSource={allTag}
              style={{ width: 300 }}
            />
          )}
        </div>
      </Box>
      <Box direction="row" justify="center" padding={20}>
        <Button type="primary" onClick={submit}>
          提交
        </Button>
        <div style={{ width: '6vh' }}></div>
        <Button
          type="primary"
          warning
          // style={{ marginLeft: '0%' }}
          onClick={() => {
            history.go(-1);
          }}
        >
          返回
        </Button>
      </Box>
    </div>
  );
};

export default EditorBlock;
