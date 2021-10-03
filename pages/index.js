import styles from '../styles/inicio.module.css'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import hoshiLogo from '../public/logo.webp'
import tiktokLogo from '../public/img/inicio/tiktok.webp'
import instagramLogo from '../public/img/inicio/instagram.webp'
import whatsappLogo from '../public/img/inicio/whatsapp.webp'

export default function Index (props) {    
    return (
        <>
            <div className={styles.index_wrapper}>
                <div className={styles.greeting}>
                    <div className={styles.hoshi_logo_wrapper}>
                        <Image 
                            src={hoshiLogo}
                            className={styles.hoshi_logo}

                            width={220}
                            height={220}

                            alt=''
                        />
                    </div>
                    <div className={styles.contact}>
                        <a 
                            href="https://www.instagram.com/hoshimangas.ve/"
                            target="_blank"
                            rel="noreferrer">
                            <Image width={35} height={35} src={instagramLogo} alt="Instagram Logo"/>
                        </a>
                        <a 
                            href="https://vm.tiktok.com/ZMdW7b4DE/"
                            target="_blank"
                            rel="noreferrer">
                            <Image width={35} height={35} src={tiktokLogo} alt="TikTok Logo"/>
                        </a>
                        <a 
                            href="https://wa.me/584126952570"
                            target="_blank"
                            rel="noreferrer">
                            <Image width={35} height={35} src={whatsappLogo} alt="Whatsapp Logo"/>
                        </a>
                    </div>
                    <div className={styles.greeting_content}>
                        <h1>Bienvenidos a Hoshi</h1>
                        <span>Somos una tienda en línea de Mangas, Ropa y Accesorios. Hacemos envíos a toda Venezuela.</span>
                        <div className={styles.greeting_actions}>
                            <Link href="/catalogo">
                              <a className={styles.catalogue}>
                                <span>Empezar a comprar</span>
                              </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.information}>
                    <div className={styles.information_overlay}></div>
                    <div className={styles.information_wrapper}>
                        <div className={styles.information_content}>
                            <div className={styles.updates}>
                                <h1>Noticias</h1>
                                <div className={styles.update}>
                                    <span>Preventa de Tokyo Revengers Vol. 1 en Español: Comienza el 10 de Octubre.</span>
                                </div>
                                <div className={styles.update}>
                                    <span>¡Death Note Vol. 1 y 2 en disponibilidad inmediata!</span>
                                </div>
                                <div className={styles.update}>
                                    <span>Pronto a la venta: todos los volúmenes de Chainsaw Man</span>
                                </div>
                            </div>
                            <div className={styles.information_separator}></div>
                            <div className={styles.payment_methods}>
                                <h1>Métodos de Pago</h1>
                                <div className={styles.payment_methods_content}>
                                    <div className={styles.payment_method}>
                                        <Image width={60} height={60} src="/img/inicio/payment/pago-movil.png" alt="" />
                                        <span>Pago Móvil</span>
                                    </div>
                                    <div className={styles.payment_method}>
                                        <Image width={60} height={60} src="/img/inicio/payment/transfer.png" alt="" />
                                        <span>Transferencia</span>
                                    </div>
                                    <div className={styles.payment_method}>
                                        <Image width={60} height={60} src="/img/inicio/payment/paypal.png" alt="" />
                                        <span>Paypal</span>
                                    </div>
                                    <div className={styles.payment_method}>
                                        <Image width={60} height={60} src="/img/inicio/payment/reserve.png" alt="" />
                                        <span>Reserve</span>
                                    </div>
                                    <div className={styles.payment_method}>
                                        <Image width={60} height={60} src="/img/inicio/payment/binance.png" alt="" />
                                        <span>Criptomonedas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}   