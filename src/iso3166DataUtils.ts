export interface PhoneType {
  alpha2: string;
  alpha3: string;
  country_code: string;
  country_name: string;
  mobile_begin_with: string[];
  phone_number_lengths: number[];
}

let data: PhoneType[] = [];

/**
 * load phone data
 */
export const setupData = (newData: PhoneType[]) => {
  data = newData;
};

/**
 * get phone data
 */
export const getData = (): PhoneType[] => data;
