import { Injectable } from '@angular/core';

@Injectable()
export class AnswersService {

	correctAnswer: string;
	incorrectAnswers: string[];
	compoundAnswers: string[];

  constructor() { }

  getCompoundAnswers(inc: string[], cor: string) {

  	inc.push(cor);
  	this.correctAnswer = cor;
  	return this.compoundAnswers = inc;

  }

  getCorrectAnswer(): string {
  	return this.correctAnswer;
  }

  checkAnswer(answer: string, callback: any): string {
  	if (answer === this.correctAnswer) {
  		callback();
  		return "true";
  	} else {
  		callback();
  		return "false";
  	}
  }

}
