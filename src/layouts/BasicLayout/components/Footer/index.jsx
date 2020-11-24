import React from 'react';
import styles from './index.module.scss';

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>
        闲云
      </span>
      <br />
      <span className={styles.copyright}>© 2020-现在 Java & ICE</span>
    </p>
  );
}
