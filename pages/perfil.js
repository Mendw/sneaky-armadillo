import styles from '../styles/perfil.module.css'
import useUser from '../lib/useUser';

import Image from 'next/image'

import providers from '../lib/providers';
import { useRouter } from 'next/router';
import { basepath } from '../lib/utils';
import { useState } from 'react';

function ProfileLoading() {
    return (
        <>

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
            <div>
                <h2>Métodos de Autenticación</h2>
                <div className={styles.providers}>
                    {providers.map((provider, index) => {
                        let provider_connected = user.profile.accounts.includes(provider.name);
                        let [class_, text, func] = provider_connected ? ['connected', 'Desconectar', async () => {
                            if(user.profile.accounts.length > 1) {
                                let {error, ...user} = await fetch(`${basepath}/api/auth/unlink/${provider.name}`).then(res => res.json())
                                if(error) console.error(error) 
                                else {
                                    mutateUser(user).then(setCanClick(true))
                                }
                            }
                        }] : ['not_connected', `Conectar`, async () => {
                            router.push(`${basepath}/api/auth/link/${provider.name}`)
                        }];
                        return <div className={styles.provider_container} key={index}>
                            <div className={[styles.provider, styles[provider.name]].join(' ')}>
                                <Image src={provider.logo} width={50} height={50} className={styles.login_option_logo} alt={provider.name}/>
                                <span>{capitalizeString(provider.name)}</span>
                            </div>
                            <button disabled={!canClick || (user.profile.accounts.length < 2 && provider_connected)} className={[styles.connect_button, styles[class_]].join(' ')} onClick={async () => {
                                setCanClick(false)
                                func()
                            }}>{text}</button>
                        </div>
                    })}
                </div>
            </div>  

                    
            <button disabled={!canClick} className={styles.logout} onClick={async () => {
                setCanClick(false)
                mutateUser(await fetch('/api/logout', {method: 'POST'}))}}>
                Salir de su cuenta
            </button>
        </>
    } else {
        profile_content = <ProfileLoading/>
    }

    return (
        <div className={styles.profile}>
            <div className={styles.profile_content}>
                {profile_content}
            </div>
        </div>
    )
}