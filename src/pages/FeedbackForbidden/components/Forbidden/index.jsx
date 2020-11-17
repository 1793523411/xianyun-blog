import React from 'react';
import Exception from './components/Exception';

export default function Forbidden() {
  return (
    <Exception
      statusCode="403"
      image="https://img.alicdn.com/tfs/TB11TaSopY7gK0jSZKzXXaikpXa-200-200.png"
      description="token似乎失效了，请重新登录"
    />
  );
}
