import { useRouter } from "next/router";
import useSWR from "swr";

import { basepath } from "../lib/utils";

export default function Authenticate() {
    let router = useRouter()

    const { data, error } = useSWR(`api/authenticate?token=${router.query?.token??''}`)

    if(error) return <h1>Error</h1>
    if(!data) return <h1>Loading</h1>

    router.push(basepath)
    return null
}

export async function getServerSideProps(context) {
    return {props: {}}
}
  