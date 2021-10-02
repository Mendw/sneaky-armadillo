import styles from '../styles/inicio.module.css'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../components/button'

export default function Index (props) {    
    return (
        <>
            <div className={styles.index_wrapper}>
                <div className={styles.greeting}>
                    <div className={styles.contact}>
                        <a 
                            href="https://www.instagram.com/hoshimangas.ve/"
                            target="_blank"
                            rel="noreferrer">
                            <Image width={35} height={35} src="/img/inicio/instagram.webp" alt="Instagram Logo"/>
                        </a>
                        <a 
                            href="https://vm.tiktok.com/ZMdW7b4DE/"
                            target="_blank"
                            rel="noreferrer">
                            <Image width={35} height={35} src="/img/inicio/tiktok.webp" alt="TikTok Logo"/>
                        </a>
                        <a 
                            href="https://wa.me/584126952570"
                            target="_blank"
                            rel="noreferrer">
                            <Image width={35} height={35} src="/img/inicio/whatsapp.webp" alt="Whatsapp Logo"/>
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
                                    <span>02/10/21 - A las 4:16 AM. Hora en la que terminé. Tengo mucho sueño.</span>
                                </div>
                                <div className={styles.update}>
                                    <span>09/06/21 - Fecha en la que empecé a darle con ganas.</span>
                                </div>
                                <div className={styles.update}>
                                    <span> - Involucré primero a Alex, luego a Ana y al final a Kayla.</span>
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