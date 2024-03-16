import { S as SECRET_BACKEND_AUTHENTICATION } from "../../../../chunks/private.js";
import { P as PUBLIC_BASE_API_URL } from "../../../../chunks/public.js";
import axios from "axios";
async function GET({ url }) {
  let params = {
    action: "get-chartData",
    freq_chart: "3dayrecent",
    geom_data: url.searchParams.get("geom_data"),
    interaction: url.searchParams.get("interaction"),
    run_date_chart: url.searchParams.get("run_date_chart"),
    run_type_chart: url.searchParams.get("run_type_chart"),
    variable: url.searchParams.get("variable")
  };
  let response_res = await axios.get(PUBLIC_BASE_API_URL, { params, headers: { Authorization: SECRET_BACKEND_AUTHENTICATION } }).then((result) => {
    return result.data.data;
  });
  return new Response(JSON.stringify({ response: response_res }), { status: 200 });
}
const prerender = false;
export {
  GET,
  prerender
};
