import React from 'react';
import { ResponsiveGrid, Icon } from '@alifd/next';
import PageHeader from '@/components/PageHeader';
import BasicList from './components/ArticleBlock';

import { useHistory } from 'ice';

const { Cell } = ResponsiveGrid;

const ArticleDetail = () => {
  const history = useHistory();

  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <PageHeader
          title=""
          breadcrumbs={[
            {
              name: '文章管理',
            },
            {
              name: '文章详情',
            },
          ]}
          description=""
        />
        <div onClick={() => history.go(-1)} style={{ cursor: 'pointer', marginTop: '2vh' }}>
          <Icon type="arrow-left" /> 返回
        </div>
      </Cell>

      <Cell colSpan={12}>
        <BasicList />
      </Cell>
    </ResponsiveGrid>
  );
};

export default ArticleDetail;
