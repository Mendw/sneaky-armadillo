import React from 'react'
import styles from '../styles/catalogo.module.css'
import Image from 'next/image'

import burgerIcon from '../public/img/catalogo/hamburger.webp'

const Config = require('./catalogo.json')

function FilterSection (props) {
    return (
        <div className={styles.filters_section}>
            <div className={styles.filters_section_title}>
                <h2>{props.title}</h2>
                <button 
                    onClick={() => props.resetFilter()}
                    className={styles.filter_reset}>
                    R 
                </button>
            </div>
            <div className={styles.filter_group}>
                {props.options.map((option, index) => {
                    let param = option.hasOwnProperty('param') ? option.param : option.value
                    let active = param === props.current;
                    return <div 
                        className={`${styles.filter_option} ${active ? styles.active: ''}`} 
                        key={index} 
                        onClick={() => props.onClick(param)}>
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
                        param={filter_group.param}
                        title={filter_group.title}
                        current={props.current[filter_group.param]}
                        options={filter_group.options}
                        onClick={(value) => props.setFilterValue(filter_group.param, value)}
                        resetFilter={() => props.resetFilter(filter_group.param)}
                        key={index}
                    />  
                })}
            </div>
        </div>
    )
}

function Products (props) {
    let products = Config.mockProducts;

    return (
        <div className={styles.products_wrapper}>
            <div className={styles.products}>
                {products.map((data, index) => {
                    return (
                        <div className={styles.product} key={index}>
                            <div className={styles.product_image_wrapper}>
                                <span className={styles.product_category}>{data.category.toUpperCase()}</span>
                                <span className={styles.product_price}>${data.price.toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                )}</span>
                                <Image 
                                    src={`/img/catalogo/${data.image}`} 
                                    alt={data.name.toLowerCase()} 
                                    className={styles.product_image}
                                    width={300}
                                    height={360}
                                />
                            </div>
                            <div className={styles.product_description}>
                                <div className={styles.product_description_separator}></div>
                                <span className={styles.product_title}>{data.name}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default class Catalogue extends React.Component {
    constructor(props) {
        super(props)
        this.groups = Config.groups;

        this.defaults = {}
        this.searchTimeout = null;

        this.searchValue = ''

        this.state = {
            filterState: false,
            filters: {}
        }

        for(let group of this.groups) {
            this.state.filters[group.param] = null
            for(let option of group.options) {
                if(option.value === null || (option.hasOwnProperty('param') && option.param === null))
                    this.defaults[group.param] = option.value
            }
        }
    }

    handleSearch(e) {
        if(this.searchTimeout) {
            clearTimeout(this.searchTimeout)
        }

        this.searchTimeout = setTimeout(() => {
            this.searchTimeout = null
            this.setSearchValue(e.target.value)
        }, 500)
    }

    setSearchValue(value) {
        this.searchValue = value
        /* Fetch the results **/
    }

    setFilterValue(param, value) {
        if(this.state.filters[param] !== value) {
            let stateChange = {
                filters: {...this.state.filters}
            }

            stateChange.filters[param] = value;
            this.setState(stateChange);
        }
    }

    resetFilter(param) {
        let stateChange = {
            filters: {...this.state.filters}
        }

        stateChange.filters[param] = null
        this.setState(stateChange);
    }

    toggleFilters() {
        this.setState({
            filterState: !this.state.filterState
        })
    }

    render () {
        return (
            <div className={styles.catalogue}>
                <Search
                    handleInput={(param) => this.handleSearch(param)}
                    toggleFilters={() => this.toggleFilters()}
                />
                <div className={styles.content}>
                    <Filters
                        groups={this.groups}
                        resetFilter={(param) => this.resetFilter(param)}
                        state={this.state.filterState}
                        setFilterValue={(param, value) => this.setFilterValue(param, value)}
                        current={this.state.filters}
                    />
                    <Products/>
                </div>
            </div>
        )
    }
}