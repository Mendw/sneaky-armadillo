import React, { useState } from 'react'
import styles from '../styles/catalogo.module.css'
import Image from 'next/image'
import useSWR from 'swr'
import Head from 'next/head'
import Spinner from '../components/spinner'

import burgerIcon from '../public/img/catalogo/hamburger.webp'

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

function Products (props) {
    let { data, error } = useSWR('/api/products')

    let _products
    if(error) {
        _products = <div className={styles.messageProduct}>Ha ocurrido un error</div>
    } else if(!data) {
        _products = <div className={styles.messageProduct}>
            <span>Cargando productos...</span>
            <Spinner className={styles.messageProduct_spinner}/>
        </div> 
    } else {
        if(props.search !== '') {
            data = data.filter((product) => product.name.toLowerCase().includes(props.search.toLowerCase()))
        }
        data = data.filter(props.filters['filter'].function)
        data.sort(props.filters['sort'].function)

        _products = data.map((product, index) => {
            return (
                <div className={styles.product} key={index}>
                    <div className={styles.product_image_wrapper}>
                        <span className={styles.product_category}>{product.category.toUpperCase()}</span>
                        <span className={styles.product_price}>${product.price.toLocaleString(
                            undefined,
                            { minimumFractionDigits: 2 }
                            )}</span>
                        <Image 
                            src={`/img/catalogo/${product.image}`} 
                            alt={product.name.toLowerCase()} 
                            className={styles.product_image}
                            width={300}
                            height={360}
                            />
                    </div>
                    <div className={styles.product_description}>
                        <div className={styles.product_description_separator}></div>
                        <span className={styles.product_title}>{product.name}</span>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={styles.products_wrapper}>
            <div className={styles.products}>
                {_products}
            </div>
        </div>
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
  