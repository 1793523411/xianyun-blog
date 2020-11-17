import React, { useState } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import PageNav from './components/PageNav';
import GlobalSearch from './components/GlobalSearch';
import Notice from './components/Notice';
import SolutionLink from './components/SolutionLink';
import HeaderAvatar from './components/HeaderAvatar';
import Logo from './components/Logo';
import Footer from './components/Footer';

(function () {
  const throttle = function (type, name, obj = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize');
  }
})();

export default function BasicLayout({ children }) {
  const getDevice = (width) => {
    const isPhone =
      typeof navigator !== 'undefined' && navigator && navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    } else if (width < 1280 && width > 680) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  const [device, setDevice] = useState(getDevice(NaN));

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && e.target.innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  return (
    <ConfigProvider device={device}>
      <Shell
        type="brand"
        style={{
          minHeight: '100vh',
        }}
      >
        <Shell.Branding>
          <Logo
            image="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602131927458&di=6799058154d372a49c741986be041110&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F17%2F03%2F26%2Fcafc6ea253bc2ebc78918dc44c8671c7.jpg"
            text="闲云"
          />
        </Shell.Branding>
        <Shell.Navigation
          direction="hoz"
          style={{
            marginRight: 10,
          }}
        >
          <GlobalSearch />
        </Shell.Navigation>
        <Shell.Action>
          <Notice />
          <SolutionLink />
          <HeaderAvatar />
        </Shell.Action>
        <Shell.Navigation>
          <PageNav />
        </Shell.Navigation>

        <Shell.Content>{children}</Shell.Content>
        <Shell.Footer>
          <Footer />
        </Shell.Footer>
      </Shell>
    </ConfigProvider>
  );
}
