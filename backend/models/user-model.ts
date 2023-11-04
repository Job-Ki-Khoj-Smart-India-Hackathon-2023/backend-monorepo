import {Schema, Model, model} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface IUser{
	_id: string
	email: string
	password: string
	role: 'jobseeker' | 'employer' | 'admin'
}

const userSchema = new Schema<IUser>({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['jobseeker', 'employer', 'admin'],
	}

}, {timestamps: true});

userSchema.index({email: 1}, {unique: true});

interface IUserMethods {
	generateToken: () => string
	comparePassword: (password: string) => boolean
}

interface IUserModel extends Model<IUser, {}, IUserMethods>{
	updatePassword: (email: string, newPassword: string) => Promise<void>
}

const PASSWORD_HASH_SALT_ROUNDS = 10;

userSchema.methods.generateToken = function(){
	return jwt.sign({userId: this._id}, process.env.JWT_SECRET as string, {expiresIn: '10d'});
}
userSchema.methods.comparePassword = function(password: string){
	return bcrypt.compareSync(password, this.password);
}

userSchema.statics.updatePassword = async function(email: string, newPassword: string){
	const hashedPassword = bcrypt.hashSync(newPassword, PASSWORD_HASH_SALT_ROUNDS);
	await this.findOneAndUpdate({email}, {
		$set: {
			password: hashedPassword
		}
	});
}

userSchema.pre('save', function(next){
	if(this.isModified('password')){
		this.password = bcrypt.hashSync(this.password, PASSWORD_HASH_SALT_ROUNDS);
	}
	next();
});


const User = model<IUser, IUserModel>('User', userSchema);

export default User;
export {
	IUser,
	IUserModel
};
