import styles from '../styles/spinner.module.css'

export default function Spinner (props) {

    return (
    <div className={[styles.spinner, props.className].join(' ')}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    )
}