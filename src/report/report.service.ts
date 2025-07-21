import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { User } from 'src/user/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportService {
   
   constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
   
   create(body: CreateReportDto, user: User) {
      const report = this.repo.create(body);
      report.user = user; // Associate the report with the user
      return this.repo.save(report);
   }

   findAll() {
      return this.repo.find();
   }

   findOne(id: number) {
      return this.repo.findOneBy({ id });
   }

   async changeApproval(id: number, approved: boolean) {
      const report = await this.repo.findOneBy({ id });
      if (!report) {
         throw new NotFoundException('Report not found');
      }
      report.approved = approved;
      return this.repo.save(report);
   }

   createEstimate(query: GetEstimateDto) {
      return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make:  query.make })
      .andWhere('model = :model', { model: query.model })
      .andWhere('year - :year BETWEEN -10 AND 10', { year: query.year })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: query.lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: query.lng })
      .orderBy('ABS(mileage - :mileage)', 'ASC')
      .setParameters({ mileage: query.mileage})
      .limit(3)
      .getRawOne()
   }   
}
