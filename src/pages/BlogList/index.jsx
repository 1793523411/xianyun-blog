import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import PageHeader from '@/components/PageHeader';
import BlogListBlock from './components/BlogListblock';

const { Cell } = ResponsiveGrid;

const BlogList = () => {
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <PageHeader
          title="文章列表"
          breadcrumbs={[
            {
              name: '文章管理',
            },
            {
              name: '文章列表',
            },
          ]}
          description=""
        />
      </Cell>

      <Cell colSpan={12}>
        <BlogListBlock />
      </Cell>
    </ResponsiveGrid>
  );
};

export default BlogList;
