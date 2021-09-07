import styles from '../styles/perfil.module.css'
import useUser from '../lib/useUser';

import Image from 'next/image'

import providers from '../lib/providers';
import { useRouter } from 'next/router';
import { basepath } from '../lib/utils';
import { useState } from 'react';

import VE from './venezuela.json'

import Spinner from '../components/spinner';

function capitalizeString(str) {
    return str.split(' ').map(word => Boolean(word) ? word[0].toUpperCase() + word.slice(1) : '').join(' ')
}

function ProfileLoading() {
    return (
        <div className={styles.profile_loading}>
            <h1>Hola, Usuario</h1>
            <div className={styles.profile_info}>
                <h2>Cargando su perfil</h2>
                <Spinner className={styles.spinner}/>
            </div>
        </div>
    )
}

function AuthMethods(props) {
    let router = useRouter()

    const {
        user,
        mutateUser,
        canClick,
        setCanClick
    } = props

    return (
        <details className={styles.authMethods}>
            <summary>Métodos de Autenticación</summary>
            <p>Estas son las maneras en las que puedes ingresar a tu cuenta de Hoshi.</p>
            <div className={styles.providers}> {providers.map((provider, index) => {
                let provider_connected = user.profile.accounts.includes(provider.name);
                let isDisabled = !canClick || provider_connected && user.profile.accounts.length < 2
                let [class_, text, func] = provider_connected ? 
                    [styles.connected, 'Desconectar', async () => {
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
                            <button className={[class_, styles.connect_button].join(' ')} disabled={isDisabled} onClick={() => {
                                setCanClick(false)
                                func()
                            }}>
                                {text}
                            </button>
                        </div>
                    </div>
                )})}
            </div>
        </details>
    )
}

function AddressForm(props) {
    const [selectedState, setSelectedState] = useState(props.address?.state || undefined)

    return (
        <form className={styles.address_form} onSubmit={ ev => {
            ev.preventDefault()
            
            let data = new FormData(ev.target)
            for(let datum of data) {
                console.log(datum)
            }
        }}>
            <div className={styles.form_input}>
                <label htmlFor="form_name">Nombre<span className={styles.required_mark}>*</span></label>
                <input type="text" name="name" placeholder="Nombre completo" required={true} id="form_name"/>
            </div>
            <div className={styles.form_input}>
                <label htmlFor="form_address">Dirección<span className={styles.required_mark}>*</span></label>
                <input type="text" name="address_1" placeholder="Línea 1" required={true} id="form_address"/>
                <input type="text" name="address_2" placeholder="Línea 2 (Opcional)"/>
            </div>
            <div className={styles.form_group}>
                <div className={styles.form_input}>
                    <label htmlFor="form_state">Estado<span className={styles.required_mark}>*</span></label>
                    <select id="form_state" name="state" defaultValue="" required={true} onChange={(ev) => {
                        setSelectedState(ev.target.value)
                    }}>
                        <option disabled={true} value="">Seleccione un estado</option>
                        {
                            Object.keys(VE).sort().map((state, index) => {
                                return <option value={state} key={index}>{state}</option>
                            })
                        }
                    </select>
                </div>
                <div className={styles.form_input}>
                    <label htmlFor="form_city">Ciudad<span className={styles.required_mark}>*</span></label>
                    <select id="form_city" name="city" defaultValue="" disabled={selectedState === undefined} required={true}>
                        <option disabled={true} value="">Seleccione una ciudad</option>
                        {
                            selectedState && VE[selectedState].map((city, index) => {
                                return <option value={city} key={index}>{city}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className={styles.form_input}>
                <label htmlFor="form_phone">Número de Teléfono</label>
                <input id="form_phone" type="text" placeholder="04120000000 (11 Números)" name="phone" required={true}/>
            </div>
            <div className={styles.form_actions}>
                <input type="button" value="Cancelar" onClick={props.action}/>
                <input type="submit" value="Guardar" className={styles.submit_button}/>
            </div>
        </form>
    )

}

function DisplayAddress(props) {
    let { address } = props

    if(address) {
        return (
            <div className={styles.address}>
                <span>{address.name}</span>
                <span>{`${address.address_line_1} ${address.address_line_2??``}`.trim()}</span>
                <span>{`${address.state} ${address.city}`}</span>
                { address.phone && <span>${address.phone}</span> }
                <button className={styles.address_edit_button} onClick={props.action}>Editar</button>
            </div>
        )
    } else {
        return (
            <div className={styles.address}>
                <span className={styles.no_address}>No ha registrado una dirección de envío</span>
                <button className={styles.address_edit_button} onClick={props.action}>Agregar</button>
            </div>
        )
    }
}


export default function Profile() {
    const { user, mutateUser } = useUser({ redirectTo: "/ingreso" });
    const [canClick, setCanClick] = useState(true)
    const [editForm, setEditForm] = useState(false)
    
    let profile_content
    
    if(user && user.profile) {
        let address = user.profile.address

        profile_content = <>
            <div className={styles.greeting}>
                <h1>Hola, {user.profile.name}</h1>
                <button disabled={!canClick} className={styles.logout} onClick={async () => {
                    setCanClick(false)
                    mutateUser(await fetch('/api/logout', {method: 'POST'}))}}>
                    Cerrar Sesión
                </button>
            </div>
            <details className={styles.address_wrapper} open={true}>
                <summary>Dirección de envío</summary>
                {
                    editForm ? (
                        <AddressForm data={address} action={() => setEditForm(false)}/>
                    ) : (
                        <DisplayAddress data={address} action={() => setEditForm(true)}/>
                    )
                }
            </details>
            <AuthMethods user={user} mutateUser={mutateUser} canClick={canClick} setCanClick={setCanClick}/>
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