import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('report')
export class ReportController {

   constructor(private reportService: ReportService) {}

   @Post()
   @UseGuards(AuthGuard)
   @Serialize(ReportDto)
   createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
      return this.reportService.create(body, user);
   }

   @Patch(':id')
   @UseGuards(AdminGuard)
   approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
      return this.reportService.changeApproval(id, body.approved);
   }

   @Get()
   getEstimate(@Query() query: GetEstimateDto) {
      return this.reportService.createEstimate(query);
   }
}
