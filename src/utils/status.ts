export type TStatusRes<T> = {
  item: T
  resultCode: number
  error: string
  message: string
}

export const resStatus = <T>(item: T, resultCode: number, error: string = "", message: string = ""): TStatusRes<T> => {
  return {
    item,
    resultCode,
    error,
    message
  };
};