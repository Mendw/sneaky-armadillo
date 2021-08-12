import { useRouter } from "next/router";

import { basepath } from "../lib/utils";
import { mutate } from "swr";
import { useEffect, useState } from "react";

export default function Authenticate() {
    let router = useRouter()

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

        fetchOnce(`${basepath}/api/link-account?token=${router.query?.token??''}`)
        if(data) {mutate('/api/user', data).then(() => {router.push(basepath)})}
    }, [data, router, requestSent])
    
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
  