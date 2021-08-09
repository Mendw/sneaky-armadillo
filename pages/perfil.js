import styles from '../styles/perfil.module.css'
import useUser from '../lib/useUser';

export default function Profile() {
    const { user, mutateUser } = useUser({ redirectTo: "/ingreso" });

    return (
        <div className={styles.profile}>
            <div className={styles.profile_content}>
                {user && user.profile && user.profile.name}
                <button onClick={async () => {
                    mutateUser(await fetch('/api/logout', {method: 'POST'}));
                }}>Salir de su cuenta</button>
            </div>
        </div>
    )
}