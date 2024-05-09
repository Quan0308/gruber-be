export interface ILocation {
  formatted_address: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}
