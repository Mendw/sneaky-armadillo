import Head from 'next/head'
import { NavLink } from './navlink'
import Link from 'next/link';

import styles from '../styles/layout.module.css'
import { SessionContext } from '../lib/session';
import { useContext } from 'react';

export default function Layout({ children }) {
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
                                <Link href="/carrito">
                                    <a>  
                                        <div className={styles.cart_container}>
                                            <div className={styles.cart_handle}></div>
                                            <div className={styles.cart_box}>
                                                <div className={styles.cart_divider}></div>
                                                <div className={styles.cart_ammount}>0</div>
                                            </div>
                                        </div>
                                    </a>
                                </Link>
                                <Link href="/ingreso">
                                    <a>
                                        <div className={styles.login_link}>
                                            <span className={styles.login_link_letter}>/</span>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.header_bottom}>
                            <div className={styles.header_bottom_wrapper}>
                                <span className={styles.header_bottom_separator}></span>
                                <NavLink href="/catalogo" className={styles.header_bottom_link} activeClassName={styles.active}>CATÁLOGO</NavLink>
                                <NavLink href="/sobre-nosotros" className={styles.header_bottom_link} activeClassName={styles.active}>SOBRE NOSOTROS</NavLink>
                                <NavLink href="/pedidos" className={styles.header_bottom_link} activeClassName={styles.active}>PEDIDOS</NavLink>
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