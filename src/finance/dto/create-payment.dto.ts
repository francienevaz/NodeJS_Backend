// src/finance/dto/create-payment.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '../../shared/enums/payment.enums';

export class CreatePaymentDto {
  @IsString()
  appointmentId: string;

  @IsString()
  patientId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  transactionId?: string;
}