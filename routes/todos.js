const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// 할 일 생성 API (POST 요청)
router.post('/', async (req, res) => {
  try {
    // 클라이언트가 보낸 데이터(body)에서 text 추출
    const { text } = req.body;

    // 내용이 없는 경우 에러 처리
    if (!text) {
      return res.status(400).json({ message: '할 일을 입력해주세요.' });
    }

    // 데이터베이스에 저장할 새로운 할 일 문서(Document) 생성
    const newTodo = new Todo({
      text: text
    });

    // 몽고디비에 실제 저장 수행
    const savedTodo = await newTodo.save();

    // 저장 성공 응답
    res.status(201).json({ 
      message: '할 일이 성공적으로 저장되었습니다.', 
      data: savedTodo 
    });
  } catch (error) {
    // 에러 발생 시 응답
    console.error('할 일 생성 에러:', error);
    res.status(500).json({ 
      message: '서버 오류로 인해 할 일을 생성하지 못했습니다.', 
      error: error.message 
    });
  }
});

// 모든 할 일 조회 API (GET 요청)
router.get('/', async (req, res) => {
  try {
    // 데이터베이스에서 모든 할 일 데이터를 가져옴 (최신순 정렬)
    const todos = await Todo.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: '할 일 목록을 성공적으로 불러왔습니다.',
      data: todos
    });
  } catch (error) {
    console.error('할 일 조회 에러:', error);
    res.status(500).json({
      message: '서버 오류로 인해 할 일 목록을 불러오지 못했습니다.',
      error: error.message
    });
  }
});

// 특정 할 일 상태 수정 API (PUT 요청)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isCompleted } = req.body;

    // 전달받은 ID로 해당 데이터를 찾아 업데이트 (새로운 데이터 반환 옵션 추가)
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, isCompleted },
      { new: true } // 업데이트 후의 결과를 반환하도록 설정
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
    }

    res.status(200).json({
      message: '할 일이 성공적으로 수정되었습니다.',
      data: updatedTodo
    });
  } catch (error) {
    console.error('할 일 수정 에러:', error);
    res.status(500).json({
      message: '서버 오류로 인해 할 일을 수정하지 못했습니다.',
      error: error.message
    });
  }
});

// 특정 할 일 삭제 API (DELETE 요청)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 전달받은 ID로 해당 데이터를 찾아 삭제
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
    }

    res.status(200).json({
      message: '할 일이 성공적으로 삭제되었습니다.',
      data: deletedTodo
    });
  } catch (error) {
    console.error('할 일 삭제 에러:', error);
    res.status(500).json({
      message: '서버 오류로 인해 할 일을 삭제하지 못했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
