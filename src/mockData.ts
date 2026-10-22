import { Quiz, Student, QuizSubmission } from './types';

export const INITIAL_CLASSES = ['10A1', '10A2', '11B1', '12C1'];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'HS001', name: 'Nguyễn Văn An', className: '10A1', password: '123' },
  { id: 'HS002', name: 'Trần Thị Bình', className: '10A1', password: '123' },
  { id: 'HS003', name: 'Lê Hoàng Cường', className: '10A1', password: '123' },
  { id: 'HS004', name: 'Phạm Thị Dung', className: '10A2', password: '123' },
  { id: 'HS005', name: 'Hoàng Văn Em', className: '10A2', password: '123' },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Kiểm tra 15 phút Toán học 10 - Đại số cơ bản',
    description: 'Đề kiểm tra trắc nghiệm kết hợp nhiều dạng câu hỏi: 4 lựa chọn, đúng sai và điền khuyết.',
    subject: 'Toán học',
    durationMinutes: 15,
    passingScore: 5.0,
    totalQuestionsToTake: 5,
    shuffleQuestions: true,
    shuffleOptions: true,
    assignedClasses: ['10A1', '10A2'],
    startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: 'Thầy Giáo Admin',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        content: 'Cho tập hợp A = {1; 2; 3; 4} và B = {3; 4; 5; 6}. Giao của hai tập hợp A và B là gì?',
        options: [
          '{1; 2; 3; 4; 5; 6}',
          '{3; 4}',
          '{1; 2}',
          '{5; 6}'
        ],
        correctAnswer: 1,
        explanation: 'Giao của A và B gồm các phần tử vừa thuộc A vừa thuộc B, đó là {3; 4}.',
        points: 2
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        content: 'Hàm số nào sau đây là hàm số bậc nhất?',
        options: [
          'y = x^2 + 2x - 3',
          'y = 2/x + 1',
          'y = 3x - 5',
          'y = 4'
        ],
        correctAnswer: 2,
        explanation: 'Hàm số bậc nhất có dạng y = ax + b với a khác 0. Do đó y = 3x - 5 là hàm số bậc nhất.',
        points: 2
      },
      {
        id: 'q3',
        type: 'true_false',
        content: 'Mọi hình vuông đều là hình bình hành.',
        correctAnswer: true,
        explanation: 'Hình vuông có đầy đủ các tính chất của hình bình hành (các cạnh đối song song).',
        points: 2
      },
      {
        id: 'q4',
        type: 'true_false',
        content: 'Căn bậc hai của một số thực âm là một số thực dương.',
        correctAnswer: false,
        explanation: 'Trong tập số thực, số âm không có căn bậc hai.',
        points: 2
      },
      {
        id: 'q5',
        type: 'fill_in_blank',
        content: 'Tổng các góc trong một tam giác bằng [điền số] độ.',
        correctAnswer: '180',
        explanation: 'Định lý tổng 3 góc trong một tam giác luôn bằng 180 độ.',
        points: 2
      },
      {
        id: 'q6',
        type: 'fill_in_blank',
        content: 'Nghiệm của phương trình 2x - 4 = 0 là x = [điền số].',
        correctAnswer: '2',
        explanation: '2x = 4 => x = 2.',
        points: 2
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Kiểm tra 1 tiết Vật lý 10 - Động học chất điểm',
    description: 'Kiểm tra kiến thức về chuyển động thẳng đều, biến đổi đều và các định luật Newton.',
    subject: 'Vật lý',
    durationMinutes: 30,
    passingScore: 5.0,
    totalQuestionsToTake: 4,
    shuffleQuestions: true,
    shuffleOptions: true,
    assignedClasses: ['10A1'],
    startDate: new Date(Date.now() - 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: 'Cô Giáo Vật Lý',
    questions: [
      {
        id: 'p1',
        type: 'multiple_choice',
        content: 'Công thức tính vận tốc trong chuyển động thẳng biến đổi đều là gì?',
        options: [
          'v = v0 + at',
          'v = s / t',
          'v = at^2 / 2',
          'v = v0^2 + 2as'
        ],
        correctAnswer: 0,
        explanation: 'Công thức vận tốc là v = v0 + at.',
        points: 2.5
      },
      {
        id: 'p2',
        type: 'true_false',
        content: 'Trọng lực tác dụng vào vật có phương thẳng đứng, chiều hướng xuống.',
        correctAnswer: true,
        explanation: 'Trọng lực luôn hướng về tâm Trái Đất theo phương thẳng đứng.',
        points: 2.5
      },
      {
        id: 'p3',
        type: 'fill_in_blank',
        content: 'Gia tốc trọng trường g ở gần mặt đất thường được lấy xấp xỉ bằng [điền số] m/s^2.',
        correctAnswer: '9.8',
        explanation: 'Gia tốc trọng trường chuẩn là 9.8 m/s^2 hoặc 10 m/s^2.',
        points: 2.5
      },
      {
        id: 'p4',
        type: 'multiple_choice',
        content: 'Đơn vị của gia tốc trong hệ SI là:',
        options: ['m/s', 'm/s^2', 'kg.m/s', 'N.m'],
        correctAnswer: 1,
        explanation: 'Gia tốc đo bằng mét trên giây bình phương (m/s^2).',
        points: 2.5
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: QuizSubmission[] = [
  {
    id: 'sub-1',
    quizId: 'quiz-1',
    quizTitle: 'Kiểm tra 15 phút Toán học 10 - Đại số cơ bản',
    studentId: 'HS001',
    studentName: 'Nguyễn Văn An',
    className: '10A1',
    answers: {
      'q1': 1,
      'q2': 2,
      'q3': true,
      'q4': false,
      'q5': '180'
    },
    score: 10,
    correctCount: 5,
    totalQuestions: 5,
    timeSpentSeconds: 180,
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'completed',
    selectedQuestionIds: ['q1', 'q2', 'q3', 'q4', 'q5']
  }
];
