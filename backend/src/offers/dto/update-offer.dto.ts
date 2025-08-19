export class UpdateOfferDto {
  title: string;
  location: string | undefined;
  salary: string | undefined;
  experience: string | undefined;
  contract: string | undefined;
  teletravail: boolean | undefined;
  description: string | undefined;
  skills: string[] | undefined;
  avantages: string[] | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  category: string | undefined;
  imageUrl: string | undefined;
}
