import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto, SignInDto } from './dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      // Encrypt password
      const hashedPassword = await this.encryptPassword(signUpDto.password);

      // Create user
      const user = await this.usersService.create({
        ...signUpDto,
        password: hashedPassword,
      });

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      const payload = { sub: user.id, email: user.email, name: user.name };
      const token = this.jwtService.sign(payload);

      const finalReturn = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };

      return finalReturn;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Registration failed');
    }
  }

  async signIn(signInDto: SignInDto) {
    // Find user by email
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async createGuestSession() {
    // Create a real temporary user in the database
    try {
      const guestEmail = `guest_${Math.random().toString(36).substring(2, 11)}@temp.local`;
      const guestName = `Guest User`;

      // Create temporary user in database
      const tempUser = await this.usersService.create({
        name: guestName,
        email: guestEmail,
        password: await this.encryptPassword('temp_password_' + Date.now()),
      });

      // Generate JWT token for guest
      const payload = {
        sub: tempUser.id,
        email: tempUser.email,
        name: tempUser.name,
        isGuest: true, // Flag to identify guest sessions
      };

      const token = this.jwtService.sign(payload);

      return {
        token,
        user: {
          // id: tempUser.id,
          name: tempUser.name,
          // email: tempUser.email,
          isGuest: true,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'There is an error when we create a guest session',
        error?.message,
      );
    }
  }

  // Optional: Method to clean up expired guest users
  async cleanupExpiredGuestUsers() {
    // This could be called by a cron job
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all users with email pattern guest_*@temp.local created more than 24 hours ago
    // You would need to add this method to UsersService
    // await this.usersService.deleteExpiredGuestUsers(oneDayAgo);
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
