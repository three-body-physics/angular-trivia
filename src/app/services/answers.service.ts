import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AnswerButtonComponent } from './../answer-button/answer-button.component';

@Injectable()
export class AnswersService {

	correctAnswer: string;
	incorrectAnswers: string[];
	compoundAnswers: string[];

  constructor(private el: ElementRef) { }

  getCompoundAnswers(inc: string[], cor: string) {

  	inc.push(cor);
    
  	this.correctAnswer = this.cleanUP(cor);

    var cleanInc = inc.map(ans=>{
      
      return this.cleanUP(ans);

    });

  	return this.compoundAnswers = this.shuffleAnswers(cleanInc);

  }

  cleanUP(str: string) {

      return str.replace(/&(lt|gt|quot|amp|ldquo|#039|eacute|ntilde|aacute|oacute);/g, (m, p) => {
      return (p == "quot") ? '"' : ((p == "eacute") ? "e'" : (p == "ntilde") ? "n" : (p == "aacute") ? "a" : "'");
    });

  }

  shuffleAnswers(arr: any) {

    let counter = arr.length;
    
    while (counter > 0) {
        
        let i = Math.floor(Math.random() * counter);        
        counter--;        
        let temp = arr[counter];
        arr[counter] = arr[i];
        arr[i] = temp;

    }

    return arr;
  }

  getCorrectAnswer(): string {
  	return this.cleanUP(this.correctAnswer);
  }

  checkAnswer(answer: string, callback: any, el: any, answerButtons: AnswerButtonComponent[]): string {
      
      
      
      answerButtons.forEach(button => {
        button.confirmAnswer(this.correctAnswer);
      });

      setTimeout(function(){ callback(); }, 1500);  	

    if (answer === this.correctAnswer) {   	

  		return "true";

  	} else {  
      		
  		return "false";

  	}
  }

}
