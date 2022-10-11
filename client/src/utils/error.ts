import axios from "axios";

export function getErrMsg(error: unknown): string {
  let msg = "Unexpected error, Please retry";

  if (error instanceof axios.AxiosError)
    msg = error.response?.data ? error.response.data.error : error.message;
  else if (error instanceof Error) msg = error.message;

  return msg;
}
