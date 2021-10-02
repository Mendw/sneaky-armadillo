import { basepath } from "../../lib/utils";
import styles from '../../styles/producto.module.css';
import Image from 'next/image'
import Button from '../../components/button'
import { useEffect, useState } from "react";
import useUser from "../../lib/useUser";
import { useRouter } from "next/router";

function Cart (props) {
  let { user, mutateUser } = useUser()
  let router = useRouter()
  let [isFetching, setIsFetching] = useState(false)

  let userLoaded = user && 'isLoggedIn' in user
  let isLoggedIn = userLoaded && user.isLoggedIn

  let {
    precio,
    productId
  } = props
  
  let [ammount, mutateAmmount] = useState(0)

  useEffect(() => {
    mutateAmmount(isLoggedIn && user.profile.cart ? (user.profile.cart[productId]) || 0 : 0)
  }, [user])

  return (
    <div className={styles.cart}>
      <span>
        {`Precio: $${precio.toLocaleString(
          undefined,
          { minimumFractionDigits: 2}
        )}`}
      </span>
      <div className={styles.cart_controls}>
        <Button
          disabled={isFetching || !userLoaded}
          onClick={() => {
            mutateAmmount(Math.max(ammount - 1, 0))
          }}
        >-</Button>
        <span>{userLoaded ? ammount : "~"}</span>
        <Button
          disabled={isFetching || !userLoaded}
          onClick={() => {
            mutateAmmount(Math.min(ammount + 1, 10))
          }}
        >+</Button>
      </div>
      <span>
        {`$${(ammount * precio).toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        )} total`}
      </span>
      <Button disabled={isFetching || !userLoaded} className={styles.cart_button} onClick={async () => {
        if(isLoggedIn) {
          setIsFetching(true)
          let payload = {
            productId,
            ammount
          }

          let updatedUser = await fetch('/api/update-cart', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json'
            },
          }).then(res => res.json())

          if(!('error' in updatedUser)) {
            mutateUser(updatedUser, true)
          }

          setIsFetching(false)
        } else {
          router.push('/ingreso')
        }
      }}>
        Agregar al Carrito
      </Button>
    </div>
  )
}

export default function Product(props) {
  let { product, id } = props

  return (
    <div className={styles.product_wrapper}>
      <div className={styles.product}>
        <div className={styles.product_image_wrapper}>
          <Image 
            src={`/img/catalogo/${product.image}`}
            alt={product.name}

            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className={styles.product_information}>
          <div className={styles.product_text}>
            <h1>{product.name}</h1>
            {
              product.description.map((parragraph, index) => {
                return <p className={styles.product_description} key={index}>{parragraph}</p>
              })
            }
          </div>
          <Cart precio={product.price} productId={id}/>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps(context) {
  const { id } = context.params
  const product = await fetch(`${basepath}/api/products/${id}`).then(res => res.json())

  return {
    props: { product, id },
    revalidate: 3600
  }
}

export async function getStaticPaths() {
  const products = await fetch(`${basepath}/api/products`).then(res => res.json());

  const paths = products.map((product) => {
    let id = product.volume ? `${product.series}-${`${product.volume}`.padStart(3, '0')}${product.language}` : `${product.series}-${product.language}`;
    return {
      params: { id },
    }
  });

  return { paths, fallback: 'blocking' };
}
