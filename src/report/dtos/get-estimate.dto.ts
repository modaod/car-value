import { IsString, IsNumber, IsLatitude, IsLongitude, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
   @IsString()
   make: string;
   
   @IsString()
   model: string;
   
   @Transform(({ value }) => parseInt(value))
   @IsNumber()
   @Min(1990)
   @Max(new Date().getFullYear())
   year: number;
   
   @Transform(({ value }) => parseInt(value))
   @IsNumber()
   mileage: number;
   
   @Transform(({ value }) => parseFloat(value))
   @IsLatitude()
   lat: number;
   
   @Transform(({ value }) => parseFloat(value))
   @IsLongitude()
   lng: number;
}