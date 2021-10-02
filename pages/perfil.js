import styles from '../styles/perfil.module.css'
import useUser from '../lib/useUser';

import Button from '../components/button';

import Image from 'next/image'
import buttonStyles from '../styles/button.module.css'

import providers from '../lib/providers';
import { useRouter } from 'next/router';
import { basepath } from '../lib/utils';
import { useEffect, useState } from 'react';

import editIcon from '../public/img/perfil/edit.webp'
import deleteIcon from '../public/img/perfil/delete.webp'

import Spinner from '../components/spinner';
import VE from '../lib/VE.json'

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
                            <Button className={[class_, styles.connect_button].join(' ')} disabled={isDisabled} onClick={() => {
                                setCanClick(false)
                                func()
                            }}>
                                {text}
                            </Button>
                        </div>
                    </div>
                )})}
            </div>
        </details>
    )
}

function AddressForm(props) {
    const { address, updateAddress } = props 
    const [ addressType, setAddressType ] = useState(address?.type || undefined)
    const [ selectedState, setSelectedState ] = useState(address?.state || "")

    if(addressType === undefined) {
        return (
            <div className={styles.addressTypeSelect_wrapper}>
                <span className={styles.addressTypeSelect_title}>Tipo de dirección</span>
                <div className={styles.addressTypeSelect}>
                    <div className={styles.addressOption}>
                        <h3>Local</h3>
                        <p>Para envíos dentro de Ciudad Guayana ingrese una dirección local.</p>
                        <Button onClick={() => setAddressType('local')}>Seleccionar</Button>
                    </div>
                    <div className={styles.addressOption}>
                        <h3>Nacional</h3>
                        <p>Para envíos nacionales ingrese la dirección de la oficina de envíos de su preferencia</p>
                        <Button onClick={() => setAddressType('national')}>Seleccionar</Button>
                    </div>
                </div>
                <Button className={styles.cancel_button} onClick={props.cancel}>Cancelar</Button>
            </div>
        )
    }

    return (
        <form className={styles.address_form} onSubmit={ ev => {
            ev.preventDefault()
            let formData = new FormData(ev.target)
            
            let data = {}
            for(let datum of formData) {
                data[datum[0]] = datum[1]
            }

            updateAddress(data)
        }}>
            <input type="hidden" name="type" value={addressType}/>
            <div className={styles.form_input}>
                <label htmlFor="form_name">Nombre</label>
                <input className={styles.address_form_input} defaultValue={address?.name || ''} type="text" name="name" placeholder='Nombre completo' required={true} id="form_name"/>
            </div>
            {
                addressType === 'local' ? <>
                <div className={styles.form_input}>
                    <label htmlFor="form_address">Dirección</label>
                    <input className={styles.address_form_input} defaultValue={address?.address_1 || ''} type="text" name="address_1" placeholder="Línea 1" required={true} minLength={5} id="form_address"/>
                    <input className={styles.address_form_input} defaultValue={address?.address_2 || ''} type="text" name="address_2" placeholder="Línea 2 (Opcional)"/>
                </div>
            </> : <>
            <div className={styles.form_group}>
                    <div className={styles.form_input}>
                        <label htmlFor="form_company">Empresa de envíos</label>
                        <select id="form_company" className={styles.address_form_input} name="company" defaultValue={address?.company || ''} required={true}>
                            <option disabled={true} value="">Seleccione una empresa</option>
                            <option value="mrw">MRW</option>
                            <option value="zoom">ZOOM</option>
                            <option value="tealca">TEALCA</option>
                        </select>
                    </div>
                    <div className={styles.form_input}>
                        <label htmlFor="form_company_code">Código</label>
                        <input id="form_company_code" className={styles.address_form_input} defaultValue={address?.company_code || ''} type="text" name="company_code" required={true} />
                    </div>
                </div>
                <div className={styles.form_group}>
                    <div className={styles.form_input}>
                        <label htmlFor="form_state">Estado</label>
                        <select id="form_state" className={styles.address_form_input} name="state" value={selectedState} required={true} onChange={(ev) => {
                            setSelectedState(ev.target.value)
                            document.getElementById('form_city').value = ""
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
                        <label htmlFor="form_city">Ciudad</label>
                        <select id="form_city" className={styles.address_form_input} defaultValue={address?.city || ''} name="city" required={true}>
                            <option disabled={true} value="">Seleccione una ciudad</option>
                            {
                                selectedState && VE[selectedState].map((city, index) => {
                                    return <option value={city} key={index}>{city}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </>
            }
            {
                addressType === 'national' && <div className={styles.form_input}>
                    <label htmlFor="form_nid">Número de Cédula</label>
                    <input defaultValue={address?.nid || ''} className={styles.address_form_input} type="text" name="nid" placeholder="Número de cédula" required={true} id="form_id"/>
                </div>
            }
            <div className={styles.form_input}>
                <label htmlFor="form_phone">Número de Teléfono<span className={styles.optional_mark}>(Opcional)</span></label>
                <input 
                    id="form_phone" 
                    type="text"
                    defaultValue={address?.phone || ''}
                    placeholder="11 Números" 
                    name="phone"
                    pattern="[0-9]{11}"
                    className={styles.address_form_input}
                    onInput={(ev) => {
                        ev.target.setCustomValidity('')
                        ev.target.checkValidity()
                    }}

                    onInvalid={(ev) => {
                        if(ev.target.value !== '') {
                            ev.target.setCustomValidity('El número de teléfono debe tener 11 Números')
                        }
                    }}/>
            </div>
            <div className={styles.form_actions}>
                <Button onClick={props.cancel}>Cancelar</Button>
                <input type="submit" value="Guardar" className={[buttonStyles.button_base, styles.submit_button].join(' ')}/>
            </div>
        </form>
    )

}

function DisplayAddress(props) {
    const { address, canClick } = props

    if(address) {
        return (
            <div className={styles.address}>
                <div className={styles.address_info}>
                    {console.log(address)}
                    <span className={styles.address_name}>{address.name}</span>
                    {
                        address.type === 'local' ? <>
                            <span>{`${address.address_1} ${address.address_2??``}`.trim()}</span>
                        </> : <>
                            <span>{`${address.company.toUpperCase()} ${address.company_code}`}</span>
                            <span>{`${address.city}, ${address.state}`}</span>
                        </>
                    }
                    { address.phone && <span>{address.phone}</span> }
                    { address.nid && <span>{address.nid}</span> }
                </div>
                <div className={styles.address_actions}>
                    <Button disabled={!canClick} className={styles.address_edit_button} onClick={props.editAddress}>
                        <Image src={editIcon} width={25} height={25} alt=""/>
                    </Button>
                    <Button disabled={!canClick} className={styles.address_delete_button} onClick={props.deleteAddress}>
                        <Image src={deleteIcon} width={25} height={25} alt=""/>
                    </Button>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.address}>
                <div className={styles.no_address}>
                    <p>No ha registrado una dirección de envío</p>
                    <Button className={styles.address_add_button} onClick={props.editAddress}>Agregar</Button>
                </div>
            </div>
        )
    }
}


export default function Profile() {
    const {user, mutateUser} = useUser({ redirectTo: "/ingreso" })
    const [address, setAddress] = useState(undefined)

    const [canClick, setCanClick] = useState(true)
    const [editForm, setEditForm] = useState(false)

    useEffect(() => {
        setAddress(user?.profile?.address)
    }, [user])

    function updateAddress(data) {
        setCanClick(false)

        setAddress(data === null ? undefined : data)
        setEditForm(false)

        let payload = { 
            address: data
        }

        fetch('/api/update-address', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
              },
        }).then(res => res.json()).then((data) => {
            if(data.user !== undefined) {
                mutateUser(data.user, true)
            }

            setCanClick(true)
        })
    }
    
    let profile_content
    
    if(user && user.profile) {
        profile_content = <>
            <div className={styles.greeting}>
                <h1>Hola, {user.profile.name}</h1>
                <Button disabled={!canClick} className={styles.logout} onClick={async () => {
                    setCanClick(false)
                    mutateUser(await fetch('/api/logout', {method: 'POST'}))}}>
                    Cerrar Sesión
                </Button>
            </div>
            <details className={styles.address_wrapper} open={true}>
                <summary>Dirección de envío</summary>
                {
                    editForm ? (
                        <AddressForm 
                            address={address} cancel={() => {setEditForm(false)}} 
                            updateAddress={updateAddress} 
                            setAddressType={(t) => setAddressType(t)}
                        />
                    ) : (
                        <DisplayAddress canClick={canClick} address={address} editAddress={() => setEditForm(true)} deleteAddress={() => updateAddress(null)}/>
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