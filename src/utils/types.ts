export interface IPAPIResultSucceeded {
    status: "success";
    country: string;
    countryCode: string;
    timezone: string;
}

export interface IPAPIResultFailed {
    status: "fail";
    message: string;
}

export type IPAPIResult = IPAPIResultFailed | IPAPIResultSucceeded;
export type Nullable<T> = T | null | undefined;
