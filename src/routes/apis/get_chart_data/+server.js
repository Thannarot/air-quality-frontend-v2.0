

import { SECRET_BACKEND_AUTHENTICATION } from '$env/static/private'
import { PUBLIC_BASE_API_URL } from '$env/static/public'
import axios from 'axios'

/** @type {import('./$types').RequestHandler} */

export async function GET({ url }) {
    //get the data param sent in the fetch call
    
    let params = {
        action: 'get-chartData',
        freq_chart: '3dayrecent',
        geom_data: url.searchParams.get('geom_data'),
        interaction: url.searchParams.get('interaction'),
        run_date_chart: url.searchParams.get('run_date_chart'),
        run_type_chart: url.searchParams.get('run_type_chart'),
        variable: url.searchParams.get('variable')
    };

    let response_res = await axios.get(PUBLIC_BASE_API_URL, { params, headers: { Authorization: SECRET_BACKEND_AUTHENTICATION } })
    .then(result => { 
        return result.data.data
    })

    return new Response(JSON.stringify({ response: response_res }), { status: 200 })

}



export const prerender = false