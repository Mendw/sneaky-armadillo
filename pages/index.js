import styles from '../styles/inicio.module.css'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

//TODO: Make responsive, fix spacing 

export default function Index (props) {
    return (
        <React.Fragment>
            <div className={styles.index_wrapper}>
                <div className={styles.greeting}>
                    <div className={styles.contact}>
                        <a 
                            href="https://www.instagram.com/hoshimangas.ve/"
                            target="_blank">
                            <Image width={35} height={35} src="/img/inicio/instagram.webp" alt="Instagram Logo"/>
                        </a>
                        <a 
                            href="https://vm.tiktok.com/ZMdW7b4DE/"
                            target="_blank">
                            <Image width={35} height={35} src="/img/inicio/tiktok.webp" alt="TikTok Logo"/>
                        </a>
                        <a 
                            href="https://wa.me/584126952570"
                            target="_blank">
                            <Image width={35} height={35} src="/img/inicio/whatsapp.webp" alt="Whatsapp Logo"/>
                        </a>
                    </div>
                    <div className={styles.greeting_content}>
                        <h1>Bienvenide a Hoshi</h1>
                        <span>Somos una tienda en línea de Mangas, Cómics, Ropa y Accesorios.</span>
                        <div className={styles.greeting_actions}>
                            <Link href="/sobre-nosotros">
                              <a className={styles.aboutUs}>
                                <span>Leer más</span>
                              </a>
                            </Link>
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
                                    <span>Texto calientabanca. Acá van las noticias. Prueba prueba.</span>
                                </div>
                                <div className={styles.update}>
                                    <span>30/06/21 - Sacamos nueva mercancía! Mentira esto tambien es una prueba.</span>
                                </div>
                            </div>
                            {/*
                            <div className={styles.discounts}>
                                <h1>Ofertas</h1>
                                <div className={styles.discounts_content}>
                                    <div className={styles.item}>
                                        <Image width={120} height={144} src="/img/catalogo/placeholder.webp" alt="ph"></Image>
                                        <span>-25%</span>
                                    </div>
                                    <div className={styles.item}>
                                        <Image width={120} height={144} src="/img/catalogo/placeholder.webp" alt="ph"></Image>
                                        <span>-30%</span>
                                    </div>
                                    <div className={styles.item}>
                                        <Image width={120} height={144} src="/img/catalogo/Tixp3OWR.jpeg" alt="ph"></Image>
                                        <span>-25%</span>
                                    </div>
                                    <div className={styles.item}>
                                        <Image width={120} height={144} src="/img/catalogo/placeholder.webp" alt="ph"></Image>
                                        <span>-30%</span>
                                    </div>
                                    <div className={styles.item}>
                                        <Image width={120} height={144} src="/img/catalogo/placeholder.webp" alt="ph"></Image>
                                        <span>-25%</span>
                                    </div>
                                    <div className={styles.item}>
                                        <Image width={120} height={144} src="/img/catalogo/placeholder.webp" alt="ph"></Image>
                                        <span>-30%</span>
                                    </div>
                                </div>
                            </div>*/}
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
        </React.Fragment>
    )
}   