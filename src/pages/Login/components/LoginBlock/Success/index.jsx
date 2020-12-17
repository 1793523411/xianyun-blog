import React, { useEffect } from 'react';
import { useHistory } from 'ice';

function Success() {
  const history = useHistory();
  useEffect(() => {
    console.log(window.location);
    const query1 = getQueryVariable('token');
    console.log(query1);
    // history.push('/');
  }, []);

  function getQueryVariable(variable) {
    const query = window.location.hash.split('?')[1];
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  }

  return <div>这是成功页</div>;
}

export default Success;
