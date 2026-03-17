export interface User {
    id: number;
    username: string; 
    name?: string;    
    role: "user" | "teacher" | "admin" | string;
    password?: string;
}

export interface UserTableProps {
    users: User[];
    onUserClick: (user: User) => void;
    onRoleChange: (username: string, role: string) => void;
}

export interface Subject {
    id: number;
    name: string;
    teacher?: string;    
    teacherId?: number;
    studentIds?: number[];
}

export interface UseSubject { 
    id: number;
    name: string;
}

export interface Choice {
    id: number;
    question: number;
    text: string;
    is_correct: boolean;
}

export interface Question {
    id: number;
    subject: number;
    text: string;
    choices: Choice[];    
    options?: Choice[];   
}

export interface TestInput { 
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_answer: number;
}

export interface TestResult {
    id: number;
    subjectId: number;
    studentId: number;
    score: number;
    date: string;
}

export interface StudentResult { 
    id: number;
    student_name: string;
    correct_answers: number;
    incorrect_answers: number;
    created_at: string;
    subject_name: string;
    is_passed: boolean;
}

export interface TextInputProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
}