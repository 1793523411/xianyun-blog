import React, { useEffect, useState } from 'react';

function AuthBlock() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    // window.location.href = 'http://openapi.xianyun.site/xianyun-consumer/open/oauth/login/gitee';
    window.location.href = 'http://ice-blog.ygjie.icu/#/user/success?a=1&b=2&token=1111';
  }, []);

  console.log(window.location);
  return <div>这是授权页</div>;
}

export default AuthBlock;
