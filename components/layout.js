import Head from 'next/head'
import { NavLink } from './navlink'
import Link from 'next/link';

import styles from '../styles/layout.module.css'
import { useState } from 'react';

export default function Layout({ children }) {
    let [nItems, setNItems] = useState('0')
    
    return (
        <>
            <div className={styles.nonFooter_wrapper}>
                <header className={styles.header}>
                    <div className={styles.header_wrapper}>
                        <div className={styles.header_top}>
                            <div className={styles.header_separator}></div>
                            <Link exact href="/">
                                <a className={styles.logo}>
                                    <span className={styles.logo_kanji}>星</span>
                                    <span className={styles.logo_text}>HOSHI</span>
                                </a>
                            </Link>
                            <div className={styles.header_topRight}>
                                <Link href="/ingreso">
                                    <a>
                                        <div className={styles.login_link}>
                                            <span className={styles.login_link_letter}>{'>'}</span>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.header_bottom}>
                            <div className={styles.header_bottom_wrapper}>
                                <span className={styles.header_bottom_separator}></span>
                                <NavLink href="/catalogo" className={styles.header_bottom_link} activeClassName={styles.active}>CATÁLOGO</NavLink>
                                <NavLink href="/pedidos" className={styles.header_bottom_link} activeClassName={styles.active}>PEDIDOS</NavLink>
                                <NavLink href="/carrito" className={styles.header_bottom_link} activeClassName={styles.active}>CARRITO ({nItems})</NavLink>
                                <span className={styles.header_bottom_separator}></span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className={styles.main}>
                    {children}
                </main>
            </div>
            <footer className={styles.footer}>
                <p></p>
            </footer>
        </>
    )
}