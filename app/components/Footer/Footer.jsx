import styles from './_Footer.scss';
import React from 'react';
import pkg from '../../../package.json';

export default class Footer extends React.Component {
  render() {
    var year = (new Date()).getFullYear();
    return (
      <footer className={styles.footer}>
        <strong>&copy; Deepcobalt&nbsp;{year} &nbsp;v{pkg.version}</strong>
      </footer>
    );
  }
}
