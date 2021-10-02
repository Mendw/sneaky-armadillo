import styles from "../styles/button.module.css"

export default function Button (props) {
    let { children, ...otherProps } = props
    return <button { ...otherProps } className={[otherProps.className??'', styles.button_base].join(' ')}>
        { children }
    </button>
}