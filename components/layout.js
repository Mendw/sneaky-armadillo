import { NavLink } from './navlink'
import Link from 'next/link';

import styles from '../styles/layout.module.css'
import useUser from '../lib/useUser'

export default function Layout({ children }) {
    let { user } = useUser()
    let userLoaded = user && 'isLoggedIn' in user

    let cartAmmount = 0
    if(userLoaded && user.isLoggedIn === true && user.profile && 'cart' in user.profile) {
        for(const productId in user.profile.cart) {
            cartAmmount += user.profile.cart[productId]
        }
    }

    let innerProfileLink = <a>
        <div className={styles.login_link}>
            <span className={styles.login_link_letter}>{userLoaded ? user.isLoggedIn ? user.profile.name[0].toUpperCase() : '>' : '~'}</span>
        </div>
    </a>

    return (
        <>
            <div className={styles.nonFooter_wrapper}>
                <header className={styles.header}>
                    <div className={styles.header_wrapper}>
                        <div className={styles.header_top}>
                            <div className={styles.header_separator}></div>
                            <Link href="/">
                                <a className={styles.logo}>
                                    <span className={styles.logo_kanji}>星</span>
                                    <span className={styles.logo_text}>HOSHI</span>
                                </a>
                            </Link>
                            <div className={styles.header_topRight}>
                                {userLoaded && <Link href={user.isLoggedIn ? '/perfil' : '/ingreso'}>{innerProfileLink}</Link>}
                                {!userLoaded && <div>{innerProfileLink}</div>}
                            </div>
                        </div>
                        <div className={styles.header_bottom}>
                            <div className={styles.header_bottom_wrapper}>
                                <span className={styles.header_bottom_separator}></span>
                                <NavLink href="/catalogo" className={styles.header_bottom_link} activeClassName={styles.active}>CATÁLOGO</NavLink>
                                <NavLink href="/carrito" className={styles.header_bottom_link} activeClassName={styles.active}>CARRITO ({cartAmmount})</NavLink> {/** userHasCart ? user.profile.cart.items.length :  */}
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
                <div className={styles.footer_content}>
                    <Link href="/privacidad">Política de Privacidad</Link>
                </div>
            </footer>
        </>
    )
}