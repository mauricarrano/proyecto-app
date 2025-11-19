
import mongoose from 'mongoose';

// User Schema mirroring the User interface
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true }, // For authentication
  role: { 
    type: String, 
    required: true, 
    enum: ['student', 'professor', 'preceptor', 'student_union_member', 'director'] 
  },
  career: { 
    type: String, 
    required: true, 
    enum: ['software', 'design'] 
  },
  profilePictureUrl: String,
  studentId: String,
  yearOfStudy: String,
  aboutMe: String,
}, { timestamps: true });

// Attendance Schema mirroring AttendanceRecord
const AttendanceRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true }, // Can reference User._id or studentId string
  date: { type: String, required: true }, // ISO Date string YYYY-MM-DD
  subject: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['present', 'absent', 'justified', 'late'] 
  },
}, { timestamps: true });

// Grade Schema mirroring GradeStat
const GradeStatSchema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  firstSemester: Number,
  secondSemester: Number,
  finalGrade: Number,
}, { timestamps: true });

// Procedure Request Schema
const ProcedureRequestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  procedureTitle: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: { type: Date, default: Date.now },
});

// Export models, checking if they exist to prevent overwrite in hot-reload environments
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const AttendanceRecord = mongoose.models.AttendanceRecord || mongoose.model('AttendanceRecord', AttendanceRecordSchema);
export const GradeStat = mongoose.models.GradeStat || mongoose.model('GradeStat', GradeStatSchema);
export const ProcedureRequest = mongoose.models.ProcedureRequest || mongoose.model('ProcedureRequest', ProcedureRequestSchema);
