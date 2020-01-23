export async function getAllSellers({ page = 1, first = 10, search = '' }) {
    return (await fetch(process.env.API_URL + `/sellers?p=${page}&f=${first}&s=${search}`)).json()
}

export async function createSeller({ name, company }) {
    return (await fetch(process.env.API_URL + '/sellers', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            name,
            company
        })
    })).json()
}