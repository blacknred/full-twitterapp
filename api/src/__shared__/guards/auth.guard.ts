import { Injectable } from '@nestjs/common';
import { AuthGuard as BaseGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends BaseGuard('jwt') {}
