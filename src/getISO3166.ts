import { getData } from './iso3166DataUtils';

// assign default to USA country first
export default function getISO3166(country?: string) {
  const iso3166_data = getData();

  if (!country) {
    return iso3166_data[0];
  }

  if (country.length === 2) {
    return iso3166_data.find(
      iso3166_datum => country.toUpperCase() === iso3166_datum.alpha2
    );
  }

  if (country.length === 3) {
    return iso3166_data.find(
      iso3166_datum => country.toUpperCase() === iso3166_datum.alpha3
    );
  }

  return iso3166_data.find(
    iso3166_datum =>
      country.toUpperCase() === iso3166_datum.country_name.toUpperCase()
  );
}
