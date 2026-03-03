const mongoose = require('mongoose');

// 할 일(Todo) 스키마(데이터 구조) 정의
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // 필수 입력값으로 설정
  },
  isCompleted: {
    type: Boolean,
    default: false, // 생성 시 기본값은 '완료되지 않음(false)'
  },
  createdAt: {
    type: Date,
    default: Date.now, // 데이터가 생성된 시간 기록
  }
});

// 'Todo'라는 이름의 모델로 생성하여 내보내기
module.exports = mongoose.model('Todo', todoSchema);
