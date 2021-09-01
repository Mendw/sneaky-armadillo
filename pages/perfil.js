import styles from '../styles/perfil.module.css'
import useUser from '../lib/useUser';

import Image from 'next/image'

import providers from '../lib/providers';
import { useRouter } from 'next/router';
import { basepath } from '../lib/utils';
import { useState } from 'react';

import Spinner from '../components/spinner';

function ProfileLoading() {
    return (
        <>
            <h1>Hola, Usuario</h1>
            <div className={styles.profile_content}>
                <h2>Cargando su perfil</h2>
                <Spinner className={styles.spinner}/>
            </div>
        </>
    )
}

function capitalizeString(str) {
    return str.split(' ').map(word => Boolean(word) ? word[0].toUpperCase() + word.slice(1) : '').join(' ')
}

export default function Profile() {
    const { user, mutateUser } = useUser({ redirectTo: "/ingreso" });
    const [canClick, setCanClick] = useState(true)

    let router = useRouter()
    let profile_content

    if(user && user.profile) { 
        profile_content = <>
            <h1>Hola, {user.profile.name}</h1>
            <div className={styles.profile_content}>
                <h2>Actividad Reciente</h2>
                <div className={styles.account_activity}>
                    <div className={styles.no_activity}>No parece haber nada aquí</div>
                </div>
                <details className={styles.authMethods}>
                    <summary>Métodos de Autenticación</summary>
                    <div className={styles.providers}> {providers.map((provider, index) => {
                        let provider_connected = user.profile.accounts.includes(provider.name);
                        let [class_, text, func] = provider_connected ? [styles.connected, 'Desconectar', async () => {
                            if(user.profile.accounts.length > 1) {
                                let {error, ...user} = await fetch(`${basepath}/api/auth/unlink/${provider.name}`).then(res => res.json())
                                if(error) console.error(error) 
                                else {
                                    mutateUser(user).then(setCanClick(true))
                                }
                            }
                        }] : [styles.not_connected, `Conectar`, async () => {
                            let {error, redirectURL} = await fetch(`${basepath}/api/auth/link/${provider.name}`).then(res => res.json())
                            if(error) console.error(error)
                            else {
                                router.push(redirectURL)
                            }
                        }];
                        return (
                            <div className={[styles.provider, styles[provider.name]].join(' ')} key={index}>
                                <div className={styles.provider_logo_wrapper}>
                                    <div className={styles.provider_logo}>
                                        <Image src={provider.logo} height={30} width={30} alt=""></Image>
                                    </div>
                                    {capitalizeString(provider.name)}
                                </div>
                                <div className={styles.provider_action}>
                                    <button className={[class_, styles.connect_button].join(' ')} disabled={!canClick} onClick={() => {
                                        setCanClick(false)
                                        func()
                                    }}>
                                        {text}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                </details>
            </div>  
                    
            <button disabled={!canClick} className={styles.logout} onClick={async () => {
                setCanClick(false)
                mutateUser(await fetch('/api/logout', {method: 'POST'}))}}>
                Cerrar Sesión
            </button>
        </>
    } else {
        profile_content = <ProfileLoading/>
    }

    return (
        <div className={styles.profile_wrapper}>
            <div className={styles.profile}>
                {profile_content}
            </div>
        </div>
    )
}