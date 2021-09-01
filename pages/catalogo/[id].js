import { basepath } from "../../lib/utils";
import styles from '../../styles/producto.module.css';
import Image from 'next/image'
import Spinner from "../../components/spinner";
import { useState } from "react";

function Cart (props) {
  let [ammount, mutateAmmount] = useState(0)

  let {
    precio,
  } = props

  return (
    <div className={styles.cart}>
      <span>
        {`Precio: $${precio.toLocaleString(
          undefined,
          { minimumFractionDigits: 2}
        )}`}
      </span>
      <div className={styles.cart_controls}>
        <button
          onClick={() => {
            mutateAmmount(Math.max(ammount - 1, 0))
          }}
        >-</button>
        <span>{ammount}</span>
        <button
          onClick={() => {
            mutateAmmount(Math.min(ammount + 1, 10))
          }}
        >+</button>
      </div>
      <span>
        {`$${(ammount * precio).toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        )} total`}
      </span>
      <button className={styles.cart_button}>
        Agregar al Carrito
      </button>
    </div>
  )
}

export default function Product(props) {
  let { product } = props

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
          <Cart precio={product.price}/>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps(context) {
  const { id } = context.params
  const product = await fetch(`${basepath}/api/products/${id}`).then(res => res.json())

  return {
    props: { product },
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
