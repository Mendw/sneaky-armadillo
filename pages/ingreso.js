import styles from '../styles/ingreso.module.css'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import f_logo from '../public/img/ingreso/f_logo.png'
import g_logo from '../public/img/ingreso/g_logo.png'

export default function Login(props) {

    return (
        <>
            <Head>
                <title>Ingreso | Hoshi Mangas</title>
            </Head>
            <div className={styles.login_wrapper}>
                <div className={styles.login}>
                    <h2 className={styles.login_title}>Ingreso</h2>
                    <div className={[
                        styles.login_option,
                        styles.facebook
                    ].join(' ')}>
                        <Image src={f_logo} width={40} height={40} className={styles.login_option_logo}/>
                        <span>Continuar con Facebook</span>
                    </div>
                    <div className={[
                        styles.login_option,
                        styles.google
                    ].join(' ')}>
                        <Image src={g_logo} width={40} height={40} className={styles.login_option_logo}/>
                        <span>Continuar con Google</span>
                    </div>
                    <div className={styles.as_admin}>
                        <Link href="/admin">Continuar como admin</Link>
                    </div>
                </div>
            </div>
        </>
    )
}