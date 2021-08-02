import styles from '../styles/ingreso.module.css'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { basepath } from '../lib/utils'
import f_logo from '../public/img/ingreso/f_logo.png'
import g_logo from '../public/img/ingreso/g_logo.png'

import { createHash } from 'crypto'

function buildURL(remoteURL, callbackEndpoint, client_id, csrfToken) {
    let basepath = process.env.NODE_ENV === 'production' ?  "https://www.hoshimangas.com" : "http://localhost:3000"

    let apiLocation = "/api/auth/callback/"
    return remoteURL + [
        `client_id=${client_id}`,
        `redirect_uri=${basepath}${apiLocation}${callbackEndpoint}`,
        'response_type=code',
        'scope=openid profile',
        `state=${csrfToken}|${createHash('sha256').update(`${csrfToken}${process.env.CSRF_SECRET}`).digest('hex')}`
    ].join('&')
}

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
                </div>
            </div>
        </>
    )
}