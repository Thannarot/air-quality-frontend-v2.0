import { S as SECRET_BACKEND_AUTHENTICATION } from "../../../../chunks/private.js";
import { P as PUBLIC_BASE_API_URL } from "../../../../chunks/public.js";
import axios from "axios";
async function GET({ url }) {
  const data = url.searchParams.get("data");
  let dataUrl = PUBLIC_BASE_API_URL;
  let params = {
    action: "get-stations",
    obs_date: data
  };
  let response_res = await axios.get(dataUrl, { params, headers: { Authorization: SECRET_BACKEND_AUTHENTICATION } }).then((result) => {
    return result.data.data;
  });
  return new Response(JSON.stringify({ response: response_res }), { status: 200 });
}
const prerender = false;
export {
  GET,
  prerender
};
