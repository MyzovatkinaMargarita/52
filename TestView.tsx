import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite'; 
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionBlock } from './QuestionBlock'; 
import { TimerBox } from './TimerBox';

const Actions = styled.div`
  margin-top: 8px;
`;

const SubmitBtn = styled.button`
  padding: 12px 18px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(180deg, #4f8cff, #3675f4);
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const QuizPage = observer(({ vm }: { vm: any }) => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const reviewMap = vm.store.reviewByQuestionId;

  return (
    <div>
      <TimerBox
        key={`${testId}-${vm.store.durationSec}`} 
        durationSec={vm.store.durationSec}
        spentSec={vm.store.spentSec}
      />

      {vm.store.questions.map((q: any) => (
        <QuestionBlock
          key={q.id}
          question={q}
          reviewItem={reviewMap?.get(q.id)}
          value={
            vm.store.answers[q.id]?.value ??
            (q.type === "multiple"
              ? []
              : q.type === "text"
              ? ""
              : null)
          }
          onChange={(val: any) => vm.setAnswer(q.id, val)}
        />
      ))}

      <Actions>
        <SubmitBtn
          onClick={() => vm.requestFinish(navigate)}
          disabled={vm.store.showResult}
        >
          Отправить
        </SubmitBtn>
      </Actions>
    </div>
  );
});
