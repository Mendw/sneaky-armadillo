import styles from '../styles/carrito.module.css'
import useUser from '../lib/useUser'
import useSWR from 'swr'

import Image from 'next/image'
import Button from '../components/button'

import editIcon from '../public/img/perfil/edit.webp'
import deleteIcon from '../public/img/perfil/delete.webp'

import { useRouter } from 'next/router'

function CartProduct({data, editProduct, deleteProduct}) {
    return (
        <tr>
            <td className={styles.product_image}>
                <Image 
                    src={`${data.image_url}`}
                    width={90}
                    height={90}

                    objectFit="cover"
                    objectPosition="center"         
                />
            </td>
            <td className={styles.product_name}>
                {data.name}
            </td>
            <td>
                {data.volume}
            </td>
            <td>
                {data.language}
            </td>
            <td>
                {`$${data.price.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2 }
                    )}`}
            </td>
            <td>
                {data.ammount}
            </td>
            <td className={styles.product_actions_wrapper}>
                <div className={styles.product_actions}>
                    <Button className={styles.product_edit} onClick={editProduct}>
                        <Image src={editIcon} width={15} height={15}/>
                    </Button>
                    <Button className={styles.product_delete}>
                        <Image src={deleteIcon} width={15} height={15} onClick={deleteProduct}/>
                    </Button>
                </div>
            </td>
        </tr>
    )
}

export default function Cart() {
    const { user, mutateUser } = useUser({ redirectTo: "/ingreso" })
    let { data: detailedCart, mutate: mutateDetailedCart } = useSWR('/api/get-cart')

    let userLoaded = user && 'isLoggedIn' in user
    let cartLoaded = detailedCart !== undefined

    let router = useRouter()

    if(cartLoaded) detailedCart = detailedCart.filter(
        element => element.found
    )

    function totalize(cart) {
        let total = 0
        for(const product of cart) {
            total += product.price * product.ammount
        }

        return total
    }

    function buildId(product) {
        return `${product.series}-${product.volume.toString().padStart(3, '0')}${product.language}`
    }

    return (
        cartLoaded && <div className={styles.cart_wrapper}>
            <div className={styles.cart}>
                <div className={styles.cart_content}>
                    <h2 className={styles.cart_title}>Carrito</h2>
                    <table className={styles.cart_products}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Serie</th>
                                <th>Vol.</th>
                                <th>Lenguaje</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartLoaded && 
                            detailedCart
                            .map(
                                (element, index) => <CartProduct key={index} data={element} editProduct={() => {
                                    router.push(`/catalogo/${buildId(element)}`)
                                }} deleteProduct={() => {
                                    alert("doing it")

                                    let payload = {
                                        productId: buildId(element),
                                        ammount: null
                                    }

                                    fetch('/api/update-cart', {
                                        method: "POST",
                                        body: JSON.stringify(payload),
                                        headers: {
                                        'Content-Type': 'application/json'
                                        },
                                    }).then(res => res.json())
                                    .then(json => {
                                        if(!('error' in json)) {
                                            mutateDetailedCart()
                                            mutateUser()
                                        } else {
                                            alert('error updating cart')
                                        }
                                    })
                                }}/>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan={4}>{' '}</td>
                                <td>Total</td>
                                <td>{`$${totalize(detailedCart).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                    )}`}
                                </td>
                                <td className={styles.buy_button_wrapper}>
                                    <div className={styles.buy_button}>
                                        <Button>Comprar</Button>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}