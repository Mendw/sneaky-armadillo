import styles from '../styles/ingreso.module.css'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import f_logo from '../public/img/ingreso/f_logo.png'
import g_logo from '../public/img/ingreso/g_logo.png'

export default function Login() {
    const providers = [
        {
            logo: f_logo,
            text: 'Continuar con Facebook',
            name: 'facebook',
        },
        {
            logo: g_logo,
            text: 'Continuar con Google',
            name: 'google',
        }
    ]
    return (
        <>
            <Head>
                <title>Ingreso | Hoshi Mangas</title>
            </Head>
            <div className={styles.login_wrapper}>
                <div className={styles.login}>
                    <h2 className={styles.login_title}>Ingreso</h2> { 
                    providers.map((provider, index) => { return (
                        <Link href={`/api/auth/social/${provider.name}`} key={index}>
                            <a className={[styles.login_option, styles[provider.name]].join(' ')}>
                                <Image src={provider.logo} width={40} height={40} className={styles.login_option_logo} alt={provider.name}/>
                                <span>{provider.text}</span>
                            </a>
                        </Link>
                    )})}
                    <div className={styles.as_admin}>
                        <Link href={'/admin'}>
                            <a>Ingresar como Admin</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}