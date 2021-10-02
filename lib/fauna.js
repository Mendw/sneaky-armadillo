import faunadb, { ToInteger } from 'faunadb'
const q = faunadb.query

const client = new faunadb.Client({
    secret: process.env.FAUNA_ADMIN_KEY
})

const MAX_PAGINATE_SIZE = 10000

export async function user_from_client_id(provider_id, client_id) {
    return await client.query(
        q.Let({
            account_set: q.Match(q.Index('account_by_provider_client_id'), [provider_id, client_id])
        }, q.If(q.IsNonEmpty(q.Var('account_set')), q.Let({
            user_ref: q.Ref(q.Collection('users'), q.Select(['data', 'user_ref'], q.Get(q.Var('account_set')))),
        }, q.If(q.Exists(q.Var('user_ref')), {
            user: q.Get(q.Var('user_ref'))
        } , {
            error: {
                code: 0,
                message: 'Bad account: referenced user_ref not found'
            }
        })), {

        }))
    )
}

export async function createUser(data) {
    return await client.query(
        q.Create(
            q.Collection('users'), {
                data: data
            }
    ))
    
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
            data: q.Select(['data'], q.Update(q.Var('user_ref'), data))
        }, {
            
        }))
    )
}

export async function updateAddress(user_ref, data) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), {
            data: q.Select(['data'], q.Update(q.Var('user_ref'), { data }))
        }, {
            
        }))
    )
}

export async function detailedCart(user_ref) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), q.Let({
            user_cart_array: q.ToArray(q.Select(['data', 'cart'], q.Get(q.Var('user_ref')), {}))
        }, q.Map(
            q.Var('user_cart_array'), 
            q.Lambda(
                'item',
                q.Let({
                    product_id: q.Select(0, q.Var('item')),
                    series: q.SubString(q.Var('product_id'), 0, 3),
                    volume: q.ToInteger(q.SubString(q.Var('product_id'), 4, 3)),
                    language: q.SubString(q.Var('product_id'), 7, 2),
                    product_set: q.Match('product_by_series_volume_language', [
                        q.Var('series'),
                        q.Var('volume'),
                        q.Var('language'),
                    ])
                }, q.If(
                    q.IsNonEmpty(
                        q.Var('product_set')
                    ),
                    q.Merge(
                        q.Select(
                            ['data'], 
                            q.Get(
                                q.Var('product_set')
                            )
                        ), {
                            ammount: q.Select(1, q.Var('item')),
                            found: true
                        }

                    ), 
                    {
                        id: q.Select(0, q.Var('item')),
                        ammount: q.Select(1, q.Var('item')),
                        found: false
                    }
                ))
            ))
        ), {
            
        }))
    )
}

export async function updateCart(user_ref, payload) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), {
            data: q.Select(['data'], q.Update(q.Var('user_ref'), {
                data: {
                    cart: {
                        [payload.productId]: payload.ammount ||  null
                    }
                }
            }))
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

export async function unlinkAccount(provider_id, user_ref) {
    return await client.query(
        q.Let({
            user_ref: q.Ref(q.Collection('users'), user_ref)
        }, q.If(q.Exists(q.Var('user_ref')), q.Let({
            account_set: q.Match(q.Index('account_by_provider_user_ref'), [provider_id, user_ref])
        }, q.If(q.IsNonEmpty(q.Var('account_set')), {
            deleted: q.Delete(q.Select(['ref'], q.Get(q.Var('account_set')))),
        }, {
            error: `User has no associated ${provider_id} account`
        })),{
            error: `Invalid user`
        }))
    )
}

export async function getSeries() {
    return await client.query(
        q.Let({
            series: q.Paginate(q.Documents(q.Collection('series')), {
                size: MAX_PAGINATE_SIZE
            })
        }, {
            data: q.Map(q.Select(['data'], q.Var('series')), q.Lambda('item', q.Select(['data'], q.Get(q.Var('item')))))
        })
    )
}

const adapter = {
    user_from_client_id,

    createUser,
    getUser,
    updateUser,
    updateAddress,
    deleteUser,

    updateCart,
    detailedCart,

    linkAccount,
    unlinkAccount
}

export default adapter