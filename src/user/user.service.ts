import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { SignUpDto } from 'src/auth/auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(signUpDto: SignUpDto) {
    // create new user instance
    const newUser = new this.userModel({
      name: signUpDto.name,
      email: signUpDto.email,
      password: signUpDto.password,
    });

    // save user to database
    await newUser.save();

    // exclude password from the returned user object
    newUser.password = '';

    return newUser;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return this.userModel.findById(new Types.ObjectId(id));
  }

  async getAllUsers() {
    return this.userModel.find({ role: 'student' }).select('-password');
  }

  async updateUser(id: string, updateData: Partial<User>) {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');
  }

  async updateByEmail(email: string, updateData: Partial<User>) {
    return this.userModel
      .findOneAndUpdate({ email: email }, updateData, { new: true })
      .select('-password');
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
