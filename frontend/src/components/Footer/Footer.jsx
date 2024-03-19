import React from 'react';
import style from './Footer.module.css'; 

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContent}>
        <p>© 2024 Atlas Signature. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
