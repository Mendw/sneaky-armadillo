import styles from '../styles/ingreso.module.css'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import useUser from '../lib/useUser'

import providers from '../lib/providers';
import { useRouter } from 'next/router'

export default function Login() {
    useUser({ redirectTo: "/perfil", redirectIfFound: true })
    let router = useRouter()

    return (
        <>
            <Head>
                <title>Ingreso | Hoshi Mangas</title>
            </Head>
            <div className={styles.login_wrapper}>
                <div className={styles.login}>
                    <h2 className={styles.login_title}>Ingreso</h2> { 
                    providers.map((provider, index) => { return (
                        <button className={[styles.login_option, styles[provider.name]].join(' ')} key={index} onClick={async () => {
                            let {error, redirectURL} = await fetch(`/api/auth/login/${provider.name}`).then(res => res.json())
                            if(error) console.error(error)
                            else {
                                router.push(redirectURL)
                            }
                        }}>
                            <Image src={provider.logo} width={30} height={30} className={styles.login_option_logo} alt={provider.name}/>
                            <span>{provider.loginText}</span>
                        </button>
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