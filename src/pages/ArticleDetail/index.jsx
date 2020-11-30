import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import PageHeader from '@/components/PageHeader';
import BasicList from './components/ArticleBlock';

const { Cell } = ResponsiveGrid;

const ArticleDetail = () => {
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
      </Cell>

      <Cell colSpan={12}>
        <BasicList />
      </Cell>
    </ResponsiveGrid>
  );
};

export default ArticleDetail;
