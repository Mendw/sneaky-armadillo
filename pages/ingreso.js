import styles from '../styles/ingreso.module.css'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import useUser from '../lib/useUser'

import providers from '../lib/providers';

export default function Login() {
    useUser({ redirectTo: "/perfil", redirectIfFound: true })

    return (
        <>
            <Head>
                <title>Ingreso | Hoshi Mangas</title>
            </Head>
            <div className={styles.login_wrapper}>
                <div className={styles.login}>
                    <h2 className={styles.login_title}>Ingreso</h2> { 
                    providers.map((provider, index) => { return (
                        <Link href={`/api/auth/login/${provider.name}`} key={index}>
                            <a className={[styles.login_option, styles[provider.name]].join(' ')}>
                                <Image src={provider.logo} width={40} height={40} className={styles.login_option_logo} alt={provider.name}/>
                                <span>{provider.loginText}</span>
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