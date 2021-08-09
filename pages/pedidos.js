import styles from '../styles/pedidos.module.css'
import Head from 'next/head'

import useUser from '../lib/useUser';

export default function Orders() {
    const { user } = useUser({ redirectTo: "/ingreso" });

    return (
        <>
            <Head>
                <title>Realizar un pedido</title>
            </Head>
            <div className={styles.pedidos}>
                test
            </div>
        </>
    )
}