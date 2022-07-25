import { SetMetadata } from "@nestjs/common";
import { Controller, Get } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'auth';
export const AllowUnauthorizedRequest = () => SetMetadata(IS_PUBLIC_KEY, true);