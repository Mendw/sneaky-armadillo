import React, { useState } from 'react'
import styles from '../../styles/catalogo.module.css'
import Image from 'next/image'
import useSWR from 'swr'
import Head from 'next/head'
import Spinner from '../../components/spinner'
import Link from 'next/link'

import burgerIcon from '../../public/img/catalogo/hamburger.webp'

const Config = require('./catalogo.json')

function FilterSection (props) {
    return (
        <div className={styles.filters_section}>
            <div className={styles.filters_section_title}>
                <h2>{props.title}</h2>
            </div>
            <div className={styles.filter_group}>
                {props.options.map((option, index) => {
                    let value = option.value
                    let active = value === props.current.value;
                    return <div 
                        className={`${styles.filter_option} ${active ? styles.active: ''}`} 
                        key={index} 
                        onClick={() => props.onClick(value)}>
                        {option.label}
                    </div>
                })}
            </div>
        </div>
    )
}

function Search (props) {
    return (
        <div className={styles.search_wrapper}>
            <div className={styles.search}>
                <span>Buscar</span>
                <input type="search" onInput={(e) => props.handleInput(e)}/>
            </div>
            <button className={styles.filters_toggle} onClick={() => props.toggleFilters()}>
                <Image src={burgerIcon} alt="+"/>
            </button>
        </div>
    )
}

function Filters (props) {
    return (
        <div className={props.state ? styles.filters_wrapper : [styles.filters_wrapper, styles.filters_wrapper_inactive].join(' ')}>
            <div className={styles.filters}>
                {props.groups.map((filter_group, index) => {
                    return <FilterSection
                        title={filter_group.title}
                        current={props.current[filter_group.id]}
                        options={filter_group.options}
                        onClick={(value) => props.setFilterValue(filter_group.id, value)}
                        key={index}
                    />  
                })}
            </div>
        </div>
    )
}

function Product (props) {
    let [isLoading, setIsLoading] = useState(true)

    let imageWrapperClasses = [
        styles.product_image_wrapper
    ]

    if(isLoading) {
        imageWrapperClasses.push(
            styles.product_image_loading
        )
    }

    let name = props.data.name
    if(props.data.volume) {
        name += ` Vol. ${props.data.volume}`
    }

    let id = `${props.data.series}-${`${props.data.volume}`.padStart(3, '0')}${props.data.language}`
    return (
        <Link className={styles.product} href={`/catalogo/${id}`}>
            <a><div className={imageWrapperClasses.join(' ')}>
                <Image
                    src={`/img/catalogo/${props.data.image}`} 
                    alt={name}

                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"

                    onLoadingComplete={() => {
                        setIsLoading(false)
                    }}
                />
            </div>
            <div className={styles.product_description}>
                <span className={styles.product_title}>{name}</span>
                <span className={styles.product_category}>{props.data.category.toUpperCase()}</span>
                <span className={styles.product_price}>{`$${props.data.price.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2 }
                    )}`}</span>
            </div></a>
        </Link>
    )
}

function Products (props) {
    let { data, error } = useSWR('/api/products')

    let products_content
    if(error) {
        products_content = <div className={styles.messageProduct}>Ha ocurrido un error</div>
    } 
    else if(!data) {
        products_content = <div className={styles.messageProduct}>
            <span>Cargando productos...</span>
            <Spinner className={styles.messageProduct_spinner}/>
        </div> 
    } else {
        if(props.search !== '') {
            data = data.filter((product) => product.name.toLowerCase().includes(props.search.toLowerCase()))
        }
        data = data.filter(props.filters['filter'].function)
        data.sort(props.filters['sort'].function)

        products_content = data.map((product, index) => {
            return <Product data={product} key={index} />
        })
    }

    return (
    <>
        <Head>
            <title>Catálogo | Hoshi</title>
        </Head>
        <div className={styles.products_wrapper}>
            <div className={styles.products}>
                {products_content}
            </div>
        </div>
    </>
    )
}

export default function Catalogue (props) {
    let groups = Config.groups
    let searchTimeout = null

    const [search, setSearch] = useState('')
    const [filterState, setFilterState] = useState(false)

    let initialFiltersValue = {}
    let filterFunctions = {}

    for(let group of groups) {
        filterFunctions[group.id] = {}
        for(let option of group.options) {
            let func = new Function(...option.function)
            filterFunctions[group.id][option.value] = func

            if(option.value == group.default) {
                initialFiltersValue[group.id] = {
                    value: group.default,
                    function: func
                }
            }
        }
    }

    const [filters, setFilters] = useState(initialFiltersValue)

    function handleSearch(e) {
        if(searchTimeout) {
            clearTimeout(searchTimeout)
        }

        searchTimeout = setTimeout(() => {
            searchTimeout = null
            setSearch(e.target.value)
        }, 500)
    }


    function setFilterValue(param, value) {
        if(filters[param] !== value) {
            setFilters({
                ...filters,
                [param]: {
                    value: value,
                    function: filterFunctions[param][value]
                }
            })
        }
    }
    return (
        <>
            <Head>
                <link rel="preload" href="/api/products" as="fetch" crossOrigin="anonymous" />
            </Head>
            <div className={styles.catalogue}>
                <Search
                    handleInput={(param) => handleSearch(param)}
                    toggleFilters={() => setFilterState(!filterState)}
                />
                <div className={styles.content}>
                    <Filters
                        groups={groups}
                        state={filterState}
                        setFilterValue={(param, value) => setFilterValue(param, value)}
                        current={filters}
                    />
                    <Products
                        search={search}
                        filters={filters}
                    />
                </div>
            </div>
        </>
    )
}
  