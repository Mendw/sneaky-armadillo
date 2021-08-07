import Head from 'next/head'
import styles from '../styles/privacidad.module.css'

export default function AboutUs() {
    return (
        <>
            <Head>
                <title>Sobre Nosotros | Hoshi</title>
            </Head>
            <div className={styles.privacy_wrapper}>
                <div className={styles.privacy}>
                    <h2>Política de Privacidad</h2>
                    <p>Hoshi Mangas, accesible visitando https://www.hoshimangas.com, proporciona esta política de privacidad para describir la manera en que recolecta, usa, comparte y almacena la información personal de los usuarios.</p>
                    <p>Esta política de privacidad se aplica únicamente a la información recolectada mediante el uso del sitio web.</p>
                    
                    <h3>Información recolectada y su uso</h3>
                    <div className={styles.subparragraph}>
                        <p>Hoshi Mangas recolecta información personal que puede ser usada para identificarlo como individuo solo cuando nos proporciona dicha información directamente.</p>
                        <p>Al registrarse usando un proveedor de identidad social, Hoshi Mangas recibe información que puede incluir su nombre, dirección de correo electrónico y otros datos que haya compartido con el proveedor de identidad social y que haya aceptado compartir con nosotros.</p>
                        <p>La información personal recolectada nos permite proveer un mejor servicio y brindar una mejor experiencia de usuario.</p>
                    </div>

                    <h3>Archivos de Registro</h3>
                    <div className={styles.subparragraph}>
                        <p>Hoshi Mangas sigue un procedimiento estándar de uso de archivos de registro. Estos archivos almacenan información anónima de los visitantes de un sitio web. Todas las empresas de alojamiento hacen esto como parte de las estadísticas de análisis de los servicios de alojamiento.</p>
                        <p>La información recopilada en los archivos de registro incluye direcciones de protocolo de Internet (IP), el tipo de navegador que utiliza el visitante, su proveedor de servicios de Internet (ISP), la fecha y hora en que visitan la página, la página desde la cual llegaron al sitio web, la página hacia la cual salieron y posiblemente el número de clics que realizaron.</p>
                        <p>Estos datos no están vinculados a ninguna información personal de los usuarios del sitio web. El propósito del registro de estos datos es analizar las tendencias, administrar el sitio web, realizar un seguimiento del movimiento de los usuarios a través del sitio web y recopilar información demográfica.</p>
                    </div>

                    <h3>Cookies</h3>
                    <div className={styles.subparragraph}>
                        <p>Hoshi Mangas usa cookies, tanto temporales como persistentes, para acelerar el proceso de autenticación de los usuarios. Desactivar las cookies puede resultar en la pérdida de funcionalidad en el sitio web.</p>
                    </div>
                </div>
            </div>
        </>
    )
}