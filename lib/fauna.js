import faunadb, { Select } from 'faunadb'
const q = faunadb.query

const client = new faunadb.Client({
    secret: process.env.FAUNA_ADMIN_KEY
})

export async function user_from_client_id(provider_id, client_id) {
    return await client.query(
        q.Let({
            account_set: q.Match(q.Index('account_by_provider_client_id'), [provider_id, client_id])
        }, q.If(q.IsNonEmpty(q.Var('account_set')), q.Let({
            user_ref: q.Ref(q.Collection('users'), q.Select(['data', 'user_ref'], q.Get(q.Var('account_set')))),
        }, q.If(q.Exists(q.Var('user_ref')), {
            data: q.Select(['data'], q.Get(q.Var('user_ref')))
        } , {
            error: 'referenced user_ref not found'
        })), {

        }))
    )
}

export async function createUser(data) {
    return await client.query(
        q.Select(['ref', 'id'], q.Create(
            q.Collection('users'), {
                data: data
            }
    )))
    
}

export async function getUser(user_ref) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), {
            data: q.Select(['data'], q.Get(q.Var('user_ref')))
        }, {
            
        }))
    )
}

export async function updateUser(user_ref, data) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), {
            data: q.Select(['data'], q.Update(q.Get(q.Var('user_ref')), data))
        }, {
            
        }))
    )
}

export async function deleteUser(user_ref) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), {
            data: q.Select(['data'], q.Delete(q.Get(q.Var('user_ref'))))
        } , {

        })
    ))
}

export async function createSession(data) {
    return {
        data: await client.query(
            q.Select(['data'], q.Create(
                q.Collection('sessions'), {
                    data: data
                }
        )))
    }
}

export async function getSession(session_id) {
    return await client.query(
        q.Let({
            session_set: q.Match(q.Index('session_by_id'), session_id)
        }, q.If(q.IsNonEmpty(q.Var('session_set')), {
            data: q.Select(['data'], q.Get(q.Var('session_set')))
        }
        ), {

        })
    )
}

export async function updateSession(session_id, data) {
    return await client.query(
        q.Let({
            session_set: q.Match(q.Index('session_by_id'), session_id)
        }, q.If(q.IsNonEmpty(q.Var('session_set')), {
            data: q.Select(['data'], q.Update(q.Get(q.Var('session_set')), data))
        }, {
            
        }))
    )
}

export async function deleteSession(session_id) {
    return await client.query(
        q.Let({
            session_set: q.Match(q.Index('session_by_id'), session_id)
        }, q.If(q.IsNonEmpty(q.Var('session_set')), {
            data: q.Select(['data'], q.Delete(q.Get(q.Var('session_set'))))
        } , {

        })
    ))
}

export async function linkAccount(provider_id, client_id, user_ref) {
    return {
        data: await client.query(
            q.Select(['data'], q.Create(
                q.Collection('accounts'), {
                    data: {
                        provider_id: provider_id,
                        client_id: client_id,
                        user_ref: user_ref
                    }
                }
        )))
    }
}

export async function unlinkAccount(provider_id, client_id) {
    return await client.query(
        q.Let({
            account_set: q.Match(q.Index('account_by_provider_client_id'), [provider_id, client_id])
        }, q.If(q.IsNonEmpty(q.Var('account_set')), {
            data: q.Select(['data'], q.Delete(q.Get(q.Var('account_set'))))
        }, {

        }))
    )
}

export default fauna = {
    user_from_client_id,

    createUser,
    getUser,
    updateUser,
    deleteUser,

    createSession,
    getSession,
    updateSession,
    deleteSession,

    linkAccount,
    unlinkAccount
}