import { useRouter } from "next/router";

import { basepath } from "../lib/utils";
import useUser from "../lib/useUser";
import { useEffect, useState } from "react";

export default function Authenticate() {
    let router = useRouter()
    const { mutateUser} = useUser()

    let [data, setData] = useState()
    let [error, setError] = useState()
    let [requestSent, setRequestSent] = useState(false)

    useEffect(() => {
        function fetchOnce(url) {
            if(!requestSent) {
                setRequestSent(true)
                fetch(url).then(async res => {
                    let json = await res.json()
                    if(res.ok) {
                        setData(json)
                    } else {
                        setError(json.error)
                    }
                })       
            }
        }

        fetchOnce(`${basepath}/api/authenticate?token=${router.query?.token??''}`)
        if(data) {mutateUser(data).then(() => {router.push(basepath)})}
    }, [data, mutateUser, router, requestSent])
    
    if(error) {
        return <h1>Error: {error}</h1>
    } else if(!data) {
        return <h1>Loading</h1>
    } else {
        return <h1>Found</h1>
    }
}

export async function getServerSideProps(context) {
    return {props: {}}
}
  