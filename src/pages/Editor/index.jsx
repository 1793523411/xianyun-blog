import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import PageHeader from '@/components/PageHeader';
import SettingPersonBlock from './components/EditorBlock';

const { Cell } = ResponsiveGrid;

const Person = () => {
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <PageHeader
          title="编辑文章"
          breadcrumbs={[
            {
              name: '文章管理',
            },
            {
              name: '编辑文章',
            },
          ]}
        />
      </Cell>

      <Cell colSpan={12}>
        <SettingPersonBlock />
      </Cell>
    </ResponsiveGrid>
  );
};

export default Person;
