

import { SECRET_BACKEND_AUTHENTICATION } from '$env/static/private'
import { PUBLIC_BASE_API_URL } from '$env/static/public'
import axios from 'axios'
/** @type {import('./$types').RequestHandler} */

export async function GET({ url }) {
    //get the data param sent in the fetch call
    const data = url.searchParams.get('data')
    
    let dataUrl = PUBLIC_BASE_API_URL;
    let params = {
      action: 'get-latest-date',
      dataset: data
    };

    let response_res = await axios.get(dataUrl, { params, headers: { Authorization: SECRET_BACKEND_AUTHENTICATION } })
    .then(result => { 
        return result.data
    })

    return new Response(JSON.stringify({ response: response_res }), { status: 200 })

}
