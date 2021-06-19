import getISO3166 from './getISO3166';

import { getISO3166ByPhone } from './getISO3166ByPhone';
import { validatePhoneISO3166 } from './validatePhoneISO3166';

// import { setupData, getData } from './iso3166DataUtils';
export * from './iso3166DataUtils';
export * from './getISO3166ByPhone';
export * from './validatePhoneISO3166';

/**
 *
 * If no "+" sign treat as USA or CAN phone number
 * @param {string} phone - phone number
 * @param {string} country - country code in ISO3166 alpha 3
 * @param {Boolean=} allowLandline - allow detecting landline phone number
 * @returns []
 */

export function validate(
  phone: string,
  country?: string,
  allowLandline?: boolean
) {
  const result: any[] = [];
  let formatPhone = phone.trim();
  const formatCountry = country?.trim();

  let plusSign = false;

  if (formatPhone.match(/^\+/)) {
    plusSign = true;
  }

  // remove any non-digit character, included the +
  formatPhone = formatPhone.replace(/\D/g, '');

  // if no country, default is USA
  let iso3166 = getISO3166(formatCountry);

  if (!iso3166) {
    return result;
  }

  let defaultCountry = false;

  if (formatCountry) {
    // remove leading 0s for all countries except 'CIV', 'COG'
    if (['CIV', 'COG'].indexOf(iso3166.alpha3) === -1) {
      formatPhone = formatPhone.replace(/^0+/, '');
    }

    // if input 89234567890, RUS, remove the 8
    if (
      iso3166.alpha3 === 'RUS' &&
      formatPhone.length === 11 &&
      formatPhone.match(/^89/) !== null
    ) {
      formatPhone = formatPhone.replace(/^8+/, '');
    }

    if (
      !plusSign &&
      iso3166.phone_number_lengths.indexOf(formatPhone.length) !== -1
    ) {
      formatPhone = iso3166.country_code + formatPhone;
      // C: have country, no plus sign --->
      //	case 1
      //		check phone_number_length == formatPhone.length
      //		add back the country code
      //	case 2
      //		phone_number_length+phone_country_code.length == formatPhone.length
      //		then go to D
    }
  } else if (plusSign) {
    // A: no country, have plus sign --> lookup country_code, length, and get the iso3166 directly
    // also validation is done here. so, the iso3166 is the matched result.
    let possibleIso3166;
    const Iso3166s = getISO3166ByPhone(formatPhone, allowLandline);
    iso3166 = Iso3166s[0];
    possibleIso3166 = Iso3166s[1];

    if (!iso3166) {
      // for some countries, the phone number usually includes one trunk prefix for local use
      // The UK mobile phone number ‘07911 123456’ in international format is ‘+44 7911 123456’, so without the first zero.
      // 8 (AAA) BBB-BB-BB, 0AA-BBBBBBB
      // the numbers should be omitted in international calls
      if (possibleIso3166) {
        iso3166 = possibleIso3166;
        formatPhone =
          iso3166.country_code +
          formatPhone.replace(new RegExp(`^${iso3166.country_code}\\d`), '');
      } else {
        iso3166 = undefined;
      }
    }
  } else if (iso3166.phone_number_lengths.indexOf(formatPhone.length) !== -1) {
    // B: no country, no plus sign --> treat it as USA
    // 1. check length if == 11, or 10, if 10, add +1, then go go D
    // no plus sign, no country is given. then it must be USA
    // iso3166 = iso3166_data[0]; already assign by the default value
    formatPhone = '1' + formatPhone;
    defaultCountry = true;
  }

  let validateResult = validatePhoneISO3166(
    formatPhone,
    iso3166,
    allowLandline,
    plusSign
  );

  if (validateResult) {
    return ['+' + formatPhone, iso3166?.alpha3];
  }

  if (defaultCountry) {
    // also try to validate against CAN for default country, as CAN is also start with +1
    iso3166 = getISO3166('CAN');
    validateResult = validatePhoneISO3166(
      formatPhone,
      iso3166,
      allowLandline,
      plusSign
    );
    if (validateResult) {
      return ['+' + formatPhone, iso3166?.alpha3];
    }
  }

  return result;
}

export default validate;