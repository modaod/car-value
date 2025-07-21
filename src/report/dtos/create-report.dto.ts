import { IsString, IsNumber, IsLatitude, IsLongitude, Max, Min } from 'class-validator';

export class CreateReportDto {
   @IsNumber()
   @Min(1)
   @Max(1000000)
   price: string;
   
   @IsString()
   make: string;
   
   @IsString()
   model: string;
   
   @IsNumber()
   @Min(1990)
   @Max(new Date().getFullYear())
   year: number;
   
   @IsNumber()
   mileage: number;
   
   @IsLatitude()
   lat: number;
   
   @IsLongitude()
   lng: number;
}