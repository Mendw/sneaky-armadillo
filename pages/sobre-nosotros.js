import Head from 'next/head'
import styles from '../styles/development.module.css'

export default function AboutUs(props) {

    return (
        <>
            <Head>
                <title>En construcción | Hoshi Mangas</title>
            </Head>
            <div className={styles.container}>
                <span className={styles.emoji}>⚠️</span>
                <h1>
                    En construcción 
                </h1>
            </div>
        </>
    )
}