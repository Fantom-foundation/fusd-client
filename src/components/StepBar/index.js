import React from 'react';
import styled from 'styled-components';

const StepBarContainer = styled.div`
  display: flex;
`;

const StepContainer = styled.div`
  display: inline-block;
  margin: 0 auto;
  overflow: hidden;
`;

const Steps = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  &::before {
    content: '';
    width: 100%;
    display: block;
    height: 4px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: #eee;
    z-index: 0;
  }
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  background-color: #eee;
  border-radius: 50px;
  margin-right: 80px;
  position: relative;
  &.active {
    background-color: #55b5e7;
  }
  &:last-child {
    margin-right: 0px;
  }
`;

function StepBar(props) {
  const steps = props.steps ? props.steps : [1, 2, 3];

  return (
    <StepBarContainer>
      <StepContainer>
        <Steps>
          {steps.map((stepNumber, index) => {
            return (
              <Step
                className={stepNumber <= props.step ? 'active' : ''}
                key={index}
              >
                {stepNumber}
              </Step>
            );
          })}
        </Steps>
      </StepContainer>
    </StepBarContainer>
  );
}

export default StepBar;
