import Head from 'next/head'
import { NavLink } from './navlink'

import styles from '../styles/layout.module.css'

export default function Layout({ children }) {

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Jost:wght@600&family=Roboto+Condensed:wght@700&display=swap" rel="stylesheet" /> 
            </Head>
            <div className={styles.nonFooter_wrapper}>
                <header className={styles.header}>
                    <div className={styles.header_wrapper}>
                        <div className={styles.header_top}>
                            <div className={styles.header_separator}></div>
                            <NavLink exact href="/" className={styles.logo}>
                                <span className={styles.logo_kanji}>星</span>
                                <span className={styles.logo_text}>HOSHI</span>
                            </NavLink>
                            <div className={styles.header_topRight}>
                                <NavLink href="/carrito">
                                    <div className={styles.cart_container}>
                                        <div className={styles.cart_handle}></div>
                                        <div className={styles.cart_box}>
                                            <div className={styles.cart_divider}></div>
                                            <div className={styles.cart_ammount}>0</div>
                                        </div>
                                    </div>
                                </NavLink>
                                <NavLink href="/ingreso">
                                    <div className={styles.login_link}>
                                        <span className={styles.login_link_letter}>/</span>
                                    </div>
                                </NavLink>
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